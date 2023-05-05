import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { productFilePath,ordersFilePath } from './globalvars.js';
import Moment from 'moment';


export default function ProductsScreen({ route, navigation }) {
  const { clientName } = route.params;

  const [productList, setProductList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuantityVisible, setModalQuantityVisible] = useState(false);
  const [newProductName, setNewProductName] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [productQuantity, setProductQuantity] = React.useState(0);
  const [cartRows, setCartRows] = React.useState([]);

  const readProductList = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(productFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(productFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(productFilePath);
      const parsedProductList = JSON.parse(fileContents);
      setProductList(parsedProductList);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewProduct = async (product) => {
    try {
      const fileContents = await FileSystem.readAsStringAsync(productFilePath);
      const parsedProductList = JSON.parse(fileContents);
      parsedProductList.push(product);
      await FileSystem.writeAsStringAsync(productFilePath, JSON.stringify(parsedProductList));
      setProductList(parsedProductList);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewOrder = async () => {
    try {
      const fileContents = await FileSystem.readAsStringAsync(ordersFilePath);
      const parsedOrderList = JSON.parse(fileContents);
      parsedOrderList.push(
        {
          clientName: clientName,
          orderDate: Moment().format('YYYY-MM-DD hh:mm'),
          cartRows: cartRows  
        }
      );
      await FileSystem.writeAsStringAsync(ordersFilePath, JSON.stringify(parsedOrderList));
      navigation.navigate('Home', { refreshOrdersList: 1 });
      setCartRows([])
    } catch (error) {
      console.error(error);
    }
  };

  const addNewProductToCart = async (cartRow) => {
    setCartRows(oldArray => [...oldArray, cartRow])
  }

  useEffect(() => {
    readProductList();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
       style={{
         height: 60,
         backgroundColor: 'purple',
         alignContent: 'center',
         justifyContent: 'center',
         paddingHorizontal: 16,
         marginBottom: 15
       }}>
       <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', paddingTop: 30 }}>Commande client : {clientName}</Text>
     </View>
     <View>
      {cartRows.length ? 
        <View style={{paddingBottom: 20}}>
          {cartRows.map((cartRow, index) => ( 
          <View key={index}>
            <Text style={{marginBottom: 10, fontSize:16 }}>{cartRow.productQuantity}x {cartRow.productName}</Text>
          </View>
          ))}
          <Button
            onPress={() => {
              addNewOrder()
            }}
            title="Valider la commande"
            color="#19A7CE"
            accessibilityLabel="Valide la commande"
          />
        </View>
      : (
        <Text>Commande vide</Text>
      )}
     </View>

      <View style={styles.container}>
        <Text>Choisir les produits</Text>
        <View style={styles.productBoxContainer}>
          {isLoaded ? (
            productList.map((product, index) => ( 
            <Pressable style={styles.productBox} onPress={() => {setProductName(product.name), setProductQuantity(''), setModalQuantityVisible(!modalQuantityVisible)}} key={index}>
              <Text style={styles.productBoxText}>{product.name}</Text>
            </Pressable>
            ))
          ) : (
            <Text>Loading product list...</Text>
          )}
        </View>
      </View>
      <View>
        <Button
          onPress={() => {setModalVisible(!modalVisible), setNewProductName('')}}
          title="Ajouter product"
          color="#841584"
          accessibilityLabel="Ajouter un nouveau product"
        />
     </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
        onShow={() => { this.textInput.focus(); }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nouveau produit</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewProductName}
                value={newProductName}
                ref={(input) => { this.textInput = input; }}
              />
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%'}}>
                <Button
                  onPress={() => {setModalVisible(!modalVisible)}}
                  title="Fermer"
                  color="#ADE1E5"
                  accessibilityLabel="Fermer"
                />
                <Button
                  onPress={() => {addNewProduct({ name: newProductName }), setModalVisible(!modalVisible)}}
                  title="Ajouter"
                  color="#841584"
                  accessibilityLabel="Ajouter un nouveau produit"
                />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalQuantityVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalQuantityVisible);
        }}
        onShow={() => { this.textInput.focus(); }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Quantité : {productName}</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.input}
                onChangeText={setProductQuantity}
                value={productQuantity.toString()}
                ref={(input) => { this.textInput = input; }}
              />
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%'}}>
                <Button
                  onPress={() => {setModalQuantityVisible(!modalQuantityVisible)}}
                  title="Fermer"
                  color="#ADE1E5"
                  accessibilityLabel="Fermer"
                />
                <Button
                  onPress={() => {addNewProductToCart({ productName: productName, productQuantity: productQuantity }), setModalQuantityVisible(!modalQuantityVisible)}}
                  title="Ajouter"
                  color="#841584"
                  accessibilityLabel="Quantité"
                />
              </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  productBoxContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  productBox : {
    flexBasis: '50%',    
  },
  productBoxText: {
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    padding: 15,
    borderRadius: 8,
    margin: 15,
    backgroundColor: '#000000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 700
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    minWidth: 150
  },
});
