import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { useUser } from "../hooks/user";
import { Redirect, useHistory } from "react-router-native";
import { FAB } from "react-native-paper";
import { AppBar } from "../components/appbar";
import { List } from "react-native-paper";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export function IndexPage() {
  const { currentUser, setCurrentUser } = useUser();
  const [listItems, setListItems] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!currentUser.id) {
      history.push("/login");
    }
  }, [currentUser]);

  const signOut = () => {
    setCurrentUser({
      id: "",
      username: "",
      name: "",
      email: "",
    });
    history.push("/login");
  };

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM stores WHERE userID = ?",
          [currentUser.id],
          (_, { rows }) => {
            if (rows.length > 0) {
              setListItems(rows._array);
            }
          }
        );
      },
      (e) => console.log(e),
      null
    );
  }, []);

  return (
    <View style={styles.container}>
      <AppBar signOut={signOut} signOutMenu title="Sucursales" />

      <ScrollView style={{ height: "100%", padding: 8 }}>
        {listItems.length > 0 ? (
          listItems.map((store) => (
            <List.Item
              key={store.id}
              title={store.name}
              description={store.address}
              onPress={() => history.push(`/StoreView/${store.id}`)}
            />
          ))
        ) : (
          <Text>No hay Sucursales</Text>
        )}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => history.push("/addStore")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
    paddingTop: Constants.statusBarHeight,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 64,
  },
});
