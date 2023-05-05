import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { clientFilePath } from './globalvars.js';


export default function ClientsScreen({navigation}) {
  const [clientList, setClientList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClientName, setNewClientName] = React.useState('');

  const readClientList = async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(clientFilePath);
      if (!fileExists.exists) {
        await FileSystem.writeAsStringAsync(clientFilePath, '[]');
      }
      const fileContents = await FileSystem.readAsStringAsync(clientFilePath);
      const parsedClientList = JSON.parse(fileContents);
      setClientList(parsedClientList);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  const addNewClient = async (client) => {
    try {
      const fileContents = await FileSystem.readAsStringAsync(clientFilePath);
      const parsedClientList = JSON.parse(fileContents);
      parsedClientList.push(client);
      await FileSystem.writeAsStringAsync(clientFilePath, JSON.stringify(parsedClientList));
      setClientList(parsedClientList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    readClientList();
  }, []);

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

      <View style={styles.container}>
        <Text>Choisir le client</Text>
        <View style={styles.clientBoxContainer}>
          {isLoaded ? (
            clientList.map((client, index) => ( 
            <Pressable style={styles.clientBox} onPress={() => { navigation.navigate('Products', {clientName: client.name})}} key={index}>
              <Text style={styles.clientBoxText}>{client.name}</Text>
            </Pressable>
            ))
          ) : (
            <Text>Loading client list...</Text>
          )}
        </View>
      </View>
      <View>
        <Button
          onPress={() => {setModalVisible(!modalVisible), setNewClientName('')}}
          title="Ajouter client"
          color="#841584"
          accessibilityLabel="Ajouter un nouveau client"
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
        onShow={() => { this.textInput.focus(); }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Nouveau client</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewClientName}
                value={newClientName}
                ref={(input) => { this.textInput = input; }}
              />
              <Button
                  style={{flex:1, margiLeft: 10 }}
                  onPress={() => {setModalVisible(!modalVisible)}}
                  title="Fermer"
                  color="#ADE1E5"
                  accessibilityLabel="Fermer"
                />
              <View style={{ flexWrap: 'wrap', flexDirection: 'row', width: '100%'}}>
                <Button
                  style={{flex:1, marginRight: 10 }}
                  onPress={() => {addNewClient({ name: newClientName, region: 'Sousse' }), setModalVisible(!modalVisible)}}
                  title="Ajouter"
                  color="#841584"
                  accessibilityLabel="Ajouter un nouveau client"
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
