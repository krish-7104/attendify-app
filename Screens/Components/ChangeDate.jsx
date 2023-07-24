import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useEffect} from 'react';
import {useState} from 'react';
const ChangeDate = props => {
  const [date, setDate] = useState();
  useEffect(() => {
    let date = new Date();
    setDate(date.toString().slice(0, 15));
  }, []);

  return (
    <View style={styles.dateDiv}>
      <TouchableOpacity
        style={styles.changedateBtn}
        onPress={() => props.dateChangeHandler('left')}>
        <Icon name="caretleft" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.date}>{props.date && props.date}</Text>
      <TouchableOpacity
        style={
          props.date === date ? styles.changedateBtnDis : styles.changedateBtn
        }
        disabled={props.date === date ? true : false}
        onPress={() => props.dateChangeHandler('right')}>
        <Icon name="caretright" size={20} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ChangeDate;

const styles = StyleSheet.create({
  dateDiv: {
    marginVertical: 14,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  changedateBtnDis: {
    padding: 8,
    borderRadius: 6,
    opacity: 0.1,
  },
  changedateBtn: {
    padding: 8,
    borderRadius: 6,
  },
  date: {
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
    width: '50%',
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
});
