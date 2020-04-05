import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Card, Image, Icon, Rating } from "react-native-elements";
import * as firebase from "firebase";

export default function ListTopRestaurants(props) {
  const { navigation, restaurants } = props;

  return (
    /* renderiza todo los restauranes */
    <FlatList
      data={restaurants}
      renderItem={(restaurant) => (
        <Restaurant restaurant={restaurant} navigation={navigation} />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

/* componente que renderisa cada restaurante  */
function Restaurant(props) {
  const { restaurant, navigation } = props;
  const { name, description, images, rating } = restaurant.item;
  const [imageRestaurant, setImageRestaurant] = useState(null);
  /* color del puestos de ranking */
  const [iconColor, setIconColor] = useState("#000");

  /* se extraen la imagenes de los restauranes */
  useEffect(() => {
    const image = images[0];
    firebase
      .storage()
      .ref(`restaurant-images/${image}`)
      .getDownloadURL()
      .then((Response) => {
        setImageRestaurant(Response);
      });
  }, []);

  useEffect(() => {
    if (restaurant.index === 0) {
      setIconColor("#efb819");
    } else if (restaurant.index === 1) {
      setIconColor("#e3e4e5");
    } else if (restaurant.index === 2) {
      setIconColor("#cd7f32");
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Restaurant", { restaurant: restaurant.item })
      }
    >
      <Card containerStyle={StyleSheet.containerCard}>
        <Icon
          type="material-community"
          name="chess-queen"
          color={iconColor}
          size={40}
          containerStyle={Styles.containerIcon}
        />
        <Image
          style={Styles.restaurantImage}
          resizeMode="cover"
          source={{ uri: imageRestaurant }}
        />
        <View style={Styles.titleRanking}>
          <Text style={Styles.title}>{name}</Text>
          <Rating
            imageSize={20}
            startingValue={rating}
            readonly
            style={Styles.rating}
          />
        </View>
        <Text style={Styles.description}>{description}</Text>
      </Card>
    </TouchableOpacity>
  );
}

const Styles = StyleSheet.create({
  containerCard: {
    marginBottom: 30,
    borderWidth: 0,
  },
  containerIcon: {
    position: "absolute",
    top: -30,
    left: -30,
    zIndex: 1,
  },
  restaurantImage: {
    width: "100%",
    height: 200,
  },
  titleRanking: {
    flexDirection: "row",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  description: {
    color: "grey",
    marginTop: 0,
    textAlign: "justify",
  },
});
