import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Button, AirbnbRating, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseapp } from "../../utils/Firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);

export default function AddReviewRestaurant(props) {
  const { navigation } = props;
  /* recupera la id del props en los params de navegation */
  const { idRestaurant, setReviwsReload } = navigation.state.params;

  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  /* validar y guardar comentario */
  const addReview = () => {
    if (rating == null) {
      toastRef.current.show("No has dado ninguna puntuacion");
    } else if (!title) {
      toastRef.current.show("El Titulo es obligatorio");
    } else if (!review) {
      toastRef.current.show("El Comentario es obligatorio");
    } else {
      /* guardar datos */
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant: idRestaurant,
        title: title,
        review: review,
        rating: rating,
        createAt: new Date()
      };

      db.collection("reviews")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          toastRef.current.show(
            "error al enviar la review, intentelo mas tarde"
          );
          setIsLoading(false);
        });
    }
  };

  /* actualizar el restaurant  */
  const updateRestaurant = () => {
    /* se busca el restorante mediante la id */
    const restorantRef = db.collection("restaurants").doc(idRestaurant);
    restorantRef.get().then(response => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restorantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting
        })
        .then(() => {
          setReviwsReload(true);
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Pesimo", "Deficiente", "Normal", "muy bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={value => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Titulo"
          containerStyle={styles.input}
          onChange={e => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Comentario..."
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={e => setReview(e.nativeEvent.text)}
        />
        <Button
          containerStyle={styles.btnContainer}
          title="Enviar Comentario"
          onPress={addReview}
          buttonStyle={styles.btn}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={isLoading} text="Enviando comentario" />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2"
  },
  formReview: {
    margin: 10,
    marginTop: 40,
    flex: 1,
    alignItems: "center"
  },
  input: {
    marginBottom: 10
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end" /* mandar boton al fina lde pagina */,
    marginTop: 20,
    marginBottom: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
