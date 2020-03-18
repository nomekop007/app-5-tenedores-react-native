import * as firebase from "firebase";

/* funcion que reautentica a un usuario logeado */
export const reauthenticate = password => {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(credentials);
};
