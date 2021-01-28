import React, { useEffect, useState } from "react";
import {
  NativeRouter,
  Route,
  Link,
  Redirect,
  withRouter,
  BackButton,
} from "react-router-native";
import { IndexPage } from "./pages/index";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { AddStorePage } from "./pages/addStore";
import { UserProvider } from "./context/user";
import { StoreView } from "./pages/StoreView";
import { AddProductPage } from "./pages/addProduct";
import { ProductView } from "./pages/ProductView";
import { Provider as PaperProvider } from "react-native-paper";
import * as SQLite from "expo-sqlite";
import Scanner from "./components/barcodeScanner";

const db = SQLite.openDatabase("db.db");
db.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () =>
  console.log("Foreign keys turned on")
);

export default function App() {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id integer primary key not null, name text, username text, email text, password text);"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS stores (id integer PRIMARY KEY NOT NULL, name text, address text, userID REFERENCES users(id));"
      );
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS products (id integer PRIMARY KEY NOT NULL, name text, description text, dateAdded text, price float, qrcode text, photo text, storeID REFERENCES stores(id));"
      );
    },
    (e) => console.log(e)
  );

  return (
    <NativeRouter>
      <BackButton>
        <PaperProvider>
          <UserProvider>
            <Route exact path="/" component={IndexPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/addStore" component={AddStorePage} />
            <Route path="/StoreView/:storeID" component={StoreView} />
            <Route path="/addProduct/:storeID" component={AddProductPage} />
            <Route path="/ProductView/:id" component={ProductView} />
          </UserProvider>
        </PaperProvider>
      </BackButton>
    </NativeRouter>
  );
}
