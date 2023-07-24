import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setValueHandler} from '../../redux/actions';
import ChangeDate from '../Components/ChangeDate';
import AttendDiv from './AttendDiv';
import Dashboard from './Dashboard';
import Icon from 'react-native-vector-icons/AntDesign';
const Main = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState('');
  const dispatch = useDispatch();
  const attendance = useSelector(state => state);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Attendify',
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
            Attendify
          </Text>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    const date = new Date();
    setDate(date);
    getAttendanceData();
  }, []);

  useEffect(() => {
    storeAttendanceHandler();
  }, [attendance]);

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

  const addAttendanceHandler = (type, id) => {
    let newDate = new Date();
    let subjId;
    attendance.map((ele, index) => {
      if (ele.id === id) {
        subjId = index;
      }
    });
    let subject = attendance[subjId];
    if (type === 'present') {
      dispatch(
        setValueHandler([
          ...attendance.filter(item => item.id !== id),
          {
            id: id,
            name: subject.name,
            present: [...subject.present, date.toString().slice(0, 15)],
            absent: subject.absent,
            cancel: subject.cancel ? subject.cancel : [],
          },
        ]),
      );
    } else if (type === 'absent') {
      dispatch(
        setValueHandler([
          ...attendance.filter(item => item.id !== id),
          {
            id: id,
            name: subject.name,
            present: subject.present,
            absent: [...subject.absent, date.toString().slice(0, 15)],
            cancel: subject.cancel ? subject.cancel : [],
          },
        ]),
      );
    } else {
      if (subject.cancel === undefined) {
        dispatch(
          setValueHandler([
            ...attendance.filter(item => item.id !== id),
            {
              id: id,
              name: subject.name,
              present: subject.present,
              absent: subject.absent,
              cancel: [date.toString().slice(0, 15)],
            },
          ]),
        );
      } else {
        dispatch(
          setValueHandler([
            ...attendance.filter(item => item.id !== id),
            {
              id: id,
              name: subject.name,
              present: subject.present,
              absent: subject.absent,
              cancel: [...subject.cancel, date.toString().slice(0, 15)],
            },
          ]),
        );
      }
    }
    setOpen(!open);
    ToastAndroid.show('Attendance Added!', ToastAndroid.SHORT);
  };

  const openAddSubjectPage = () => {
    navigation.navigate('Subject');
    setOpen(!open);
  };

  return (
    <View style={styles.container}>
      {!open && (
        <>
          <Dashboard />
          <ChangeDate
            date={date.toString().slice(0, 15)}
            dateChangeHandler={dateChangeHandler}
          />
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{alignItems: 'center'}}>
            {attendance &&
              attendance.map(subject => {
                return (
                  <AttendDiv
                    date={date.toString().slice(0, 15)}
                    key={subject.id}
                    id={subject.id}
                    subject={subject.name}
                    present={subject.present}
                    absent={subject.absent}
                    cancel={subject.cancel ? subject.cancel : []}
                  />
                );
              })}
          </ScrollView>
        </>
      )}
      {open && (
        <>
          {attendance && attendance.length === 0 ? (
            <View style={styles.noSubDiv}>
              <Text style={styles.noSubText}>No Subject Found!</Text>
              <TouchableOpacity
                style={styles.addSubNaviBtn}
                onPress={openAddSubjectPage}>
                <Text style={styles.addSubNaviText}>Add Subjects</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{alignItems: 'center'}}>
              {attendance &&
                attendance
                  .sort((a, b) => a.id > b.id)
                  .map(item => {
                    return (
                      <View key={item.id} style={styles.indiSubArea}>
                        <Text style={styles.indiSubName}>{item.name}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            addAttendanceHandler('present', item.id)
                          }
                          activeOpacity={0.4}
                          style={{
                            backgroundColor: '#4ade80',
                            padding: 3,
                            borderRadius: 4,
                            marginRight: 10,
                          }}>
                          <Icon name="check" size={16} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            addAttendanceHandler('absent', item.id)
                          }
                          activeOpacity={0.4}
                          style={{
                            backgroundColor: '#f87171',
                            padding: 3,
                            borderRadius: 4,
                            marginRight: 10,
                          }}>
                          <Icon name="close" size={16} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            addAttendanceHandler('cancel', item.id)
                          }
                          activeOpacity={0.4}
                          style={{
                            backgroundColor: '#60a5fa',
                            padding: 3,
                            borderRadius: 4,
                            marginRight: 10,
                          }}>
                          <Icon name="minus" size={16} color="black" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
            </ScrollView>
          )}
        </>
      )}
      <TouchableOpacity style={styles.addArea} onPress={() => setOpen(!open)}>
        {!open ? (
          <Text style={styles.addAttend}>Add Attendance</Text>
        ) : (
          <Text style={styles.addAttend}>Close</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    width: '100%',
    marginBottom: 10,
  },
  addArea: {
    padding: 10,
    backgroundColor: '#181818',
    width: '70%',
    borderRadius: 6,
    marginBottom: 12,
    marginTop: 10,
  },
  addAttend: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  indiSubArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 14,
    width: '90%',
  },
  indiSubName: {
    fontSize: 16,
    width: '70%',
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  noSubDiv: {
    flex: 1,
  },
  noSubText: {
    marginTop: 40,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  addSubNaviBtn: {
    backgroundColor: '#181818',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 30,
  },
  addSubNaviText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
});
