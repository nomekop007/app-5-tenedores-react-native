import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
  /* recatando los props necesarios */
  const { displayName, setIsVisibleModal, setReloadData, toastRef } = props;

  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /* validar y modificar nombre de usuario */
  const updateDisplayName = () => {
    setError(null);
    if (!newDisplayName) {
      setError("El Nombre de usuario no es valido");
    } else {
      setIsLoading(true);
      const update = {
        displayName: newDisplayName
      };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setIsLoading(false);
          setReloadData(true);
          toastRef.current.show("Nombre actualizado correctamente");
          setIsVisibleModal(false);
        })
        .catch(() => {
          setError("Error al actualizar el nombre");
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={StyleSheet.view}>
      <Input
        placeholder="Nombre"
        maxLength={30}
        containerStyle={styles.input}
        defaultValue={displayName && displayName}
        onChange={e => setNewDisplayName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2"
        }}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updateDisplayName}
        loading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
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
