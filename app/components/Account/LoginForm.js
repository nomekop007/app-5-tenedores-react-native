import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import Loading from "../Loading";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";

function LoginForm(props) {
  //extrayendo toast del props
  const { toastRef, navigation } = props;
  //estado para mostrar y ocultar contraseña
  const [hidePassword, setHidePassword] = useState(true);
  // estados de los valores de los datos del form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //estado para mostrar o no el Loading
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);

  //validar login
  const login = async () => {
    setIsVisibleLoading(true); /* loading */
    if (!email || !password) {
      toastRef.current.show("todos los campos son obilgatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("email no es correcto");
      } else {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            navigation.navigate("MyAccount");
          })
          .catch(() => {
            toastRef.current.show("email o contraseña incorrecta");
          });
      }
    }
    setIsVisibleLoading(false);
  };
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electronico"
        maxLength={30}
        containerStyle={styles.inputForm}
        onChange={e => setEmail(e.nativeEvent.text)}
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
        containerStyle={styles.inputForm}
        password={true}
        maxLength={30}
        secureTextEntry={hidePassword}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />

      <Button
        title="Iniciar sesion"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={login}
      />
      <Loading isVisible={isVisibleLoading} text="Iniciando sesion" />
    </View>
  );
}

export default withNavigation(LoginForm);

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30
  },
  inputForm: {
    width: "100%",
    marginTop: 20
  },
  iconRight: {
    color: "#c1c1c1"
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%"
  },
  btnLogin: {
    backgroundColor: "#00a680"
  }
});
