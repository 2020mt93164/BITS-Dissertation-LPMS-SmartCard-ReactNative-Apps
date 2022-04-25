import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput, SafeAreaView, StyleSheet, AsyncStorage,Alert,TouchableOpacity } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';


function AddNewLoyaltyCard({navigation}) {


  const [cardNo, onCardNoChange]     = React.useState('');
  const [cardName, onCardNameChange] = React.useState('');
  const [expMonth, onExpMonthChange] = React.useState('');
  const [expYear, onExpYearChange]   = React.useState('');
  const [cvv, onCvvChange]           = React.useState('');
  const styles = StyleSheet.create({
    input: {
      height: 60,
      margin: 12,
      borderWidth: 0.2,
      padding: 10,
    },
    button: {
      backgroundColor: "#C99C6A",
      borderRadius: 25,
      marginTop: 10,
      marginBottom:10,
      height: 50,
      width: 250,
      justifyContent: 'center',
      alignSelf: 'center', 
    },
    appButtonText: {
      fontSize: 18,
      color: "#000000",
      fontWeight: "bold",
      alignSelf: "center",
    },
  });

  function callAddNewCardApi() {

    AsyncStorage.getItem("email").then((value) => {   
    let data = {
      method: 'POST',
      body: JSON.stringify({
        "cardNo": cardNo,
        "cardName": cardName,
        "expMonth": expMonth,
        "expYear": expYear,
        "cvv": cvv
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        'email' : value
      }
    }
   


    let uri = baseUrl+"/cards";
    console.log(data)
    fetch(uri, data)
    .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
    .then(([statusCode, data]) => {
      console.log(statusCode)
      console.log(data)
        if (statusCode == 201) {
          return data.status;
        }else{
          return "Card validation failed";
        }
      })
    .then((msg) => {
      Alert.alert(
         'Add New Card',
         msg,
         [
           { text: "OK", onPress: () => {
             {  navigation.navigate('My Loyalty Cards',{"create":false})}
           }},
         ]
       );
   })
    .catch((error) => console.error(error))
    }) 
  }
  


	return (
    <View style={{ flex: 3, alignItems: 'stretch' }}>
      <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={cardName => onCardNameChange(cardName)}
        value={cardName}
        placeholder="Enter the name on card"
      />
      <TextInput
        style={styles.input}
        onChangeText={cardNo => onCardNoChange(cardNo)}
        value={cardNo}
        placeholder="Enter the card number"
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        onChangeText={cvv => onCvvChange(cvv)}
        value={cvv}
        placeholder="Enter cvv"
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        onChangeText={expMonth => onExpMonthChange(expMonth)}
        value={expMonth}
        placeholder="Enter expiry month of the card"
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        onChangeText={expYear => onExpYearChange(expYear)}
        value={expYear}
        placeholder="Enter expiry year of the card"
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.button}
        onPress={callAddNewCardApi}>
        <Text style={styles.appButtonText}>Add New Loyalty Card</Text>
      </TouchableOpacity>


    </SafeAreaView>
    </View>
  );
}

export { AddNewLoyaltyCard	}