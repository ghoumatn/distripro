import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput, ScrollView } from 'react-native';
import { months } from '../globalvars.js';

export default function MaPocheScreen({navigation}) {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(0);
    
    useEffect(() => {
      setSelectedYear((new Date().getFullYear()));
        setSelectedMonth((new Date().getMonth()));
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <TextInput value={selectedYear.toString()} onChangeText={setSelectedYear} style={styles.inputYear} />
            </View>
            <View  style={{ flex: 1 }}>
                <ScrollView>
                    <View style={styles.monthBoxContainer}>
                        {months.map((month, index) => (
                            <Pressable style={styles.monthBox} onPress={() => {setSelectedMonth(index)}} key={index}>
                                <Text style={[styles.monthBoxText, [{backgroundColor: index == selectedMonth ? '#008000' : styles.monthBoxText.backgroundColor }]]}>{month}</Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Button
                onPress={() => {navigation.navigate('MaPocheDetails', {selectedMonth:selectedMonth.toString(), selectedYear : selectedYear.toString()})}}
                title={"Voir "+months[selectedMonth]+" "+selectedYear}
                color="#841584"
                accessibilityLabel="Voir"
            />
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
    monthBoxContainer: {
      flex: 1,
      flexWrap: 'wrap',
      flexDirection: 'row',
    },
    monthBox : {
      flexBasis: '50%',    
    },
    monthBoxText: {
      color: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      padding: 20,
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
    inputYear: {
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        padding: 20,
        borderRadius: 8,
        margin: 15,
        backgroundColor: '#fff',
        textAlign: 'center',
        fontSize: 25,
    },
  });