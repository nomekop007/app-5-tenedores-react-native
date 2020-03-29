import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import Modal from "../Modal";
import * as Location from "expo-location";
import uuid from "uuid/v4";
import { firebaseapp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
/* llamando la base de datos firestone */
const db = firebase.firestore(firebaseapp);

/* se cactura el ancho de la pantalla del movil */
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  /* extrae las propiedades del appRestaurant a traves de props */
  const { toastRef, setIsLoading, navigation, setIsReloadRestaurants } = props;

  /* funcion con array donde se guardan las imagenes seleccionadas */
  const [imagesSelected, setImageSeleted] = useState([]);

  /* estados para el componente formAdd */
  const [restaurantName, setsrestaurantName] = useState("");
  const [restaurantAddress, setrestaurantAddress] = useState("");
  const [restaurantDescription, setrestaurantDescription] = useState("");
  const [restaurantEmail, setrestaurantEmail] = useState("");
  const [restaurantNumber, setrestaurantNumber] = useState("");

  /* estados para el componente map */
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  /* funcion agregar y validar restaurante */
  const addRestaurante = () => {
    if (
      !restaurantName ||
      !restaurantAddress ||
      !restaurantDescription ||
      !restaurantEmail ||
      !restaurantNumber
    ) {
      toastRef.current.show(
        "Todos los Campos del formularios son obligatorios"
      );
    } else if (imagesSelected.length === 0) {
      toastRef.current.show("El restaurante tiene que tener almenos una foto");
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurante en el mapa");
    } else {
      setIsLoading(true);
      /* guardar Restaurante en storage */
      uploadImagesStorage(imagesSelected).then(arrayImages => {
        /* creado el json restaurante en firestore */

        db.collection("restaurants")
          .add({
            name: restaurantName,
            address: restaurantAddress,
            description: restaurantDescription,
            email: restaurantEmail,
            number: restaurantNumber,
            location: locationRestaurant,
            images: arrayImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid
          })
          .then(() => {
            setIsLoading(false);
            setIsReloadRestaurants(true);
            navigation.navigate("Restaurants");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al subir el restaurante, intente mas tarde"
            );
          });
      });
    }
  };

  const uploadImagesStorage = async imageArray => {
    const imageBlob = [];
    await Promise.all(
      /* se recorre cada imagen del array  */
      imageArray.map(async image => {
        const response = await fetch(image);
        const blob = await response.blob();
        /* se guarda cada imagen en el storage */
        const ref = firebase
          .storage()
          .ref("restaurant-images")
          .child(uuid());
        await ref.put(blob).then(result => {
          /* se guardan las imagenes en el array imageBlob */
          imageBlob.push(result.metadata.name);
        });
      })
    );
    return imageBlob;
  };

  return (
    <ScrollView>
      {/* componente de mostrar el fondo */}
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />

      {/* componente de formulario de inputs */}
      <FormAdd
        setsrestaurantName={setsrestaurantName}
        setrestaurantAddress={setrestaurantAddress}
        setrestaurantDescription={setrestaurantDescription}
        setrestaurantEmail={setrestaurantEmail}
        setrestaurantNumber={setrestaurantNumber}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />

      {/* componente de agregar imagenes */}
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSeleted={setImageSeleted}
        toastRef={toastRef}
      />

      <Button
        title="Crear Restaurante"
        onPress={addRestaurante}
        buttonStyle={styles.btnAddRestaurant}
      />
      {/* componente boton mapa */}
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  /* se extrae la primera imagen del array imagesSelected y se agrega de fondo */
  const { imageRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      {imageRestaurant ? (
        <Image
          source={{ uri: imageRestaurant }}
          style={{ width: widthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: widthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImage(props) {
  /* extraer valores */
  const { imagesSelected, setImageSeleted, toastRef } = props;

  /* funcion para seleccionar imagen y guardarla en un array */
  const imageSelect = async () => {
    /* pedir permisos de usar camara */
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === "denied") {
      toastRef.current.show(
        "es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente",
        6000
      );
    } else {
      /* permiso autorizado */
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3]
      });
      if (result.cancelled) {
        toastRef.current.show(
          "has cerrado la galeria sin seleccionar ninguna imagen"
        );
      } else {
        /* agregar imagen al array */
        setImageSeleted([...imagesSelected, result.uri]);
      }
    }
  };

  /* funcion para eliminar imagen */
  const removeImage = image => {
    const arrayImages = imagesSelected;
    Alert.alert(
      "Eliminar Imagen",
      "¿Estas seguro de Eliminar la imagen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () =>
            setImageSeleted(arrayImages.filter(imageUrl => imageUrl !== image))
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.viewImages}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {imagesSelected.map(imageRestaurant => (
        <Avatar
          key={imageRestaurant}
          onPress={() => removeImage(imageRestaurant)}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
        />
      ))}
    </View>
  );
}

function FormAdd(props) {
  const {
    setsrestaurantName,
    setrestaurantAddress,
    setrestaurantDescription,
    setrestaurantEmail,
    setrestaurantNumber,
    setIsVisibleMap,
    locationRestaurant
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={e => setsrestaurantName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Direccion"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true)
        }}
        onChange={e => setrestaurantAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Email de restaurante"
        containerStyle={styles.input}
        onChange={e => setrestaurantEmail(e.nativeEvent.text)}
      />
      <Input
        placeholder="Numero del restaurante"
        containerStyle={styles.input}
        onChange={e => setrestaurantNumber(e.nativeEvent.text)}
      />
      <Input
        placeholder="Descripcion del Restaurante"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={e => setrestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setIsVisibleMap,
    setLocationRestaurant,
    toastRef
  } = props;

  const [location, setLocation] = useState(null);

  /* preguntar permisos de localizacion */
  useEffect(() => {
    (async () => {
      const resultPermission = await Permissions.askAsync(Permissions.LOCATION);
      const statusPermission = resultPermission.permissions.location.status;

      /* el permiso no fue aceptado? */
      if (statusPermission !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localizacion para crear un restaurante",
          3000
        );
      } else {
        /* se cactura la localizacion */
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show("Localizacion guardada correctamente");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {/* pregunta si location no es null */}
        {location && (
          <MapView
            style={styles.mapStyles}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={region => setLocation(region)}
          >
            {/* marcador dinamico que sigue la ubicacion */}
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicacion"
            onPress={confirmLocation}
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
          />
          <Button
            title="Cancelar Ubicacion"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20
  },
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0
  },
  mapStyles: {
    width: "100%",
    height: 550
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  viewMapBtnContainerSave: {
    paddingRight: 5
  },
  viewMapBtnContainerCancel: {
    paddingRight: 5
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680"
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d"
  },
  btnAddRestaurant: {
    backgroundColor: "#00a680",
    margin: 20
  }
});
