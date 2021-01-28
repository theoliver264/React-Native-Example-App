import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  ToastAndroid,
} from "react-native";
import Constants from "expo-constants";
import { useUser } from "../hooks/user";
import { Redirect, useHistory } from "react-router-native";
import { FAB } from "react-native-paper";
import { AppBar } from "../components/appbar";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export function AddStorePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const { currentUser } = useUser();
  const history = useHistory();

  useEffect(() => {
    if (!currentUser.id) {
      history.push("/login");
    }
  }, [currentUser]);

  const registerNewStore = async () => {
    if (name === null || name === "") {
      ToastAndroid.show("Ingrese un nombre", 2000);
      return false;
    }
    if (address === null || address === "") {
      ToastAndroid.show("Ingrese una dirección", 2000);
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM stores WHERE userID = ? AND (name = ? OR address = ?) ",
          [currentUser.id, name, address],
          (_, { rows }) => {
            if (rows.length < 1) {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "INSERT INTO stores (name, address, userID) values (?, ? ,?)",
                    [name, address, currentUser.id]
                  );
                },
                (e) => console.log(e),
                () => {
                  ToastAndroid.show("Sucursal Registrada", 3000);
                }
              );
            } else {
              ToastAndroid.show("Sucursal ya existe", 3000);
            }
          }
        );
      },
      (e) => console.log(e),
      null
    );
  };

  return (
    <View style={styles.container}>
      <AppBar backButton title="Añadir Sucursal" />
      <View
        style={{
          height: "100%",
          padding: 8,
        }}
      >
        <Text style={styles.inputLabel}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          onChangeText={(text) => setName(text)}
          value={name}
        />

        <Text style={styles.inputLabel}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          onChangeText={(text) => setAddress(text)}
          value={address}
        />

        <View style={{ alignItems: "center" }}>
          <Button
            style={styles.loginButton}
            title="Registrar"
            onPress={() => registerNewStore()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    paddingTop: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 8,
  },
  inputLabel: {
    marginHorizontal: 16,
    marginBottom: 4,
  },
});
