import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, View, Text, Dimensions } from "react-native";
import { Rating, Icon, ListItem } from "react-native-elements";
import Carousel from "../../components/Carousel";
import Map from "../../components/Map";
import ListReview from "../../components/Restaurants/ListReviews";
import Toast from "react-native-easy-toast";

import { firebaseapp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation } = props;
  /* extrae el restorante de los params enviados de los props */
  const { restaurant } = navigation.state.params;

  /* array para el carrucel de imagenes */
  const [imagesRestorant, setImagesRestorant] = useState([]);
  /* se guarda el rating total */
  const [rating, setRating] = useState(restaurant.rating);
  /* estado de favorito */
  const [isFavorite, setIsFavorite] = useState(false);

  /* validar si el usuario esta logeado o no */
  const [userLogged, setUserLogged] = useState(false);
  /* iniciar el toast */
  const toastRef = useRef();

  /* ERROR EN VER SI ESTA LOGEADO */
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  /* octener el carrucel de imagenes del restorant */
  useEffect(() => {
    const arrayUrls = [];
    (async () => {
      await Promise.all(
        /* recorre(map) y extrae todas las fotos y las guarda en el array */
        restaurant.images.map(async (idImage) => {
          await firebase
            .storage()
            .ref(`restaurant-images/${idImage}`)
            .getDownloadURL()
            .then((imageURl) => {
              /* se agrega la imagen al array */
              arrayUrls.push(imageURl);
            });
        })
      );
      /* se agrega el array al estado setimagensRestorant */
      setImagesRestorant(arrayUrls);
    })();
  }, []);

  /* octener si el restorante es favorito de este usuario o no */
  useEffect(() => {
    if (userLogged) {
      /* consulta con where en la base de datos para devolver solo un campo */
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
          }
        });
    }
  }, []);

  /* funciones para agregar y borrar favorito */
  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para usar sistema de favoritos tienes que estar logeado",
        3000
      );
    } else {
      /* crear objeto que se guardara en base de datos */
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Restorante añadido a la lista de favoritos");
        })
        .catch(() => {
          toastRef.current.show(
            "Error al añadir el restorante a la lista de favoritos, intentelo mas tarde"
          );
        });
    }
  };
  const removeFavorite = () => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        /* se octiene el response (objeto de la base de datos) */
        response.forEach((doc) => {
          /* extrae la id del response */
          const idFavorite = doc.id;
          /* se busca el objeto on la idfavorite y se elimina de la db */
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                "Restaurante eliminado de la lista de favoritos"
              );
            })
            .catch(() => {
              toastRef.current.show(
                "No se ha podido eliminar el restaurante de la lista de favoritos, intentelo mas tarde"
              );
            });
        });
      });
  };

  return (
    <ScrollView style={styles.viewBody}>
      {/* boton de me gusta */}
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#00a680" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
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
      <Toast ref={toastRef} position="center" opacity={0.5} />
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
      action: null,
    },
    {
      text: number,
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: email,
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
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
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },
  viewRestorantTitle: {
    margin: 15,
  },
  nameRestorant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  descriptionRestorant: {
    marginTop: 20,
    color: "grey",
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
});
