import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ordersFilePath } from '../globalvars.js';

export default function DetailOrderScreen({route, navigation}) {
  const { orderRow, indexOfOrder } = route.params;
  function getTotalFacture(cartRows){
    let totalFacture = 0;
    cartRows.map((cartRow, index) => ( 
      totalFacture += (cartRow.productPrice * cartRow.productQuantity)
    ));
    return totalFacture +' dt';
  }

  const deleteFacture = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(ordersFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(ordersFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(ordersFilePath);
      const parsedOrdersList = JSON.parse(fileContents);
      if (indexOfOrder > -1) {
        parsedOrdersList.splice(indexOfOrder, 1);
      }
      await FileSystem.writeAsStringAsync(ordersFilePath, JSON.stringify(parsedOrdersList));
      navigation.navigate('Home', { refreshOrdersList: 1 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View
       style={{
         height: 60,
         backgroundColor: 'purple',
         alignContent: 'center',
         justifyContent: 'center',
         paddingHorizontal: 16,
       }}>
       <Text style={{ color: 'white', fontWeight: 'bold', paddingTop: 30 }}>Distribution PRO</Text>
     </View> */}

      <View style={{borderBottomWidth: 2, borderBottomColor: "#000", padding: 10}}>
        <Text style={{fontSize: 22}}>Détail de la facture</Text>
        <Text style={{fontSize: 18}}>Client : {orderRow.clientName}</Text>
        <Text style={{fontSize: 18}}>Date : {orderRow.orderDate}</Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          {orderRow.cartRows.length ? (
            orderRow.cartRows.map((cartRow, index) => (
              <View style={{borderBottomWidth: 1, borderBottomColor: "#B0DAFF", padding: 10}} key={index}>
                  <Text style={{fontSize: 22, fontWeight: 'bold' }}>{cartRow.productQuantity}x {cartRow.productName} </Text>
                  <Text style={{fontSize: 22 }}>{cartRow.productQuantity} x {cartRow.productPrice}{' dt'} = {cartRow.productQuantity * cartRow.productPrice}dt</Text>
              </View>
            ))
            
          ) : 
            <Text>Pas de produits</Text>
          }
        </ScrollView>
        <Text style={{fontSize: 24, fontWeight: 'bold', padding: 10}}>Total {getTotalFacture(orderRow.cartRows)}</Text>
      </View>
      <View>
        <Button
          onPress={() => {deleteFacture()}}
          title="Supprimer la facture"
          color="#FF1111"
          accessibilityLabel="Supprimer la facture"
        />
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
  clientBoxContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  clientBox : {
    flexBasis: '50%',    
  },
  clientBoxText: {
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
    borderRadius: 10,
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
