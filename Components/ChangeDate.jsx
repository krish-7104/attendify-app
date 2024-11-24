import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';

const ChangeDate = props => {
  const [currentDate, setCurrentDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toString().slice(0, 15));
  }, []);

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      props.dateChangeHandler('manual', selectedDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.dateDiv}>
      <TouchableOpacity
        style={styles.changedateBtn}
        onPress={() => props.dateChangeHandler('left')}>
        <Icon name="caretleft" size={20} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.datePickerBtn} onPress={openDatePicker}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{props.date || currentDate}</Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
      <TouchableOpacity
        style={
          props.date === currentDate
            ? styles.changedateBtnDisabled
            : styles.changedateBtn
        }
        disabled={props.date === currentDate}
        onPress={() => props.dateChangeHandler('right')}>
        <Icon name="caretright" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ChangeDate;

const styles = StyleSheet.create({
  dateDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  changedateBtn: {
    borderRadius: 2,
    padding: 12,
  },
  changedateBtnDisabled: {
    padding: 12,
    opacity: 0.5,
  },
  datePickerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    paddingVertical: 8,
    width: '60%',
  },
  dateContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
    fontFamily: 'Poppins-Medium',
    lineHeight: 1.5 * 18,
  },
});
