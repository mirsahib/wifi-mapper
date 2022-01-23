/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
  PermissionsAndroid,
  Text,
  View
} from 'react-native';
import { useEffect, useState } from 'react';
import wifi from 'react-native-android-wifi';



const App = () => {

  const [state, setState] = useState({
    isWifiNetworkEnabled: null,
    ssid: null,
    pass: null,
    ssidExist: null,
    currentSSID: null,
    currentBSSID: null,
    wifiList: null,
    modalVisible: false,
    status: null,
    level: null,
    ip: null,
  })

  useEffect(() => {
    console.log(wifi)
    askForUserPermissions()
  }, [])

  const askForUserPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks',
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const serviceCheckOnPress = () => {
    wifi.isEnabled(
      (isEnabled) => {
        //setState({...state,isWifiNetworkEnabled: isEnabled});
        console.log(isEnabled);
      });
  }

  const serviceSetEnableOnPress = (enabled) => {
    wifi.setEnabled(enabled)
  }

  const connectOnPress = () => {
    wifi.findAndConnect(state.ssid, state.pass, (found) => {
      setState({ ...state, ssidExist: found });
    });
  }

  const disconnectOnPress = () => {
    wifi.disconnect();
  }

  const getSSIDOnPress = () => {
    wifi.getSSID((ssid) => {
      setState({ ...state, currentSSID: ssid });
    });
  }

  const getBSSIDOnPress = () => {
    wifi.getBSSID((bssid) => {
      setState({ ...state, currentBSSID: bssid });
    });
  }

  const getWifiNetworksOnPress = () => {
    wifi.loadWifiList((wifiStringList) => {
      console.log(wifiStringList);
      var wifiArray = JSON.parse(wifiStringList);
      setState({
        ...state,
        wifiList: wifiArray,
        modalVisible: true
      });
    },
      (error) => {
        console.log(error);
      }
    );
  }

  const connectionStatusOnPress = () => {
    wifi.connectionStatus((isConnected) => {
      setState({ ...state, status: isConnected });
    });
  }

  const levelOnPress = () => {
    wifi.getCurrentSignalStrength((level) => {
      setState({ ...state, level: level });
    });
  }

  const ipOnPress = () => {
    wifi.getIP((ip) => {
      setState({ ...state, ip: ip });
    });
  }

  const renderModal=()=>{
    var wifiListComponents = [];
    for (w in state.wifiList){
      wifiListComponents.push(
        <View key={w} style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>{state.wifiList[w].SSID}</Text>
          <Text>BSSID: {state.wifiList[w].BSSID}</Text>
          <Text>Capabilities: {state.wifiList[w].capabilities}</Text>
          <Text>Frequency: {state.wifiList[w].frequency}</Text>
          <Text>Level: {state.wifiList[w].level}</Text>
          <Text>Timestamp: {state.wifiList[w].timestamp}</Text>
        </View>
      );
    }
    return wifiListComponents;
  }



  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>React Native Android Wifi Example App</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Check wifi service status</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={serviceCheckOnPress}>
              <Text style={styles.buttonText}>Check</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.isWifiNetworkEnabled == null ? "" : state.isWifiNetworkEnabled ? "Wifi service enabled :)" : "Wifi service disabled :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Enable/Disable wifi network</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={() => serviceSetEnableOnPress(true)}>
              <Text style={styles.buttonText}>Enable</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => serviceSetEnableOnPress(false)}>
              <Text style={styles.buttonText}>Disable</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Sign device into a specific network:</Text>
          <Text style={styles.instructions}>SSID</Text>
          <TextInput
            underlineColorAndroid='transparent'
            onChangeText={(event) => state.ssid = event}
            value={state.ssid}
            placeholder={'ssid'} />
          <Text style={styles.instructions}>Password</Text>
          <TextInput
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(event) => state.pass = event}
            value={state.pass}
            placeholder={'password'} />
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={connectOnPress}>
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.ssidExist == null ? "" : state.ssidExist ? "Network in range :)" : "Network out of range :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Disconnect current wifi network</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={disconnectOnPress}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Current SSID</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={getSSIDOnPress}>
              <Text style={styles.buttonText}>Get SSID</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.currentSSID + ""}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Current BSSID</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={getBSSIDOnPress}>
              <Text style={styles.buttonText}>Get BSSID</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.currentBSSID + ""}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get all wifi networks in range</Text>
          <TouchableHighlight style={styles.bigButton} onPress={getWifiNetworksOnPress}>
            <Text style={styles.buttonText}>Available WIFI Networks</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Connection status</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.bigButton} onPress={connectionStatusOnPress}>
              <Text style={styles.buttonText}>Get connection status</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.status == null ? "" : state.status ? "You're connected :)" : "You're not connected :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get current wifi signal strength</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.bigButton} onPress={levelOnPress}>
              <Text style={styles.buttonText}>Get signal strength</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.level == null ? "" : state.level}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get current IP</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={ipOnPress}>
              <Text style={styles.buttonText}>Get IP</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{state.ip == null ? "" : state.ip}</Text>
          </View>
        </View>
      </View>
      <Modal 
        visible={state.modalVisible}
        onRequestClose={() => {}}>
        <TouchableHighlight style={styles.button} onPress={()=>setState({modalVisible:false})}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableHighlight>
        <ScrollView>
        {renderModal()}
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5FCFF',
    marginBottom: 100
  },
  row: {
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
  },
  instructionsContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  instructionsTitle: {
    marginBottom: 10,
    color: '#333333'
  },
  instructions: {
    color: '#333333'
  },
  button: {
    padding: 5,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'blue',
    marginRight: 15,
  },
  bigButton: {
    padding: 5,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'blue',
    marginRight: 15,
  },
  buttonText: {
    color: 'white'
  },
  answer: {
    marginTop: 5,
  }
});

export default App;
