import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput,SafeAreaView, StyleSheet ,Alert, AsyncStorage, TouchableOpacity } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';

function LoginScreen({navigation}) {

  const [email, onEmailChange]       = React.useState('');
  const [password, onPasswordChange] = React.useState('');
  const styles = StyleSheet.create({
  	welcomeText:{
  		fontSize: 18,
	    color: "#C99C6A",
	    fontWeight: "bold",
	    alignSelf: "center",
	    marginBottom: 50,
	    marginTop:50
  	},
  	input: {
    	height: 60,
    	margin: 12,
    	borderWidth: 0.2,
    	padding: 10,
  	},
  	button: {
	    backgroundColor: "#C99C6A",
	    borderRadius: 25,
	    marginTop: 20,
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

  let data = {
		  method: 'POST',
		  body: JSON.stringify({
		    'email': email,
			'password': password
		  }),
		  headers: {
		  	'Accept':       'application/json',
		    'Content-Type': 'application/json',
		  }
		}

  function callApi() {
  		var isLoggedIn = false
		console.log(baseUrl)

		fetch(baseUrl+"/accounts/authentications", data)
		.then(response => {
    		const statusCode = response.status;
    		const data = response.json();
    		return Promise.all([statusCode, data]);
  		})
		.then(([statusCode, data]) => {
				if (statusCode == 202) {
					isLoggedIn = true
					AsyncStorage.setItem("email",email);
					return data.status;
				}else{
					isLoggedIn = false
					return data.errorMessage;
				}
			})
 		.then((msg) => {
			Alert.alert(
			   'Login',
			   msg,
			   [
			     { text: "OK", onPress: () => {
			     	 if (isLoggedIn) {	navigation.push('My Smart Cards',{"shopping":false})}
			     }},
			   ]
			 );
 		})
		.catch((error) => console.error(error))
	}	


	return (
	  <View style={{ flex: 1, alignItems: 'stretch' }}>
	    <SafeAreaView>
	    <Text style={styles.welcomeText}>{'Welcome to SmartCard!'}</Text>
	    <TextInput
	      style={styles.input}
	      onChangeText={email => onEmailChange(email)}
          defaultValue={email}
          autoCapitalize='none'
	      placeholder="Enter your email"
	    />
	    <TextInput
	      style={styles.input}
	      onChangeText={password => onPasswordChange(password)}
          defaultValue={password}
          secureTextEntry={true}  
          autoCapitalize='none'
	      placeholder="Enter valid password"
	    />

	    <TouchableOpacity style={styles.button}
          onPress={callApi}>
          <Text style={styles.appButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
	      onPress={() => navigation.push('Registration')}>
          <Text style={styles.appButtonText}>Register</Text>
        </TouchableOpacity>
	  </SafeAreaView>
	  </View>
	);

}

export {LoginScreen}