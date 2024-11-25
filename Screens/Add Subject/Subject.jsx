import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Animated,
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
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const textInputRef = useRef(null);
  const snackbarHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getAttendanceData();
  }, []);

  useEffect(() => {
    storeData();
  }, [attendance]);

  const showSnackbar = () => {
    Animated.spring(snackbarHeight, {
      toValue: 340,
      useNativeDriver: false,
      damping: 20,
      stiffness: 90,
    }).start();
  };

  const hideSnackbar = () => {
    Animated.spring(snackbarHeight, {
      toValue: 0,
      useNativeDriver: false,
      damping: 20,
      stiffness: 90,
    }).start(() => {
      setInput('');
      setType('Lecture');
      setIsEditing(false);
      setEditId(null);
    });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#333',
      title: 'Subjects',
      headerTitle: () => <Text style={styles.headerTitle}>My Subjects</Text>,
    });
  }, [navigation]);

  // Core data functions remain the same
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
    if (input.trim().length === 0) {
      ToastAndroid.show('Please enter a subject name', ToastAndroid.SHORT);
      return;
    }
    let id = Math.round(Math.random() * 10000);
    const newSubjects = [];
    if (type === 'Lecture' || type === 'Both') {
      newSubjects.push({
        id: id,
        name: input.trim(),
        present: [],
        absent: [],
        cancel: [],
      });
    }
    if (type === 'Lab' || type === 'Both') {
      newSubjects.push({
        id: id + 1,
        name: `${input.trim()} Lab`,
        present: [],
        absent: [],
        cancel: [],
      });
    }
    dispatch(setValueHandler([...attendance, ...newSubjects]));
    hideSnackbar();
    ToastAndroid.show('Subject added successfully!', ToastAndroid.SHORT);
    setShowAd(true);
  };

  const removeSubjectHandler = id => {
    Alert.alert(
      'Delete Subject',
      'Are you sure you want to delete this subject?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(
              setValueHandler(attendance.filter(item => item.id !== id)),
            );
            ToastAndroid.show('Subject deleted', ToastAndroid.SHORT);
          },
        },
      ],
    );
  };

  const editBtnHandler = (id, name) => {
    setIsEditing(true);
    setEditId(id);
    setInput(name.replace(' Lab', ''));
    setType(name.includes(' Lab') ? 'Lab' : 'Lecture');
    showSnackbar();
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const saveEditHandler = () => {
    if (input.trim().length === 0) {
      ToastAndroid.show('Subject name cannot be empty!', ToastAndroid.SHORT);
      return;
    }

    const updatedAttendance = attendance.map(subject => {
      if (subject.id === editId) {
        return {
          ...subject,
          name: type === 'Lab' ? `${input.trim()} Lab` : input.trim(),
        };
      }
      return subject;
    });

    dispatch(setValueHandler(updatedAttendance));
    hideSnackbar();
    ToastAndroid.show('Subject updated successfully!', ToastAndroid.SHORT);
  };

  const renderSubjectItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.subjectCard}
      onPress={() => editBtnHandler(item.id, item.name)}>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor: item.name.includes('Lab')
                ? '#f0f0f0'
                : '#e8e8e8',
            },
          ]}>
          <Text style={styles.typeBadgeText}>
            {item.name.includes('Lab') ? 'Laboratory' : 'Theory'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeSubjectHandler(item.id)}>
        <Icon1 name="delete-outline" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {attendance?.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="book" size={48} color="#333" />
          <Text style={styles.emptyStateTitle}>No Subjects Yet</Text>
          <Text style={styles.emptyStateText}>
            Tap the + button to add your first subject
          </Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.addSubjectButton}
            activeOpacity={0.8}
            onPress={showSnackbar}>
            <Text style={styles.addSubjectText}>Add a Subject</Text>
          </TouchableOpacity>
          <FlatList
            style={styles.subjectList}
            data={attendance}
            keyExtractor={item => item.id.toString()}
            renderItem={renderSubjectItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
      {snackbarHeight > 0 && <View style={styles.overlay} />}
      <Animated.View style={[styles.snackbar, {height: snackbarHeight}]}>
        <View style={styles.snackbarContent}>
          <View style={styles.snackbarHeader}>
            <Text style={styles.snackbarTitle}>
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </Text>
            <TouchableOpacity onPress={hideSnackbar} activeOpacity={0.7}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TextInput
            ref={textInputRef}
            style={styles.input}
            value={input}
            placeholder="Enter subject name"
            placeholderTextColor="#999"
            onChangeText={text => setInput(text)}
            autoCapitalize="words"
          />

          <Text style={styles.sectionTitle}>Subject Type</Text>
          <View style={styles.typeSelector}>
            {['Lecture', 'Lab', !isEditing && 'Both']
              .filter(Boolean)
              .map(typeOption => (
                <TouchableOpacity
                  key={typeOption}
                  style={[
                    styles.typeChip,
                    type === typeOption && styles.selectedTypeChip,
                  ]}
                  onPress={() => setType(typeOption)}>
                  <Text
                    style={[
                      styles.typeChipText,
                      type === typeOption && styles.selectedTypeChipText,
                    ]}>
                    {typeOption === 'Lecture' ? 'Theory' : typeOption}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={isEditing ? saveEditHandler : addSubjectHandler}>
            <Text style={styles.actionButtonText}>
              {isEditing ? 'Save Changes' : 'Add Subject'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  headerTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  subjectList: {
    flex: 1,
    paddingHorizontal: 14,
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 2,
  },
  subjectInfo: {
    flex: 1,
    marginRight: 16,
  },
  subjectName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  deleteButton: {
    padding: 8,
  },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  snackbarContent: {
    padding: 24,
  },
  snackbarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  snackbarTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedTypeChip: {
    backgroundColor: '#333',
  },
  typeChipText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins-Medium',
    lineHeight: 14 * 1.5,
  },
  selectedTypeChipText: {
    color: '#fff',
  },
  actionButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  addSubjectButton: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addSubjectText: {
    color: '#131313',
    fontSize: 14,
    lineHeight: 14 * 1.5,
    fontFamily: 'Poppins-SemiBold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0)',
  },
});

export default Subject;
