import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setValueHandler} from '../../redux/actions';

const Subject = ({navigation}) => {
  const [input, setInput] = useState('');
  const attendance = useSelector(state => state);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState();
  const textInputRef = useRef(null);

  useEffect(() => {
    getAttendanceData();
  }, []);

  useEffect(() => {
    storeData();
  }, [attendance]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Subjects',
      headerTitle: () => (
        <Text
          style={{
            fontSize: 20,
            marginTop: 6,
            marginLeft: -8,
            color: '#181818',
            fontFamily: 'Poppins-SemiBold',
          }}>
          Subjects
        </Text>
      ),
    });
  }, [navigation]);

  const getAttendanceData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('attendance');
      if (jsonValue !== null) {
        dispatch(
          setValueHandler(JSON.parse(jsonValue).sort((a, b) => a.id > b.id)),
        );
      } else {
        dispatch(setValueHandler([]));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const storeData = async () => {
    if (attendance) {
      try {
        await AsyncStorage.setItem('attendance', JSON.stringify(attendance));
      } catch (e) {
        console.log(e);
      }
    }
  };

  const addSubjectHandler = () => {
    let id = Math.round(Math.random() * 10000);
    if (input.length !== 0) {
      dispatch(
        setValueHandler([
          ...attendance,
          {
            id: id,
            name: input,
            present: [],
            absent: [],
            cancel: [],
          },
        ]),
      );
      setInput('');
      Keyboard.dismiss();
      setOpen(!open);
      ToastAndroid.show('Subject Added!', ToastAndroid.SHORT);
    }
  };

  const removeSubjectHandler = id => {
    Alert.alert(
      'Are You Sure?',
      'Deleting subject will delete that subject attendance also.',
      [
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            dispatch(
              setValueHandler(attendance.filter(item => item.id !== id)),
            ),
        },
      ],
      {cancelable: false},
    );
  };

  const editBtnHandler = (id, name) => {
    setEditId(id);
    setInput(name);
    if (!textInputRef.current.isFocused()) {
      textInputRef.current.focus();
    }
  };

  const saveEdithandler = () => {
    let subInd = attendance.findIndex(subject => subject.id === editId);
    const updatedAttendance = [...attendance];
    updatedAttendance[subInd].name = input;

    dispatch(setValueHandler(updatedAttendance));
    setEditId();
    setInput('');
    Keyboard.dismiss();
    ToastAndroid.show('Subject Name Changed!', ToastAndroid.SHORT);
  };
  return (
    <View style={styles.container}>
      {attendance && attendance.length === 0 ? (
        <View style={styles.noSubDiv}>
          <Text style={styles.noSubText}>Add Subjects!</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.subListView}
          contentContainerStyle={{alignItems: 'center'}}>
          {attendance &&
            attendance.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.indiSubArea}
                  onPress={() => editBtnHandler(item.id, item.name)}>
                  <Text style={styles.indiSubName}>{item.name}</Text>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    activeOpacity={0.4}
                    onPress={() => removeSubjectHandler(item.id)}>
                    <Icon1 name="delete-outline" size={24} color="#181818" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
      <View style={styles.addSubjectArea}>
        <TextInput
          ref={textInputRef}
          style={styles.input}
          value={input}
          placeholder="Enter Subject Here"
          placeholderTextColor="#5A5A5A"
          onChangeText={text => setInput(text)}
          onSubmitEditing={addSubjectHandler}
        />
        {editId ? (
          <TouchableOpacity
            style={styles.addSubjectBtn}
            activeOpacity={0.4}
            onPress={saveEdithandler}>
            <Icon1 name="done" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.addSubjectBtn}
            activeOpacity={0.4}
            onPress={addSubjectHandler}>
            <Icon name="plus" size={24} color="#f5f5f5" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Subject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subListView: {
    width: '100%',
    flex: 1,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: '#181818',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 6,
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
    marginTop: 12,
    width: '90%',
  },
  indiSubName: {
    fontSize: 14,
    width: '86%',
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  deleteBtn: {
    paddingVertical: 4,
  },
  addSubjectArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    marginTop: 14,
  },
  addSubjectBtn: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  input: {
    width: '82%',
    padding: 8,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  noSubDiv: {
    flex: 1,
  },
  noSubText: {
    marginTop: 40,
    fontSize: 16,
    color: '#181818',
    fontFamily: 'Poppins-Medium',
  },
});
