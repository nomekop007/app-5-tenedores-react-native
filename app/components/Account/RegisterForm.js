import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import Loading from "../Loading";

function RegisterForm(props) {
  //extrae los objetos del props
  const { toastRef, navigation } = props;
  //estado para mostrar y ocultar contraseña
  const [hidePassword, setHidePassword] = useState(true);
  const [hideRepeatPassword, setHideRepeatPassword] = useState(true);
  //estado para mostrar o no el Loading
  const [isVisibleLoading, setIsVisibleLoading] = useState(false);
  // estados de los valores de los datos del form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  //funcion para validar los campos con el boton unirse
  const register = async () => {
    setIsVisibleLoading(true); /* loading */
    if (!email || !password || !repeatPassword) {
      toastRef.current.show("todos los campos son obilgatorios");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("email no es correcto");
      } else {
        if (password !== repeatPassword) {
          toastRef.current.show("las contraseñas no son identicas");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              navigation.navigate("MyAccount");
              /* redirecciona a la otra pagina */
            })
            .catch(() => {
              toastRef.current.show(
                "Error al crear la cuenta intente mas tarde"
              );
            });
        }
      }
    }
    setIsVisibleLoading(false);
  };

  /* vista formulario */
  return (
    <View style={styles.fomrContainer} behavior="padding" enable>
      <Input
        placeholder="Correo electronico"
        containerStyle={styles.inputFrom}
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
        password={true} /* tipo contraseña */
        secureTextEntry={hidePassword} /* ocultar contraseña */
        containerStyle={styles.inputFrom}
        onChange={e => setPassword(e.nativeEvent.text)}
        /* se guarda el dato en la funcion */
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
        onChange={e => setRepeatPassword(e.nativeEvent.text)}
        /* se guarda el dato en la funcion */
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
      <Loading text="Creando cuenta" isVisible={isVisibleLoading} />
    </View>
  );
}

export default withNavigation(RegisterForm);

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
