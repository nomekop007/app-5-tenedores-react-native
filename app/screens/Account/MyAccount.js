import React, { useState, useEffect } from "react";
import * as firebase from "firebase";

import Loading from "../../components/Loading";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";

export default function MyAccount() {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      //pregunta  si user es null o false
      !user ? setLogin(false) : setLogin(true);
    });
  }, []);

  //se esta cargando la ventana
  if (login === null) {
    return <Loading isVisible={true} text="Cargando..." />;
  }

  //pregunta si el usuario esta logeado o no y envia a la ventana
  return login ? <UserLogged /> : <UserGuest />;
}
