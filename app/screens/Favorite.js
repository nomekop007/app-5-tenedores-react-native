import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";
import { NavigationEvents } from "react-navigation";

import { firebaseapp } from "../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

export default function Favorites(props) {
  const { navigation } = props;
  /* array de lista de restoranes  */
  const [restaurants, setRestaurants] = useState([]);
  /* estado para resfrecar los restoranes ante algun cambio */
  const [reloadRestaurants, setReloadRestaurants] = useState(false);
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  /* estado de si el usuario esta logeado o no */
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  /* metodo que saca los restoranes favoritos del usuario */
  useEffect(() => {
    if (userLogged) {
      const idUser = firebase.auth().currentUser.uid;

      db.collection("favorites")
        .where("idUser", "==", idUser)
        .get()
        .then(response => {
          /* recorre el response y va guardando las ids en el array */
          const idRestaurantsArray = [];
          response.forEach(doc => {
            idRestaurantsArray.push(doc.data().idRestaurant);
          });

          /* se pasa el arrays de ids */
          getDataRestaurants(idRestaurantsArray).then(response => {
            /* se devuelven todos los restauranes */
            const restaurants = [];
            response.forEach(doc => {
              let restaurant = doc.data();
              restaurant.id = doc.id;
              restaurants.push(restaurant);
            });
            setRestaurants(restaurants);
          });
        });
    }
    setReloadRestaurants(false);
  }, [reloadRestaurants]);

  /* funcion que devolvera todos los restaurantes 
  en base al arrays de ids de los restauranes */
  const getDataRestaurants = idRestaurantsArray => {
    const arrayRestaurants = [];
    idRestaurantsArray.forEach(idRestaurant => {
      const result = db
        .collection("restaurants")
        .doc(idRestaurant)
        .get();

      arrayRestaurants.push(result);
    });

    /*retorna como promesa porque es necesario que
     termine de recorrerce el array antes de retornar*/
    return Promise.all(arrayRestaurants);
  };

  if (!userLogged) {
    return (
      <UserNoLogged
        setReloadRestaurants={setReloadRestaurants}
        navigation={navigation}
      />
    );
  }

  if (restaurants.length === 0) {
    return <NotFondRestaurants setReloadRestaurants={setReloadRestaurants} />;
  }
  return (
    <View style={styles.viewBody}>
      {/* navigationevens es recargar nuevamente la pagina con la funcion */}
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      {/* se pregunta x si hay restoranes en el array*/}
      {restaurants ? (
        /* flatlist renderisa los items del arrays */
        <FlatList
          data={restaurants}
          renderItem={restaurant => (
            <Restorant
              setIsVisibleLoading={setIsVisibleLoading}
              setReloadRestaurants={setReloadRestaurants}
              toastRef={toastRef}
              restaurant={restaurant}
              navigation={navigation}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        /* es el espiner de cargando */
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text>Cargando restauranes</Text>
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={1} />
      <Loading Text="Eliminando Restaurante" isVisible={isVisibleLoading} />
    </View>
  );
}

/* metodo de cada restaurant */
function Restorant(props) {
  const {
    navigation,
    restaurant,
    setIsVisibleLoading,
    setReloadRestaurants,
    toastRef
  } = props;

  const { id, name, images } = restaurant.item;
  const [imageRestaurant, setImageRestaurant] = useState(null);

  /* extrae la imagen y la descarga */
  useEffect(() => {
    const image = images[0];
    /* extrae la url de cada imagen */
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then(response => {
        setImageRestaurant(response);
      });
  }, []);

  /* ventana de confirmacion de remover favorito */
  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar Restaurante de Favoritos",
      "¿Estas seguro de eliminar el restaurante de favoritos?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: removeFavorite
        }
      ],
      { cancelable: false }
    );
  };
  /* eliminar de base de datos */
  const removeFavorite = () => {
    setIsVisibleLoading(true);

    /* buscar la id del documento */
    db.collection("favorites")
      .where("idRestaurant", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        response.forEach(doc => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsVisibleLoading(false);
              setReloadRestaurants(true);
              toastRef.current.show("Restaurante Eliminado");
            })
            .catch(() => {
              toastRef.current.show(
                "Error al eliminar restaurante, intentelo mas tarde"
              );
            });
        });
      });
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Restaurant", { restaurant: restaurant.item })
        }
      >
        <Image
          resizeMode="cover"
          source={{ uri: imageRestaurant }}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Icon
          type="material-community"
          name="heart"
          color="#00a680"
          containerStyle={styles.favorite}
          onPress={confirmRemoveFavorite}
          size={40}
          underlayColor="transparent"
        />
      </View>
    </View>
  );
}

function NotFondRestaurants(props) {
  const { setReloadRestaurants } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restauranes en tu lista
      </Text>
    </View>
  );
}

function UserNoLogged(props) {
  const { setReloadRestaurants, navigation } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <NavigationEvents onWillFocus={() => setReloadRestaurants(true)} />
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        necesitas estar logeado para ver esta seccion
      </Text>
      <Button
        title="Ir al login"
        onPress={() => navigation.navigate("Login")}
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#00a680" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },
  restaurant: {
    margin: 10
  },
  image: {
    width: "100%",
    height: 180
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff"
  },
  name: {
    fontWeight: "bold",
    fontSize: 20
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100
  }
});
