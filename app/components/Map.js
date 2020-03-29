import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import openMap from "react-native-open-maps";

export default function Map(props) {
  const { location, name, height } = props;

  /* funcion para abrir el mapa */
  const openAppMapa = () => {
    openMap({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 19,
      query: name
    });
  };

  return (
    <MapView
      style={{ height: height, width: "100%" }}
      initialRegion={location}
      onPress={openAppMapa}
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}
      />
    </MapView>
  );
}
