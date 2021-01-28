import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import Constants from "expo-constants";
import { Redirect, useHistory } from "react-router-native";
import { useUser } from "../hooks/user";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, showLoginSuccess] = useState(false);
  const [loginFailure, showLoginFailure] = useState(false);

  const history = useHistory();
  const { currentUser, setCurrentUser } = useUser();

  useEffect(() => {
    if (currentUser.id) {
      history.push("/");
    }
  }, [currentUser]);

  const handleLogIn = () => {
    // is text empty?
    if (email === null || email === "") {
      return false;
    }
    if (password === null || password === "") {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM users WHERE email = ? AND password = ? ",
          [email, password],
          (_, { rows }) => {
            if (rows.length > 0) {
              console.log(rows);
              setCurrentUser({ ...rows._array[0], id: rows._array[0].id });
            }
          }
        );
      },
      () => showLoginFailure(true),
      () => showLoginSuccess(true)
    );
  };

  return (
    <View style={styles.container}>
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
          title="Iniciar Sesión"
          onPress={() => handleLogIn()}
        />
        <Text></Text>
        <Button
          style={styles.loginButton}
          title="Registrarse"
          onPress={() => history.push("/register")}
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
