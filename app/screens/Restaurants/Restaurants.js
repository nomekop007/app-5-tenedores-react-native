import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ActionButton from "react-native-action-button";
import ListRestaurant from "../../components/Restaurants/ListRestaurants";
import { firebaseapp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

export default function Restaurants(props) {
  const { navigation } = props;
  /* estado de si esta logeado o no el usuario */
  const [user, setUser] = useState(null);

  const [restaurants, setRestaurants] = useState([]);
  const [startRestorants, setStartRestorants] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloadRestaurants, setIsReloadRestaurants] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const limitRestaurant = 8; /* limites de restoranes cargados */

  /* extrae el usario logeado y lo almacena en user */
  useEffect(() => {
    firebase.auth().onAuthStateChanged(userInfo => {
      setUser(userInfo);
    });
  }, []);

  /* extrae la lista de restorantes de firestore */
  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then(snap => {
        setTotalRestaurants(snap.size);
      });
    (async () => {
      let resultRestaurant = [];
      const restaurants = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurant);

      await restaurants.get().then(response => {
        setStartRestorants(response.docs[response.docs.length - 1]);
        /* recorriendo restauranes */

        response.forEach(doc => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurant.push({ restaurant });
        });

        setRestaurants(resultRestaurant);
      });
    })();
    setIsReloadRestaurants(false);
  }, [isReloadRestaurants]);

  const handleLoadMore = async () => {
    const resultRestaurants = []; /* arreglo vacio */
    restaurants.length < totalRestaurants && setIsLoading(true);

    /* guardando el json de restoranes de la base de datos */
    const restaurantsDB = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestorants.data().createAt)
      .limit(limitRestaurant);

    await restaurantsDB.get().then(response => {
      if (response.docs.length > 0) {
        setStartRestorants(response.docs[response.docs.length - 1]);
      } else {
        setIsLoading(false);
      }

      /* recorriendo restoranes y guardandolos en el arreglo vacio */
      response.forEach(doc => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push({ restaurant });
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurant
        navigation={navigation}
        restaurants={restaurants}
        isLoading={isLoading}
        handleLoadMore={handleLoadMore}
      />
      {/* condicion de si el user != null se muestra el componente */}
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setIsReloadRestaurants={setIsReloadRestaurants}
        />
      )}
    </View>
  );
}

/* funcion del button de agregar restauranes */
function AddRestaurantButton(props) {
  const { navigation, setIsReloadRestaurants } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() =>
        navigation.navigate("AddRestaurant", { setIsReloadRestaurants })
      }
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
