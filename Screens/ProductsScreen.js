import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput, Label, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { productFilePath,ordersFilePath } from '../globalvars.js';
import Moment from 'moment';


export default function ProductsScreen({ route, navigation }) {
  const { clientName } = route.params;

  const [productList, setProductList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuantityVisible, setModalQuantityVisible] = useState(false);
  const [modalProductDelVisible, setModalProductDelVisible] = useState(false);
  const [newProductName, setNewProductName] = React.useState('');
  const [newProductPrice, setNewProductPrice] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [productQuantity, setProductQuantity] = React.useState(0);
  const [productPrice, setProductPrice] = React.useState(0);
  const [cartRows, setCartRows] = React.useState([]);
  const [indexOfProduct, setIndexOfProduct] = React.useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  function getTotalFacture(cartRows){
    let totalFacture = 0;
    cartRows.map((cartRow, index) => ( 
      totalFacture += (cartRow.productPrice * cartRow.productQuantity)
    ));
    return totalFacture +' dt';
  }

  const updateProductPriceIdDiff = async (productPriceUpdate) => {
    try {
      const fileExists = await FileSystem.getInfoAsync(productFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(productFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(productFilePath);
      const parsedProductList = JSON.parse(fileContents);
      parsedProductList[indexOfProduct].price = productPriceUpdate;
      FileSystem.writeAsStringAsync(productFilePath, JSON.stringify(parsedProductList));
      setProductList(parsedProductList);
    } catch (error) {
      console.error(error);
    }
  }

  const deleteProduct = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(productFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(productFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(productFilePath);
      const parsedProductList = JSON.parse(fileContents);
      parsedProductList.splice(indexOfProduct, 1);
      FileSystem.writeAsStringAsync(productFilePath, JSON.stringify(parsedProductList));
      setProductList(parsedProductList);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
       style={{
         backgroundColor: 'purple',
         alignContent: 'center',
         justifyContent: 'center',
         paddingHorizontal: 16,
         marginBottom: 15
       }}>
       <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold', paddingTop: 15, paddingBottom: 15 }}>Facture client : {clientName}</Text>
     </View>
     <View>
      {cartRows.length ? 
        <View style={{paddingBottom: 20, maxHeight: 250}}>
          <ScrollView>
            {cartRows.map((cartRow, index) => ( 
            <View key={index}>
              <Text style={{marginBottom: 10, fontSize:16 }}>{cartRow.productQuantity}x {cartRow.productName} ({cartRow.productPrice}{' dt'}) = <Text style={{fontWeight: 'bold'}}>{cartRow.productQuantity * cartRow.productPrice}dt</Text></Text>
            </View>
            ))}
          </ScrollView>
          <Button
            onPress={() => {
              addNewOrder()
            }}
            title={`Valider la facture (${getTotalFacture(cartRows)})`}
            color="#19A7CE"
            accessibilityLabel="Valide la facture"
          />
        </View>
      : (
        <Text style={{textAlign: 'center', marginBottom: 10}}>Facture vide, merci de selectionner des produits ci dessous.</Text>
      )}
     </View>

      <View  style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', marginTop: 15, fontSize: 22}}>Choisir les produits</Text>
        <TextInput
          placeholder="Recherche produits"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
        />
          <View  style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.productBoxContainer}>
                {isLoaded ? (
                  filteredProducts.map((product, index) => ( 
                  <Pressable style={styles.productBox} 
                    onPress={() => {setProductName(product.name),setProductPrice(product.price ? product.price : 0), setProductQuantity(''),setIndexOfProduct(index), setModalQuantityVisible(!modalQuantityVisible)}} 
                    onLongPress={() => {setIndexOfProduct(index), setModalProductDelVisible(true)}} 
                    key={index}>
                    <Text style={styles.productBoxText}>{product.name}{'\n'}({product.price}{' dt'})</Text>
                  </Pressable>
                  ))
                ) : (
                  <Text>Loading product list...</Text>
                )}
              </View>
            </ScrollView>
        </View>
      </View>
      <View>
        <Button
          onPress={() => {setNewProductPrice(0),setModalVisible(!modalVisible), setNewProductName('')}}
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
          setModalVisible(!modalVisible);
        }}
        onShow={() => { this.textInput.focus(); }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nouveau produit</Text>
              <Text>Nom produit :</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewProductName}
                value={newProductName.toString()}
                ref={(input) => { this.textInput = input; }}
              />
              <Text>Prix unitaire :</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.input}
                onChangeText={setNewProductPrice}
                value={newProductPrice.toString()}
              />
              <View style={{ flexWrap: 'wrap', marginTop: 10, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Button
                  onPress={() => {setModalVisible(!modalVisible)}}
                  title="Fermer"
                  color="#FF1111"
                  accessibilityLabel="Fermer"
                />
                <Button
                  onPress={() => {addNewProduct({ name: newProductName, price : newProductPrice }), setModalVisible(!modalVisible)}}
                  title="Ajouter"
                  color="#19A7CE"
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
              <Text>Prix unitaire :</Text>
              <TextInput
                keyboardType='numeric'
                style={styles.input}
                onChangeText={setProductPrice}
                value={productPrice.toString()}
              />
              <Text>Total : {productQuantity.toString()} x {productPrice} = {productQuantity * productPrice}</Text>
              <View style={{ flexWrap: 'wrap', marginTop: 10, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Button
                  onPress={() => {setModalQuantityVisible(!modalQuantityVisible)}}
                  title="Fermer"
                  color="#FF1111"
                  accessibilityLabel="Fermer"
                />
                <Button
                  onPress={() => {
                    addNewProductToCart({ productName: productName, productPrice: productPrice, productQuantity: productQuantity }),
                    setModalQuantityVisible(!modalQuantityVisible),
                    updateProductPriceIdDiff(productPrice)
                  }}
                  title="Ajouter"
                  color="#19A7CE"
                  accessibilityLabel="Ajouter"
                />
              </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProductDelVisible}
        onRequestClose={() => {
          setModalProductDelVisible(!modalProductDelVisible);
        }}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Confirmation suppression produit</Text>
              <Text>Nom produit : {productList && productList[indexOfProduct] ? productList[indexOfProduct].name : '--'}</Text>
              <View style={{ flexWrap: 'wrap', marginTop: 10, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Button
                  onPress={() => {setModalProductDelVisible(!modalProductDelVisible), deleteProduct()}}
                  title="Supprimer"
                  color="#FF1111"
                  accessibilityLabel="Supprimer"
                />
                <Button
                  onPress={() => {
                    setModalProductDelVisible(false)
                  }}
                  title="Fermer"
                  color="#19A7CE"
                  accessibilityLabel="Fermer"
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
    marginTop: 0,
  },
  modalView: {
    width: '80%',
    margin: 10,
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
