import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput, SafeAreaView, StyleSheet, AsyncStorage,Alert,TouchableOpacity,Image } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';


function ShoppingScreen({navigation}) {

  const styles = StyleSheet.create({
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
    itemNameLbl: {
      fontSize: 18,
      color: "#000000",
      fontWeight: "bold",
      alignSelf: "center",
      marginTop: 50,
      marginBottom:10
    },
    itemLbl: {
      fontSize: 18,
      color: "#000000",
      fontWeight: "bold",
      alignSelf: "center",
      marginTop: 10,
      marginBottom:10
    },
    image:{
      width: 200,
      height: 200,
      justifyContent:'center',
      alignSelf:'center',
      marginTop: 50,
    }
  });  

	return (
    <View style={{ flex: 1, alignItems: 'stretch' }}>
      <SafeAreaView>
        <Text style={styles.itemNameLbl}>Apple AirPods Max 2022</Text>
        <Image source = {{uri:'/Users/Krupal/Desktop/SmartCoupon/resources/headphone.png'}}
          style = {styles.image}
        />
        <Text style={styles.itemLbl}>Qty: 1</Text>
        <Text style={styles.itemLbl}> Points: 250 </Text>


      <TouchableOpacity style={styles.button}
        onPress={() => navigation.push('My Smart Cards',{"shopping":true})}>
        <Text style={styles.appButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
    </View>
  );
}

export { ShoppingScreen	}