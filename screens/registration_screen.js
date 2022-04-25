import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput, SafeAreaView, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';

const Stack = createNativeStackNavigator();

function RegistrationScreen({navigation}) {
  const [email, onEmailChange]       = React.useState('');
  const [username, onUsernameChange] = React.useState('');
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
	    marginTop: 5,
	    marginBottom:5,
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
			'password': password,
			'username': username
		  }),
		headers: {
		  	'Accept':       'application/json',
		    'Content-Type': 'application/json',
		}
	}

  function callApi() {
  		var isRegistered = false
  		console.log(data)

  		let baseURI = baseUrl+"/accounts/users"
		fetch(baseURI, data)
		.then(response => {
			const statusCode = response.status;
			const data = response.json();
			return Promise.all([statusCode, data]);
			})
		.then(([statusCode, data]) => {
				if (statusCode == 201) {
						isRegistered = true
					return data.status;
				}else{
						isRegistered = false
					return data.errorMessage;
				}
			})
			.then((msg) => {

			Alert.alert(
			   'Registration',
			   msg,
			   [
			     { text: "OK", onPress: () => {
			     	 if (isRegistered) {	navigation.navigate('Login')}
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
	      onChangeText={username => onUsernameChange(username)}
          defaultValue={username}
          autoCapitalize='none'
	      placeholder="Enter your username"
	    />
	   	<TextInput
	      style={styles.input}
	      onChangeText={email => onEmailChange(email)}
          defaultValue={email}
          autoCapitalize='none'
	      placeholder="Enter your email"
	    />
	    <TextInput
	      secureTextEntry={true}  
	      style={styles.input}
	      onChangeText={password => onPasswordChange(password)}
          defaultValue={password}
          autoCapitalize='none'
	      placeholder="Enter password you like"
	    />
	    <TouchableOpacity style={styles.button}
          onPress={callApi}>
          <Text style={styles.appButtonText}>Register</Text>
        </TouchableOpacity>
	  </SafeAreaView>

	  </View>
	);
}


export {RegistrationScreen	}