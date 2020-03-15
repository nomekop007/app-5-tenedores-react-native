import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";

export default function RegisterForm() {
  //funciones para mostrar y ocultar contraseña
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);

  const register = () => {
    console.log("usuario registrado");
  };

  return (
    <View style={styles.fomrContainer} behavior="padding" enable>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputFrom}
        onChange={() => console.log("Email Actualizado")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        password={true} /* tipo contraseña */
        secureTextEntry={hidePassword} /* ocultar contraseña */
        containerStyle={styles.inputFrom}
        onChange={() => console.log("contraseña actualizada")}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />

      <Input
        placeholder="Repetir Contraseña"
        password={true} /* tipo contraseña */
        secureTextEntry={hideRepeatPassword} /* ocultar contraseña */
        containerStyle={styles.inputFrom}
        onChange={() => console.log("Repetir contraseña actualizada")}
        rightIcon={
          <Icon
            type="material-community"
            name={hideRepeatPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHideRepeatPassword(!hideRepeatPassword)}
          />
        }
      />

      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
    </View>
  );
}

//estilos del formulario
const styles = StyleSheet.create({
  fomrContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputFrom: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%"
  },
  btnRegister: {
    backgroundColor: "#00a680"
  }
});
