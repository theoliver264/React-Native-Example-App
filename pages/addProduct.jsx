import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { useUser } from "../hooks/user";
import { useHistory } from "react-router-native";
import { AppBar } from "../components/appbar";
import Scanner from "../components/barcodeScanner";
import { Portal, Button, TextInput, IconButton } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

import * as SQLite from "expo-sqlite";
import PhotoCamera from "../components/photoCamera";
const db = SQLite.openDatabase("db.db");

export function AddProductPage(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [qrcode, setQRcode] = useState("");
  const [photo, setPhoto] = useState("");
  const { currentUser } = useUser();
  const [openScanner, setOpenScanner] = useState(false);
  const [openPhotoCamera, setOpenPhotoCamera] = useState(false);
  const history = useHistory();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { storeID } = props.match.params;

  useEffect(() => {
    if (!currentUser.id) {
      history.push("/login");
    }
  }, [currentUser]);

  const registerNewProduct = async () => {
    if (name === null || name === "") {
      ToastAndroid.show("Ingrese un nombre", 2000);
      return false;
    }
    if (description === null || description === "") {
      ToastAndroid.show("Ingrese una dirección", 2000);
      return false;
    }
    if (date === null || date === "") {
      ToastAndroid.show("Ingrese una fecha", 2000);
      return false;
    }
    if (price === null || price === "") {
      ToastAndroid.show("Ingrese un precio", 2000);
      return false;
    }
    if (qrcode === null || qrcode === "") {
      ToastAndroid.show("Ingrese un codigo", 2000);
      return false;
    }
    if (photo === null || photo === "") {
      ToastAndroid.show("Ingrese una foto", 2000);
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM products WHERE storeID = ? AND (name = ? OR qrcode = ?) ",
          [storeID, name, qrcode],
          (_, { rows }) => {
            if (rows.length < 1) {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "INSERT INTO products (name, description, dateAdded, price, qrcode, photo, storeID) values (?, ?, ?, ?, ?, ?,?)",
                    [
                      name,
                      description,
                      date.toString(),
                      price,
                      qrcode,
                      photo,
                      storeID,
                    ]
                  );
                },
                (e) => console.log(e),
                () => {
                  ToastAndroid.show("Producto Registrado", 3000);
                  history.goBack();
                }
              );
            } else {
              ToastAndroid.show("Producto ya existe", 3000);
            }
          }
        );
      },
      (e) => console.log(e),
      null
    );
  };

  function handleBarcode(data) {
    setOpenScanner(false);
    setQRcode(data);
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <AppBar backButton title="Añadir Producto" />
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <View
          style={{
            height: "100%",
            padding: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 4 }}>
              <TextInput
                style={styles.input}
                label="Codigo de barras/QR"
                onChangeText={(text) => setQRcode(text)}
                value={qrcode}
              />
            </View>
            <View style={{ flex: 1 }}>
              <IconButton
                color="white"
                size={32}
                style={{ backgroundColor: "purple" }}
                onPress={() => setOpenScanner(true)}
                icon="barcode-scan"
              ></IconButton>
            </View>
          </View>
          <TextInput
            style={styles.input}
            label="Nombre"
            onChangeText={(text) => setName(text)}
            value={name}
          />

          <TextInput
            style={styles.input}
            label="Descripción"
            onChangeText={(text) => setDescription(text)}
            value={description}
          />

          <TextInput
            keyboardType="numeric"
            style={styles.input}
            label="Precio"
            onChangeText={(text) => setPrice(text)}
            value={price}
          />

          <TextInput
            style={styles.input}
            label="Fecha"
            onChangeText={(text) => {
              setDate(new Date(text));
            }}
            showSoftInputOnFocus={false}
            value={date.toString()}
            onFocus={() => {
              Keyboard.dismiss();
              setShowDatePicker(true);
            }}
          />

          <Text style={{ marginLeft: 16 }}>Foto:</Text>
          <Image
            style={styles.img}
            source={{ uri: photo || "https://via.placeholder.com/150.png" }}
          />
          <View style={{ alignItems: "center" }}>
            <Button onPress={() => setOpenPhotoCamera(true)}>Tomar Foto</Button>
            <Text></Text>
            <Button onPress={() => registerNewProduct()}>Registrar</Button>
          </View>

          {openScanner && (
            <Portal>
              <Scanner
                onClose={() => setOpenScanner(false)}
                onBarCodeScanned={handleBarcode}
              />
            </Portal>
          )}

          {openPhotoCamera && (
            <Portal>
              <PhotoCamera
                onClose={() => setOpenPhotoCamera(false)}
                setPhoto={setPhoto}
              />
            </Portal>
          )}

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: window.height,
    backgroundColor: "#eee",
    paddingTop: Constants.statusBarHeight,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  img: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
});
