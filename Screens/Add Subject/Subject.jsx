import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
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
  const [type, setType] = useState('Lecture');
  const attendance = useSelector(state => state);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
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
      const newSubjects = [];
      if (type === 'Lecture' || type === 'Both') {
        newSubjects.push({
          id: id,
          name: input,
          present: [],
          absent: [],
          cancel: [],
        });
      }
      if (type === 'Lab' || type === 'Both') {
        newSubjects.push({
          id: id + 1,
          name: `${input} Lab`,
          present: [],
          absent: [],
          cancel: [],
        });
      }
      dispatch(setValueHandler([...attendance, ...newSubjects]));
      setInput('');
      setType('Lecture');
      setModalVisible(false);
      Keyboard.dismiss();
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
    setModalVisible(true);
  };

  const saveEdithandler = () => {
    let subInd = attendance.findIndex(subject => subject.id === editId);
    const updatedAttendance = [...attendance];
    updatedAttendance[subInd].name = input;

    dispatch(setValueHandler(updatedAttendance));
    setEditId();
    setInput('');
    setModalVisible(false);
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
        <FlatList
          style={styles.subListView}
          data={attendance}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.indiSubArea}
              onPress={() => editBtnHandler(item.id, item.name)}>
              <Text style={styles.indiSubName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.deleteBtn}
                activeOpacity={0.8}
                onPress={() => removeSubjectHandler(item.id)}>
                <Icon1 name="delete-outline" size={24} color="#181818" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
      {!modalVisible && (
        <TouchableOpacity
          style={styles.addSubjectBtn}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={20} color="#f5f5f5" />
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000050',
          }}>
          <TouchableOpacity
            style={styles.addSubjectBtn}
            activeOpacity={0.8}
            onPress={() => setModalVisible(false)}>
            <Icon1 name="clear" size={20} color="#f5f5f5" />
          </TouchableOpacity>
          <View style={styles.modalView}>
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                marginBottom: 2,
                color: '#000',
              }}>
              Add Subject
            </Text>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              value={input}
              placeholder="Enter Subject Here"
              placeholderTextColor="#5A5A5A"
              onChangeText={text => setInput(text)}
            />
            <Text
              style={{
                fontFamily: 'Poppins-Medium',
                marginBottom: 3,
                color: '#000',
              }}>
              Select Type
            </Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'Lecture' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('Lecture')}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'Lecture' && styles.selectedTypeButtonText,
                  ]}>
                  Lecture
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'Lab' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('Lab')}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'Lab' && styles.selectedTypeButtonText,
                  ]}>
                  Lab
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'Both' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('Both')}>
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'Both' && styles.selectedTypeButtonText,
                  ]}>
                  Both
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'space-evenly',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              {editId ? (
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={saveEdithandler}>
                  <Text style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                    Save
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={addSubjectHandler}>
                  <Text style={{color: '#fff', fontFamily: 'Poppins-Medium'}}>
                    Add Subject
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Subject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subListView: {
    width: '90%',
    flex: 1,
  },
  indiSubArea: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 12,
    width: '100%',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    marginTop: 14,
  },
  addSubjectBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 100,
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 20,
  },
  input: {
    width: '100%',
    padding: 8,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    width: '90%',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    elevation: 2,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#181818',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedTypeButton: {
    backgroundColor: '#181818',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#181818',
    fontFamily: 'Poppins-Medium',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#181818',
    padding: 6,
    borderRadius: 100,
    marginTop: 10,
    width: '45%',
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    padding: 6,
    borderRadius: 100,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#181818',
    fontFamily: 'Poppins-Medium',
  },
  noSubDiv: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSubText: {
    marginTop: 40,
    fontSize: 16,
    color: '#181818',
    fontFamily: 'Poppins-Medium',
  },
});
