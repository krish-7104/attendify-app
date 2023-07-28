import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setValueHandler} from '../../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {writeFile} from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import {extname} from 'path';
import RNFS from 'react-native-fs';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {SETTIND_AD_ID} from '../../adsData';
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : SETTIND_AD_ID;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['student', 'college', 'placements', 'career', 'coding'],
});
const Setting = ({navigation}) => {
  const attendance = useSelector(state => state);
  useEffect(() => {
    interstitial.load();
  }, []);

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

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting storage permission:', error);
        return false;
      }
    } else {
      // For other platforms (iOS), storage permission is usually granted by default.
      return true;
    }
  };

  const deleteData = () => {
    dispatch(setValueHandler([]));
    AsyncStorage.clear();
    ToastAndroid.show('Data Cleared!', ToastAndroid.SHORT);
    navigation.navigate('Home');
  };

  const exportAttendanceData = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await requestStoragePermission();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Storage permission is required for exporting data.',
          );
          return;
        }
      }

      const filePath =
        Platform.OS === 'android'
          ? `/storage/emulated/0/Download/attendance.attendify`
          : `${RNFS.DocumentDirectoryPath}/attendance.attendify`;
      const jsonData = JSON.stringify(attendance);

      writeFile(filePath, jsonData, 'utf8')
        .then(success =>
          ToastAndroid.show('Attendance File Exported!', ToastAndroid.BOTTOM),
        )
        .catch(error => console.log('Error exporting attendance data:', error));
      interstitial.show();
    } catch (error) {
      console.log('Error converting attendance data to JSON:', error);
    }
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
      interstitial.show();
    } catch (error) {
      console.log('Error importing attendance data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.importBtn}
        onPress={importAttendanceData}
        activeOpacity={0.5}>
        <Text style={styles.importTxt}>Import Attendance</Text>
        <Icon name="upload" style={{marginRight: 6}} size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.importBtn}
        onPress={exportAttendanceData}
        activeOpacity={0.5}>
        <Text style={styles.importTxt}>Export Attendance</Text>
        <Icon
          name="download"
          style={{marginRight: 6}}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={confirmAlert}
        activeOpacity={0.5}>
        <Text style={styles.deleteText}>Delete All Data</Text>
        <Icon
          name="delete-outline"
          style={{marginRight: 6}}
          size={24}
          color="white"
        />
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
    justifyContent: 'center',
  },
  importBtn: {
    marginVertical: 15,
    width: '70%',
    fontSize: 18,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.4,
  },
  importTxt: {
    color: 'black',
    fontSize: 18,
    marginRight: 6,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    textAlign: 'center',
  },
  deleteBtn: {
    marginVertical: 15,
    backgroundColor: '#ef4444',
    width: '70%',
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
    flex: 1,
    textAlign: 'center',
  },
});
