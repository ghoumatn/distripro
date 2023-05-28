import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ordersFilePath } from '../globalvars.js';


export default function HomeScreen({route, navigation}) {
  const [ordersList, setOrdersList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const readOrderList = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(ordersFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(ordersFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(ordersFilePath);
      const parsedOrdersList = JSON.parse(fileContents);
      setOrdersList(parsedOrdersList);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    readOrderList();
  }, [navigation, route]);

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.container}>
        <Text style={{fontSize: 22, margin: 10}}>Liste des factures</Text>
        <View>
          {isLoaded ? (
            (
              ordersList.length ? 
              ordersList.map((orderRow, indexOfOrder) => ( 
              <Pressable style={{borderBottomWidth: 2, borderBottomColor: "#000", padding: 10}} onPress={() => { navigation.navigate('DetailOrder', {orderRow, indexOfOrder}) }} key={indexOfOrder}>
                <Text>Client: {orderRow.clientName}</Text>
                <Text>Date facture : {orderRow.orderDate}</Text>
              </Pressable>
              ))
              : <Text style={{margin: 10}}>Aucune facture</Text>
            )
          ) : (
            <Text>Loading factures list...</Text>
          )}
        </View>
      </View>
      <View>
        <Button
          onPress={() => {navigation.navigate('Clients')}}
          title="Passer une facture"
          color="#841584"
          accessibilityLabel="Passer une nouvelle facture"
        />
        <View style={{height: 10}}></View>
        <Button
          onPress={() => {navigation.navigate('MaPoche')}}
          title="Ma Poche"
          color="#841584"
          accessibilityLabel="Ma Poche"
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
