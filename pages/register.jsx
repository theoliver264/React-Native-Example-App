import React, { useEffect, useState } from "react";
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
import * as SQLite from "expo-sqlite";
import { useHistory } from "react-router-native";
import { useUser } from "../hooks/user";

const db = SQLite.openDatabase("db.db");

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { currentUser } = useUser();

  useEffect(() => {
    if (currentUser.id) {
      history.push("/");
    }
  }, [currentUser]);

  const registerNewUser = async () => {
    if (name === null || name === "") {
      ToastAndroid.show("Ingrese un nombre", 2000);
      return false;
    }
    if (email === null || email === "") {
      ToastAndroid.show("Ingrese un email", 2000);
      return false;
    }
    if (password === null || password === "") {
      ToastAndroid.show("Ingrese una contraseña", 2000);
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (_, { rows }) => {
            if (rows.length < 1) {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "INSERT INTO users (name, username, email, password) values (?, ? ,? ,?)",
                    [name, name, email, password]
                  );
                },
                (e) => console.log(e),
                () => {
                  ToastAndroid.show("Usuario Registrado", 3000);
                  history.push("/login");
                }
              );
            } else {
              ToastAndroid.show("Usuario ya existe", 3000);
            }
          }
        );
      },
      (e) => console.log(e),
      null
    );
  };

  useEffect(() => {}, []);

  if (currentUser.id) {
    return <Redirect to="/" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.inputLabel}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        onChangeText={(text) => setName(text)}
        value={name}
      />

      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <Text style={styles.inputLabel}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        textContentType="password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <View style={{ alignItems: "center" }}>
        <Button
          style={styles.loginButton}
          title="Registrarse"
          onPress={() => registerNewUser()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    flexDirection: "column",
    justifyContent: "center",
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
  loginButton: {
    marginTop: 16,
  },
});
