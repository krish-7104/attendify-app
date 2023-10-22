import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Alert,
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
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {SETTINGS_BANNER} from '../../adsdata';
const Setting = ({navigation}) => {
  const adUnitId = __DEV__ ? TestIds.BANNER : SETTINGS_BANNER;
  const attendance = useSelector(state => state);
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
    if (interstitial) {
      interstitial.show();
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
      if (interstitial) {
        interstitial.show();
      }
    } catch (error) {
      console.log('Error importing attendance data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        You can export attendance and store it on your drive or any other
        storage and then you can import it.
      </Text>
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
      <View style={{position: 'absolute', bottom: 10}}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
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
  description: {
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    width: '80%',
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
