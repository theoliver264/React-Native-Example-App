import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import Constants from "expo-constants";
import { useUser } from "../hooks/user";
import { Redirect, useHistory } from "react-router-native";
import { FAB, IconButton } from "react-native-paper";
import { AppBar } from "../components/appbar";
import { List } from "react-native-paper";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");

export function StoreView(props) {
  const { currentUser, setCurrentUser } = useUser();
  const [listItems, setListItems] = useState([]);
  const history = useHistory();

  const { storeID } = props.match.params;

  useEffect(() => {
    if (!currentUser.id) {
      history.push("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM products WHERE storeID = ?",
          [storeID],
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
      <AppBar backButton title="Productos" />

      <ScrollView style={{ height: "100%", padding: 8 }}>
        {listItems.length > 0 ? (
          listItems.map((item) => (
            <List.Item
              style={{ borderBottomWidth: 1, borderColor: "#999" }}
              key={item.id}
              title={item.name}
              description={item.description}
              left={(props) => (
                <Image
                  style={{ width: 48, height: 48, alignSelf: "center" }}
                  source={{ uri: item.photo }}
                />
              )}
              right={(props) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>${item.price} MXN</Text>
                  <IconButton size={32} icon="chevron-right" />
                </View>
              )}
              onPress={() => history.push(`/ProductView/${item.id}`)}
            />
          ))
        ) : (
          <Text>No hay Productos</Text>
        )}
      </ScrollView>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => history.push(`/addProduct/${storeID}`)}
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
