import React from "react";
import Navigation from "./app/navigations/Navigation";
import { firebaseapp } from "./app/utils/Firebase";
import ignoreWarnings from "react-native-ignore-warnings";

export default function App() {
  /* quitar advertencias */
  ignoreWarnings("Setting a timer");
  ignoreWarnings("Warning: componentWillReceiveProps");
  ignoreWarnings("Warning: componentWillMount");
  return <Navigation />;
}
