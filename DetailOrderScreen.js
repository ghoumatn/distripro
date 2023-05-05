import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function DetailOrderScreen({route, navigation}) {
  const { orderRow } = route.params;

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
        <Text style={{fontSize: 22}}>Détail de la commande</Text>
        <Text style={{fontSize: 18}}>Client : {orderRow.clientName}</Text>
        <Text style={{fontSize: 18}}>Date : {orderRow.orderDate}</Text>
      </View>
      <View style={{padding: 15}}>
        {orderRow.cartRows.length ? (
          
          orderRow.cartRows.map((cartRow, index) => (
            <View style={{borderBottomWidth: 1, borderBottomColor: "#B0DAFF", padding: 10}} key={index}>
              <Text style={{fontSize: 20, fontWeight: 700}}>{cartRow.productQuantity}x {cartRow.productName}</Text>
            </View>
          ))
          
        ) : 
          <Text>Pas de produits</Text>
        }
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
