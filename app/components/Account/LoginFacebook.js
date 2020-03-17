import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/Social";
import Loading from "../Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  /* ventana loading si o no */
  const [isLoading, setIsLoading] = useState(false);
  const login = async () => {
    /* inicinado SDK */
    Facebook.initializeAsync(FacebookApi.application_id, "5-tenedores");

    /* metodo de autenticacion facebook */
    const {
      type,
      token
    } = await Facebook.logInWithReadPermissionsAsync(
      FacebookApi.application_id,
      { permissions: FacebookApi.permissions }
    );
    /* validacion de autenticacion */
    if (type === "success") {
      setIsLoading(true);
      const credentials = firebase.auth.FacebookAuthProvider.credential(token);
      await firebase
        .auth()
        .signInWithCredential(credentials)
        .then(() => {
          navigation.navigate("MyAccount");
        })
        .catch(() => {
          toastRef.current.show(
            "Error accediendo con facebook, intentelo mas tarde"
          );
        });
    } else if (type === "cancel") {
      toastRef.current.show("Inicio de Sesion cancelado");
    } else {
      toastRef.current.show("Error desconocido, intentelo mas tarde");
    }
    setIsLoading(false);
  };

  return (
    <>
      <SocialIcon
        title="Iniciar sesion con Facebook"
        button
        type="facebook"
        onPress={login}
      />

      <Loading isVisible={isLoading} text="Iniciando sesion" />
    </>
  );
}
