import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import React from 'react';
import {useDispatch} from 'react-redux';
import {setValueHandler} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Setting = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Settings',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 20,
              marginTop: 6,
              marginLeft: -8,
              color: '#181818',
            }}>
            Settings
          </Text>
        );
      },
    });
  }, [navigation]);

  const dispatch = useDispatch();
  /**
   * The function displays an alert asking the user to confirm if they want to delete attendance data
   * and calls the deleteData function if the user selects "Yes".
   */
  const confirmAlert = () => {
    Alert.alert(
      'Are You Sure?',
      'All Attendance Data Will Be Cleared And Cannot Be Restored!',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteData(),
        },
      ],
      {cancelable: false},
    );
  };

  /**
   * The function deletes data, clears AsyncStorage, shows a toast message, and navigates to the Home
   * screen.
   */
  const deleteData = () => {
    dispatch(setValueHandler([]));
    AsyncStorage.clear();
    ToastAndroid.show('Data Cleared!', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.warnDiv}>
        <Text style={styles.title}>Danger Zone</Text>
        <Text style={styles.subtitle}>
          All attendance data and subjects will be deleted and cannot be
          restored
        </Text>
      </View>
      <View style={styles.lowerDiv}>
        <TouchableOpacity style={styles.deleteBtn} onPress={confirmAlert}>
          <Text style={styles.deleteText}>Delete All Data</Text>
          <Icon name="delete-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warnDiv: {
    position: 'absolute',
    marginTop: 30,
    top: 0,
    backgroundColor: '#fff',
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#181818',
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  lowerDiv: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    marginVertical: 15,
    backgroundColor: '#18181b',
    width: '95%',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
  },
  deleteText: {
    color: '#f5f5f5',
    fontSize: 18,
    marginRight: 6,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
  },
});
