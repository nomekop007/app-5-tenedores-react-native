import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function AddRestaurantForm(props) {
  /* extrae las propiedades del appRestaurant a traves de props */
  const { toastRef, setIsLoading, navigation } = props;

  /* funcion con array donde se guardan las imagenes seleccionadas */
  const [imagesSelected, setImageSeleted] = useState([]);

  return (
    <ScrollView>
      <UploadImage
        imagesSelected={imagesSelected}
        setImageSeleted={setImageSeleted}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function UploadImage(props) {
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

const styles = StyleSheet.create({
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
    height: 60,
    width: 60,
    backgroundColor: "#e3e3e3"
  },
  miniatureStyle: {
    width: 60,
    height: 60,
    marginRight: 10
  }
});
