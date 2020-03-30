import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ListReview(props) {
  const { navigation, idRestaurant, setRating } = props;
  const [reviews, setReviews] = useState([]);
  const [reviwsReload, setReviwsReload] = useState(false);
  /* estado si esta logeado o no el usuario */
  const [userLoogged, setUserLoogged] = useState(false);

  /* preguntado si el usuario esta logeado o no */
  firebase.auth().onAuthStateChanged(user => {
    user ? setUserLoogged(true) : setUserLoogged(false);
  });

  /* funcion para actualziar y ver los comentarios de forma asincrona */
  useEffect(() => {
    (async () => {
      const resultReviews = [];
      const arrayRating = [];
      db.collection("reviews")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then(response => {
          response.forEach(doc => {
            resultReviews.push(doc.data());
            arrayRating.push(doc.data().rating);
          });

          /* se suma la cantidad de puntos de este restaurnte */
          let numSum = 0;
          arrayRating.map(value => {
            numSum = numSum + value;
          });
          /* se saca la media del restaurante */
          const countRating = arrayRating.length;
          const resultRating = numSum / countRating;
          const resultRatingFinsh = resultRating ? resultRating : 0;
          setReviews(resultReviews);
          setRating(resultRatingFinsh);
        });

      setReviwsReload(false);
    })();
  }, [reviwsReload]);

  return (
    <View>
      {userLoogged ? (
        <Button
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          title="EScribir una opinion"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#00a680"
          }}
          onPress={() =>
            navigation.navigate("AddReviewRestaurt", {
              idRestaurant: idRestaurant /* se pasa la id al la vista mediante params */,
              setReviwsReload: setReviwsReload /* se pasa el estado para actualizar */
            })
          }
        />
      ) : (
        <View>
          <Text
            style={{ textAlign: "center", color: "#00a680", padding: 20 }}
            onPress={() => navigation.navigate("Login")}
          >
            Para escribir un comentario es necesario estar logeado{" "}
            <Text style={{ fontWeight: "bold" }}>
              pulsa AQUI para iniciar sesion
            </Text>
          </Text>
        </View>
      )}

      {/* lista de comentarios */}
      <FlatList
        data={reviews}
        renderItem={review => <Review review={review} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function Review(props) {
  const { title, review, rating, createAt, avatarUser } = props.review.item;

  /* comvertir formato fecha */
  const createReview = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={{
            uri: avatarUser
              ? avatarUser
              : "https://api.adorable.io/avatars/285/abott@adorable.png"
          }}
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewtext}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {/* se extrae los parametros del date */}
          {createReview.getDate()}/{createReview.getMonth() + 1}/
          {createReview.getFullYear()} - {createReview.getHours()}:
          {createReview.getMinutes() < 10 ? "0" : ""}
          {createReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent"
  },
  btnTitleAddReview: {
    color: "#00a680"
  },
  viewReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  viewImageAvatar: {
    marginRight: 15
  },
  imageAvatarUser: {
    width: 50,
    height: 50
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start"
  },
  reviewTitle: {
    fontWeight: "bold"
  },
  reviewtext: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0
  }
});
