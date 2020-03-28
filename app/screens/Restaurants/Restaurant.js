import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import * as firebase from "firebase";
import Carousel from "../../components/Carousel";

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  /* extrae el restorante de los params enviados de los props */
  const { restaurant } = navigation.state.params.restaurant.item;

  /* array para el carrucel de imagenes */
  const [imagesRestorant, setImagesRestorant] = useState([]);

  /* octener imagenes del restorant */
  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        /* recorre(map) y extrae todas las fotos y las guarda en el array */
        restaurant.images.map(async idImage => {
          await firebase
            .storage()
            .ref(`restaurant-images/${idImage}`)
            .getDownloadURL()
            .then(imageURl => {
              /* se agrega la imagen al array */
              arrayUrls.push(imageURl);
            });
        })
      );
      /* se agrega el array al estado setimagensRestorant */
      setImagesRestorant(arrayUrls);
    })();
  }, []);

  return (
    <View>
      <Text>Pagina del restaurante</Text>
      <Carousel
        arrayImages={imagesRestorant}
        width={screenWidth}
        height={200}
      />
    </View>
  );
}
