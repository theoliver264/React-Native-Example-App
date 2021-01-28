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
  Alert,
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

export function ProductView(props) {
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

  const { id } = props.match.params;

  useEffect(() => {
    if (!currentUser.id) {
      history.push("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM products WHERE id = ?",
          [id],
          (_, { rows: { _array: result } }) => {
            setName(result[0].name);
            setQRcode(result[0].qrcode);
            setDescription(result[0].description);
            setPrice(result[0].price.toString());
            setPhoto(result[0].photo);
            setDate(new Date(result[0].dateAdded));
          }
        );
      },
      (e) => console.log(e),
      null
    );
  }, []);

  const editProduct = async () => {
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
          "UPDATE products SET dateAdded = ?, description = ?, name = ?, photo = ?, price = ?, qrcode = ? WHERE id = ? ",
          [date.toString(), description, name, photo, price, qrcode, id],
          () => {
            ToastAndroid.show("Producto Actualizado", 2000);
            history.goBack();
          },
          (e) => console.log(e)
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

  function deleteProduct() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM products WHERE id = ? ",
          [id],
          () => {
            ToastAndroid.show("Producto Borrado", 2000);
            history.goBack();
          },
          (e) => console.log(e)
        );
      },
      (e) => console.log(e),
      null
    );
  }

  console.log(date);
  return (
    <View style={styles.container}>
      <AppBar backButton title="Editar Producto" />
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Button
                color="red"
                onPress={() =>
                  Alert.alert(
                    "Eliminar Producto",
                    "¿Seguro que quieres eliminar?",
                    [
                      {
                        text: "NO",
                        style: "cancel",
                      },
                      {
                        text: "SI",
                        onPress: () => deleteProduct(),
                        style: "destructive",
                      },
                    ]
                  )
                }
              >
                Eliminar
              </Button>
              <Button onPress={() => editProduct()}>Guardar</Button>
            </View>
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
