import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const EditDiv = props => {
  if (
    props.present.includes(props.date) ||
    props.absent.includes(props.date) ||
    props.cancel.includes(props.date)
  ) {
    return (
      <View style={styles.div}>
        <View style={styles.textArea}>
          <Text style={styles.subName}>{props.subject}</Text>
        </View>
        <View style={styles.attendShow}>
          <Text style={styles.subData}>
            {props.present.length +
              '/' +
              (props.present.length + props.absent.length) +
              '  (' +
              (
                (props.present.length * 100) /
                (props.present.length + props.absent.length)
              ).toPrecision(4) +
              '%)'}
          </Text>
          <TouchableOpacity
            onPress={() => props.removeAttendanceHandler(props.id, props.date)}
            activeOpacity={0.8}
            style={{
              padding: 3,
              borderRadius: 4,
              marginRight: 10,
            }}>
            <Icon name="delete-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            width: '60%',
            overflow: 'hidden',
            marginTop: -2,
          }}>
          {props.present.filter(date => date === props.date).length !== 0 && (
            <View
              style={{
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#4ade80',
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 30,
                  fontSize: 14,
                  marginRight: 4,
                }}></View>
              <Text style={{color: '#181818'}}>
                {props.present.filter(date => date === props.date).length}
              </Text>
            </View>
          )}
          {props.absent.filter(date => date === props.date).length !== 0 && (
            <View
              style={{
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#f87171',
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 30,
                  fontSize: 14,
                  marginRight: 4,
                }}></View>
              <Text style={{color: '#181818'}}>
                {props.absent.filter(date => date === props.date).length}
              </Text>
            </View>
          )}
          {props.cancel.filter(date => date === props.date).length !== 0 && (
            <View
              style={{
                marginRight: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#60a5fa',
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  borderRadius: 30,
                  fontSize: 14,
                  marginRight: 4,
                }}></View>
              <Text style={{color: '#181818'}}>
                {props.cancel.filter(date => date === props.date).length}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
};

export default EditDiv;

const styles = StyleSheet.create({
  div: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingRight: 16,
    marginBottom: 12,
    marginHorizontal: 'auto',
    flexDirection: 'column',
  },
  textArea: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
  },
  attendShow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    elevation: 20,
    shadowColor: '#18181840',
  },
  subName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  subData: {
    fontSize: 15,
    letterSpacing: 1,
    fontFamily: 'Poppins-Regular',
    color: '#181818',
  },
  btnArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 10,
    borderRadius: 10,
  },
});
