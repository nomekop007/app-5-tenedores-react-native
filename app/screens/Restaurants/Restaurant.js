import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { Rating, Icon, ListItem } from "react-native-elements";
import * as firebase from "firebase";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReview from "../../components/Restaurants/ListReviews";

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  /* extrae el restorante de los params enviados de los props */
  const { restaurant } = navigation.state.params.restaurant.item;

  /* array para el carrucel de imagenes */
  const [imagesRestorant, setImagesRestorant] = useState([]);

  const [rating, setRating] = useState(restaurant.rating);

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
    <ScrollView style={styles.viewBody}>
      {/* carrusel de imagenes */}
      <Carousel
        arrayImages={imagesRestorant}
        width={screenWidth}
        height={200}
      />
      {/* componente titulo */}
      <TitleRestorant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      {/* componente info */}
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
        email={restaurant.email}
        number={restaurant.number}
      />
      <ListReview
        setRating={setRating}
        navigation={navigation}
        idRestaurant={restaurant.id}
      />
    </ScrollView>
  );
}

/* mostrar titulo,descripction y puntuacion */
function TitleRestorant(props) {
  const { name, description, rating } = props;
  return (
    <View style={styles.viewRestorantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestorant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly /* evitar que se modifique */
          startingValue={parseFloat(rating)} /* comvertir en un float */
        />
      </View>
      <Text style={styles.descriptionRestorant}>{description}</Text>
    </View>
  );
}

function RestaurantInfo(props) {
  const { location, name, address, email, number } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null
    },
    {
      text: number,
      iconName: "phone",
      iconType: "material-community",
      action: null
    },
    {
      text: email,
      iconName: "at",
      iconType: "material-community",
      action: null
    }
  ];
  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100} />
      {listInfo.map((item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680"
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRestorantTitle: {
    margin: 15
  },
  nameRestorant: {
    fontSize: 20,
    fontWeight: "bold"
  },
  rating: {
    position: "absolute",
    right: 0
  },
  descriptionRestorant: {
    marginTop: 20,
    color: "grey"
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1
  }
});
