import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";

export default function Login(props) {
  /* Extrae el navigation de los props  */
  const { navigation } = props;

  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.viewContainer}>
        <Text>Form login...</Text>
        <CreateAccount navigation={navigation} />
      </View>
      <Divider style={styles.divider}></Divider>
      <View style={styles.viewContainer}>
        <Text>Login Facebook</Text>
      </View>
    </ScrollView>
  );
}
//funcion para redireccionar a ventana registrar
function CreateAccount(props) {
  const { navigation } = props;
  return (
    <Text style={styles.textRegister}>
      ¿Aun no tienes una cuenta?{""}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("Register")}
      >
        Registrate
      </Text>
    </Text>
  );
}

//Estilos
const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: "#00a680",
    margin: 40
  }
});
