import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setValueHandler} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import {extname} from 'path';
import RNFS from 'react-native-fs';
import * as ScopedStorage from 'react-native-scoped-storage';

const Setting = ({navigation}) => {
  const attendance = useSelector(state => state);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Settings',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 22,
              color: '#181818',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Settings
          </Text>
        );
      },
    });
  }, [navigation]);

  const dispatch = useDispatch();

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

  const deleteData = () => {
    dispatch(setValueHandler([]));
    AsyncStorage.clear();
    ToastAndroid.show('Data Cleared!', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  const exportAttendanceData = async () => {
    let dir = await ScopedStorage.openDocumentTree(true);
    await ScopedStorage.writeFile(
      dir.uri,
      JSON.stringify(attendance),
      'attendance.attendify',
    );
    ToastAndroid.show('Attendance File Exported!', ToastAndroid.BOTTOM);
  };

  const importAttendanceData = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const {uri, name} = result[0];
      if (extname(name) !== '.attendify') {
        Alert.alert(
          'Error',
          'Invalid file format. Only .attendify files are allowed.',
        );
        return;
      }
      const jsonData = await RNFS.readFile(uri, 'utf8');
      const importedAttendanceData = JSON.parse(jsonData);

      dispatch(setValueHandler(importedAttendanceData));
      try {
        await AsyncStorage.setItem(
          'attendance',
          JSON.stringify(importedAttendanceData),
        );
      } catch (e) {
        console.log(e);
      }
      ToastAndroid.show('Attendance File Imported!', ToastAndroid.BOTTOM);
    } catch (error) {
      console.log('Error importing attendance data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.description}>
          Manage your attendance data here. You can export, import, or clear
          your attendance records.
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.importBtn}
          onPress={importAttendanceData}
          activeOpacity={0.8}>
          <Icon name="upload" size={24} color="black" />
          <Text style={styles.importTxt}>Import Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.importBtn}
          onPress={exportAttendanceData}
          activeOpacity={0.8}>
          <Icon name="download" size={24} color="black" />
          <Text style={styles.importTxt}>Export Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={confirmAlert}
          activeOpacity={0.8}>
          <Icon name="delete-outline" size={24} color="white" />
          <Text style={styles.deleteText}>Delete All Data</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.footerLink}
        activeOpacity={0.8}
        onPress={() => Linking.openURL('https://krishjotaniya.netlify.app/')}>
        <Text style={styles.footerText}>Developed by Krish Jotaniya</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
    width: '100%',
  },
  description: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  importBtn: {
    marginVertical: 15,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  importTxt: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    textAlign: 'center',
  },
  deleteBtn: {
    marginVertical: 15,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    textAlign: 'center',
  },
  footerLink: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  footerText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    paddingBottom: 5,
  },
});
