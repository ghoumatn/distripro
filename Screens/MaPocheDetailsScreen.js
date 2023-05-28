import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Box, Pressable, Button, SafeAreaView, Modal,TextInput, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { months, getDayName, weekdays, mapocheFilePath } from '../globalvars.js';

export default function MaPocheDetailsScreen({route, navigation}) {
    const { selectedMonth, selectedYear } = route.params;
    const [weeksOfMonth, setWeeksOfMonth] = React.useState([]);
    const [maPoche, setMaPoche] = useState([]);
    const [keySelectedYear, setKeySelectedYear] = useState('');
    const [keySelectedMonth, setKeySelectedMonth] = useState('');

    const readMaPoche = async () => {
      try {
        const fileExists = await FileSystem.getInfoAsync(mapocheFilePath);
        if (!fileExists.exists) {
          await FileSystem.writeAsStringAsync(mapocheFilePath, '{}');
          console.log('file not exists')
        }
        const fileContents = await FileSystem.readAsStringAsync(mapocheFilePath);
        const parsedMaPoche = JSON.parse(fileContents);
        

        const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
        const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

        let currentWeek = [];
        let firstWeekDay = firstDayOfMonth.getDay();
        let amount = 0;
        
        const newWeeksOfMonth = [];
        if (firstWeekDay !== 1) {
          // The first day of the month is not Monday, add days from previous month
          const prevMonthLastDay = new Date(selectedYear, selectedMonth, 0).getDate();
          const daysToAdd = firstWeekDay === 0 ? 6 : firstWeekDay - 1;
        
          for (let i = daysToAdd; i >= 1; i--) {
            const prevMonthDate = new Date(selectedYear, selectedMonth - 1, prevMonthLastDay - i + 1);
            currentWeek.push({date:prevMonthDate, amount});
          }
        }
        
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          const currentDate = new Date(selectedYear, selectedMonth, i);
          const currentDay = currentDate.getDay();
        
          if (currentDay === 1 && currentWeek.length > 0) {
            newWeeksOfMonth.push({date:currentWeek, amount});
            currentWeek = [];
          }
        
          currentWeek.push({date:currentDate, amount});
        
          if (currentDay === 0 || i === lastDayOfMonth.getDate()) {
            if (currentDay !== 0) {
              // The last day of the month is not a Sunday, add days from next month
              const daysToAdd = 7 - currentWeek.length;
              const nextMonthFirstDay = new Date(selectedYear, selectedMonth + 1, 1);
        
              for (let j = 1; j <= daysToAdd; j++) {
                const nextMonthDate = new Date(selectedYear, selectedMonth + 1, j);
                currentWeek.push({date: nextMonthDate, amount});
              }
            }
        
            newWeeksOfMonth.push(currentWeek);
            currentWeek = [];
          }
        }

        // find amount if exist in file 
        
        if(parsedMaPoche){
          for (let indexWeek = 0; indexWeek < newWeeksOfMonth.length; indexWeek++) {
            const elementWeek = newWeeksOfMonth[indexWeek];
            for (let indexDay = 0; indexDay < elementWeek.length; indexDay++) {
              if(parsedMaPoche["key"+selectedYear] && parsedMaPoche["key"+selectedYear]["key"+selectedMonth] && parsedMaPoche["key"+selectedYear]["key"+selectedMonth][indexWeek] && parsedMaPoche["key"+selectedYear]["key"+selectedMonth][indexWeek][indexDay].amount ){                
                newWeeksOfMonth[indexWeek][indexDay].amount = parsedMaPoche["key"+selectedYear]["key"+selectedMonth][indexWeek][indexDay].amount;
              }
            }
          }
        }
        setMaPoche(parsedMaPoche);
        setWeeksOfMonth(newWeeksOfMonth);
        // console.log('parsedMaPoche read', fileContents)
      } catch (error) {
        console.error(error);
      }
    };

    const addMaPoche = async () => {
      try {
        const fileContents = await FileSystem.readAsStringAsync(mapocheFilePath);
        var parsedMaPocheToSave = JSON.parse(fileContents);
        
        var parsedMaPocheToSave = {};
        if (!parsedMaPocheToSave[keySelectedYear]) {
          parsedMaPocheToSave[keySelectedYear] = {};
        }
        
        parsedMaPocheToSave[keySelectedYear][keySelectedMonth] = weeksOfMonth;
        
        await FileSystem.writeAsStringAsync(mapocheFilePath, JSON.stringify(parsedMaPocheToSave));
        
        navigation.navigate('MaPoche');
      } catch (error) {
        console.error(error);
      }
    };

    
    const emptyTheFile = async () => {
      try {
        const fileExists = await FileSystem.getInfoAsync(mapocheFilePath);
        if (!fileExists.exists) {
          await FileSystem.deleteAsync(mapocheFilePath);
        }
        // navigation.navigate('Home');
      } catch (error) {
        console.error(error);
      }
    };
    
    useEffect(() => {
      setKeySelectedYear("key"+selectedYear);
      setKeySelectedMonth("key"+selectedMonth);
      readMaPoche();
      
    }, []);

    function getTotalWeekBydIndex (indexWeek) {
      let Total = 0;
      for (let index = 0; index < weeksOfMonth.length; index++) {
        Total += parseInt(weeksOfMonth[indexWeek][index].amount);        
      }
      
      return Total;
    }

    const changeAmount = (amount,indexWeek,indexDay) => {
      const newWeeksOfMonth = [...weeksOfMonth]; // create a new state object
      newWeeksOfMonth[indexWeek][indexDay].amount = amount; // modify the new state object
      setWeeksOfMonth(newWeeksOfMonth); // set the new state object

    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View>
                <Text style={{textAlign: 'center', padding: 20,fontWeight: 700, fontSize: 20}}>Ma poche {months[selectedMonth]} {selectedYear} </Text>
            </View>
            <View  style={{ flex: 1 }}>
                <ScrollView>
                    <View>
                          {weeksOfMonth.map((week, indexWeek) => (
                            <View key={indexWeek}>
                              {week.map((day, indexDay) => (
                                  <Pressable onPress={() => {}} key={indexDay}  style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row', borderBottomColor: '#000', borderBottomWidth: 1, backgroundColor: "#fff"}}> 
                                      <Text style={{padding: 20}}>{("0" + day.date.getDate()).slice(-2)}/{("0" + (day.date.getMonth() + 1)).slice(-2)} {weekdays[day.date.getDay()]} : </Text>
                                      <TextInput
                                        style={{ flex: 1, fontSize: 20, alignSelf:'stretch'}}
                                        keyboardType='numeric'
                                        value={day.amount.toString()}
                                        onChangeText={(value) => {changeAmount(value, indexWeek, indexDay)}}
                                      />
                                  </Pressable>
                              ))}
                              <Text style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row', borderBottomColor: '#000', borderBottomWidth: 1, padding: 20, backgroundColor: "#eee", fontSize: 20}}>Total: {getTotalWeekBydIndex(indexWeek)}</Text>
                            </View>
                          ))} 
                    </View>
                </ScrollView>
            </View>
            {/* <Button
                onPress={() => {readMaPoche()}}
                title="readFile"
                color="#841584"
                accessibilityLabel="Voir"
            />
            <Button
                onPress={() => {emptyTheFile()}}
                title="Empty the file"
                color="#841584"
                accessibilityLabel="Voir"
            /> */}
            <Button
                onPress={() => {addMaPoche()}}
                title={"Savegarde "+months[selectedMonth]+" "+selectedYear}
                color="#841584"
                accessibilityLabel="Savegarde"
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