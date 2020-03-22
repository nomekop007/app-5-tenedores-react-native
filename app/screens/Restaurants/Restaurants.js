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
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const limitRestaurant = 8;

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
  }, []);

  return (
    <View style={styles.viewBody}>
      <ListRestaurant restaurants={restaurants} isLoading={isLoading} />
      {/* condicion de si el user != null se muestra el componente */}
      {user && <AddRestaurantButton navigation={navigation} />}
    </View>
  );
}

/* funcion del button de agregar restauranes */
function AddRestaurantButton(props) {
  const { navigation } = props;
  return (
    <ActionButton
      buttonColor="#00a680"
      onPress={() => navigation.navigate("AddRestaurant")}
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  }
});
