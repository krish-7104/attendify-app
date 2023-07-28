import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setValueHandler} from '../../redux/actions';
import ChangeDate from '../Components/ChangeDate';
import EditDiv from './EditDiv';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {EDIT_AD_ID} from '../../adsData';

const adUnitId = __DEV__ ? TestIds.BANNER : EDIT_AD_ID;

const EditAttend = ({navigation}) => {
  const [date, setDate] = useState('');
  const attendance = useSelector(state => state);
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [deleteData, setDeleteDate] = useState({
    id: '',
    date: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Edit Attendance',
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
            Edit Attendance
          </Text>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    const date = new Date();
    setDate(date.toString().slice(0, 15));
    getAttendanceData();
  }, []);

  const dateChangeHandler = type => {
    if (type === 'left') {
      const dateObj = new Date(date);
      dateObj.setDate(dateObj.getDate() - 1);
      setDate(dateObj);
    }
    if (type === 'right') {
      let today = new Date();
      if (date.toString().slice(0, 15) !== today.toString().slice(0, 15)) {
        const dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + 1);
        setDate(dateObj);
      }
    }
  };

  const getAttendanceData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('attendance');
      if (jsonValue !== null) {
        dispatch(setValueHandler(JSON.parse(jsonValue)));
      } else {
        dispatch(setValueHandler([]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeAttendanceHandler = async () => {
    if (attendance) {
      try {
        await AsyncStorage.setItem('attendance', JSON.stringify(attendance));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const editAttendance = selectedType => {
    if (selectedType === 'close') {
      setShowPopup(false);
      return;
    }
    let subjId;
    attendance.map((ele, ind) => {
      if (ele.id === deleteData.id) {
        subjId = ind;
      }
    });
    let subject = attendance[subjId];
    dispatch(
      setValueHandler([
        ...attendance.filter(item => item.id !== deleteData.id),
        {
          id: deleteData.id,
          name: subject.name,
          present:
            selectedType === 'present'
              ? subject.present.filter(
                  item => item !== deleteData.date.toString().slice(0, 15),
                )
              : subject.present,
          absent:
            selectedType === 'absent'
              ? subject.absent.filter(
                  item => item !== deleteData.date.toString().slice(0, 15),
                )
              : subject.absent,
          cancel:
            selectedType === 'cancel'
              ? subject.cancel.filter(
                  item => item !== deleteData.date.toString().slice(0, 15),
                )
              : subject.cancel,
        },
      ]),
    );
    setShowPopup(false);
    storeAttendanceHandler();
  };

  const removeAttendanceHandler = (id, date) => {
    setShowPopup(true);
    setDeleteDate({id, date});
  };
  return (
    <View style={styles.container}>
      <ChangeDate
        date={date.toString().slice(0, 15)}
        dateChangeHandler={dateChangeHandler}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{flexGrow: 1, alignItems: 'center'}}>
        {attendance &&
          attendance.map(item => {
            return (
              <EditDiv
                date={date.toString().slice(0, 15)}
                key={item.id}
                id={item.id}
                subject={item.name}
                present={item.present}
                absent={item.absent}
                cancel={item.cancel ? item.cancel : []}
                removeAttendanceHandler={removeAttendanceHandler}
              />
            );
          })}
        <Modal visible={showPopup} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.popup}>
              <Text style={styles.optionHead}>Select Attendance To Delete</Text>
              <TouchableOpacity
                style={styles.option}
                onPress={() => editAttendance('present')}>
                <Text style={styles.optionText}>Delete Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => editAttendance('absent')}>
                <Text style={styles.optionText}>Delete Absent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => editAttendance('cancel')}>
                <Text style={styles.optionText}>Delete Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelOption}
                onPress={() => editAttendance('close')}>
                <Text style={styles.cancelOptionText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default EditAttend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  optionHead: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'Poppins-Regular',
  },
  cancelOption: {
    paddingVertical: 8,
    marginTop: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  cancelOptionText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
});
