import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput,SafeAreaView, StyleSheet ,Alert, ScrollView, RefreshControl, TouchableOpacity, AsyncStorage  } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';
import {baseCpnUrl} from '../utils/utils.js';

export class SmartCardsScreen extends Component {

	constructor(props) {
    super(props);
    this.state = { refreshing: false };
    this.state = { emptyCards: true };
  }

	componentDidMount() {
		this.callListCardsApi()
	}
	callListCardsApi() {

		let data = {
			method: 'GET',
		}	

    AsyncStorage.getItem("email").then((value) => {      

      let uri = baseUrl+"/smartcards?email=" + value;
  		fetch(uri, data)
  		.then(response => {
      		const statusCode = response.status;
      		const data = response.json();
      		return Promise.all([statusCode, data]);
    		})
  		.then(([statusCode, data]) => {
  				console.log(statusCode)
  				console.log(data)
  				items = data;
          this.setState({items: data});

        if (data.length==0) {
           this.setState({emptyCards: true});
         }else{ this.setState({emptyCards: false})}				
         
  			})
  		.catch((error) => console.error(error))
  	})
  }

	onRefresh = () => {
    this.setState ({refreshing:false});
		this.callListCardsApi()
  }

  btnClicked(index, cardNo, cardName, expMonth,expYear,cvv){
    if (!selectedItems.includes(index)) {
        selectedItems.push(index)
    }else{
        selectedItems.pop(index)
    }
    let data = items
    this.setState({items: data});
    
        console.log(index);

    this.redeemCard(cardNo, cardName, expMonth,expYear,cvv);

  }

   redeemCard(cardNo, cardName, expMonth,expYear,cvv) {

    let data = {
      method: 'PUT',
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
        'pointsToRedeem' : 250
      }
    }    
   
    let uri = baseCpnUrl+"/cpn/cards/redemptions";
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
        if (statusCode == 200) {
          return data.status;
        }else{
          return "Unable to redeem points.";
        }
      })
    .then((msg) => {
      Alert.alert(
         'Your Order',
         msg,
         [
           { text: "OK", onPress: () => {
             {
             selectedItems = [];  
              this.props.navigation.navigate('My Smart Cards',{"shopping":false})}
           }},
         ]
       );
   })
    .catch((error) => console.error(error))
  }

  render() {

    const isShopping = this.props.route.params.shopping;

    return (
      <SafeAreaView>
        <View style={styles.mainView}>  
          <ScrollView refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />}>

          <View>
              {this.state.emptyCards == true? <Text style={styles.information}>You don't have any Smart Cards. Create one today!</Text>: null }
          </View>

          {items.map((item) => {
            return(
                  <View style = { (selectedItems.includes(item.id) == true) ? styles.clickedCell : styles.cell}>
  	              <Text style ={styles.cardNo}>{item.cardNo.match(/.{1,4}/g).join(' ')}</Text>
  	              <Text style ={styles.cardname}>{item.cardName}</Text>

  	              <View style={styles.row}>
  	                	<View style={styles.inputWrap}>
  	                  	<Text style={styles.exp}>{item.expMonth}{'/'}{item.expYear}</Text>
  	                	</View>

  	                	<View style={styles.inputWrap}>
  	                  	<Text style={styles.cvv}>{'***'}</Text>
  	                	</View>
  	              </View>
                    <View style={styles.row}>
                        <View style={styles.inputWrap}>
                          <Text style ={styles.availablePoints}>{"Available Points: "}{item.availablePoints}</Text>
                        </View>

                        <View style={styles.selectBtn}>
                          { isShopping == true ? 
                          <Button
                            color="black"
                            onPress={ () => this.btnClicked(item.id, item.cardNo,item.cardName,item.expMonth,item.expYear,item.cvv)}
                            title="Select"
                          /> : null }
                        </View>
                    </View>


              </View>
            );
          })}
      </ScrollView>


      { isShopping == false ? 
        <TouchableOpacity style={styles.button}
            onPress={() => this.props.navigation.navigate('My Loyalty Cards',{"create":false})}>
            <Text style={styles.appButtonText}>My Loyalty Cards</Text>
        </TouchableOpacity> : null
      }

      { isShopping == false? 
        <TouchableOpacity style={styles.button}
              onPress={() => this.props.navigation.navigate('My Loyalty Cards',{"create":true})}>
              <Text style={styles.appButtonText}>Create Smart Card</Text>
        </TouchableOpacity>: null
      }

      {  isShopping == false ? 
       <TouchableOpacity style={styles.button}
            onPress={() => this.props.navigation.navigate('Merchant Portal')}>
            <Text style={styles.appButtonText}>Shop Here</Text>
        </TouchableOpacity> : null
      }
      </View>
    </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    height: "100%"
  },
  welcomeText:{
      fontSize: 18,
      color: "#388E8E",
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
      width: 350,
      justifyContent: 'center',
      alignSelf: 'center', 
    },
  appButtonText: {
      fontSize: 18,
      color: "#000000",
      fontWeight: "bold",
      alignSelf: "center",
    },
  information:{
      textAlign: 'center',
      alignItems: 'center', 
      flex:1,
      marginTop: 50
  },
  cell: {
    backgroundColor: '#F3E4D4',
	 	height: 215,
	 	marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
  	borderWidth: 0.5,
  	borderColor: '#777'
  },
  clickedCell: {
    backgroundColor: '#C99C6A',
    height: 215,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff'
  },
  cardNo: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 31,
    color: 'black'
  },
  cardname: {
  	textAlign: 'left',
    marginTop: 10,
    marginLeft: 30,
    fontSize: 24,
    color: 'black'
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  inputWrap: {
    flex: 1
  },
  exp: {
  	textAlign: 'left',
    marginTop: 25,
    marginLeft: 30,
    fontSize: 16,
    color: 'black'
  },
  cvv: {
  	textAlign: 'right',
    marginTop: 25,
    marginRight: 30,
    fontSize: 16,
    color: 'black'
  },
  availablePoints: {
  	textAlign: 'left',
    marginBottom: 40,
    marginLeft: 30,
    fontSize: 16,
    color: 'black'
  },
styleLoginBtn: {
    overflow: "hidden",
    marginBottom: 25,
  },
})

var items = [
		
];
var selectedItems = [];