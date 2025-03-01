import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button, colors } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";

export default function ChangePasswordForm(props) {
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPasword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewPasswordRepeat, sethideNewPasswordRepeat] = useState(true);

  const updatePassword = () => {
    setError({});
    /* validando campos vacios */
    if (!password || !newPassword || !newPasswordRepeat) {
      let objError = {};
      !password && (objError.password = "No puede estar vacio");
      !newPassword && (objError.newPassword = "No puede estar vacio");
      !newPasswordRepeat &&
        (objError.newPasswordRepeat = "No puede estar vacio");
      setError(objError);
    } else {
      /* validar si las nuevas contraseñas son iguales */
      if (newPassword !== newPasswordRepeat) {
        setError({
          newPassword: "Las nuevas contraseñas tiene que ser iguales",
          newPasswordRepeat: "Las nuevas contraseñas tiene que ser iguales"
        });
      } else {
        setIsLoading(true);
        reauthenticate(password)
          .then(() => {
            //es correcto
            firebase
              .auth()
              .currentUser.updatePassword(newPassword)
              .then(() => {
                setIsLoading(false);
                toastRef.current.show("Contraseña actualizada correctamente");
                setIsVisibleModal(false);
                //firebase.auth().signOut();
              })
              .catch(() => {
                //error general
                setError({
                  general: "Error al actualizar la contraseña"
                });
                setIsLoading(false);
              });
          })
          .catch(() => {
            //la contraseña fue incorrecta
            setError({
              password: "La contraseña no es correcta"
            });
            setIsLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.View}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={styles.input}
        password={true}
        maxLength={30}
        secureTextEntry={hidePassword}
        onChange={e => setPasword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.password}
      />
      <Input
        placeholder="Nueva contraseña"
        containerStyle={styles.input}
        password={true}
        maxLength={30}
        secureTextEntry={hideNewPassword}
        onChange={e => setNewPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword)
        }}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Repetir nueva contraseña"
        containerStyle={styles.input}
        password={true}
        maxLength={30}
        secureTextEntry={hideNewPasswordRepeat}
        onChange={e => setNewPasswordRepeat(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPasswordRepeat ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => sethideNewPasswordRepeat(!hideNewPasswordRepeat)
        }}
        errorMessage={error.newPasswordRepeat}
      />

      <Button
        title="Cambiar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={isLoading}
      />
      <Text>{error.general}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  View: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginBottom: 10
  },
  btnContainer: {
    marginTop: 20,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
