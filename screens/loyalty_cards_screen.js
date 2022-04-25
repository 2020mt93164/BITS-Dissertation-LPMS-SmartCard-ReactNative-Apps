import {AppRegistry} from 'react-native';
import * as React from 'react';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, View, Text, TextInput,SafeAreaView, StyleSheet ,Alert, ScrollView, RefreshControl, TouchableOpacity, ImageBackground,AsyncStorage  } from 'react-native';
import {Component} from 'react';
import {baseUrl} from '../utils/utils.js';

export class LoyaltyCardsScreen extends Component {

	constructor(props) {
    super(props);
    this.state = { refreshing: false };
    this.state = { emptyCards: false };
    this.callListCardsApi() 
  }

  createSmartCard(){

    var totalAvailablePoints = 0;
    for (let index = 0; index < selectedItems.length; index++) {
      let s = selectedItems[index]

        for (let id = 0; id < items.length; id++) {
            let item = items[id]
            if (item["id"] == s) {
                totalAvailablePoints+=item["availablePoints"]
            }
        }
    };

    AsyncStorage.getItem("email").then((value) => {   
       
      let data = {
        method: 'POST',
        body: JSON.stringify({
          'cardIds': selectedItems
        }),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json',
          'email' : value,
          'pointsToRedeem':totalAvailablePoints
        }
      }

      let baseURI = baseUrl+"/smartcards"
      fetch(baseURI, data)
          .then(response => {
            selectedItems = [];
              const statusCode = response.status;
              const data = response.json();
              return Promise.all([statusCode, data]);
            })
          .then(([statusCode, data]) => {
              if (statusCode == 201) {
                return "Card Created Successfully!";
              }else{
                return "Could not redeem cards. Pls try again.";
              }
            })
          .then((msg) => {
            Alert.alert(
               'SmartCard',
               msg,
               [
                 { text: "OK", onPress: () => {
                   this.props.navigation.navigate('My Smart Cards',{"shopping":false})
                 }},
               ]
             );
          })
          .catch((error) => console.error(error))

    })
  }

	callListCardsApi() {

		let data = {
			method: 'GET',
		}	

    AsyncStorage.getItem("email").then((value) => {     
      let uri = baseUrl+"/cards?email="+value
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

  btnClicked(index){
    if (!selectedItems.includes(index)) {
        selectedItems.push(index)
    }else{
        selectedItems.pop(index)
    }
    let data = items
    this.setState({items: data});
  }

  render() {

    const isCreate = this.props.route.params.create;  

    return (
    	<SafeAreaView>
          <View style={styles.mainView}>
            <ScrollView refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />}>

            <View>
                {this.state.emptyCards == true? <Text style={styles.information}>You don't have any loyalty cards added. Add a few to create a Smart Card!</Text>: null }
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
                          { isCreate == true ? 
                          <Button
                            color="black"
                            onPress={ () => this.btnClicked(item.id)}
                            title="Select"
                          /> : null }
                        </View>
                    </View>
                </View>
              );
            })}
          </ScrollView>

          { isCreate == false ? 
            <TouchableOpacity style={styles.button}
              onPress={() => this.props.navigation.navigate('Add New Loyalty Card')}>
              <Text style={styles.appButtonText}>Add New Loyalty Card</Text>
            </TouchableOpacity>
          : null }


          { isCreate == true && items.length>0 ? 
            <TouchableOpacity style={styles.button}
              onPress={() => this.createSmartCard()}>
              <Text style={styles.appButtonText}>Create SmartCard</Text>
            </TouchableOpacity>
          : null }

        </View>
      </SafeAreaView>
    )
  }
}

const image = { uri: "/Users/Krupal/Desktop/SmartCoupon/resources/card.png" };

const styles = StyleSheet.create({
  information:{
      textAlign: 'center',
      alignItems: 'center', 
      flex:1,
      marginTop: 100
  },
	mainView: {
    backgroundColor: 'white',
    height: "100%",
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
  cell: {
    backgroundColor: '#F3E4D4',
	 	height: 215,
	 	marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 15,
  	borderWidth: 1,
  	borderColor: '#fff'
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

var items = [];
var selectedItems = [];