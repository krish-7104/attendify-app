import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const AttendDiv = props => {
  const getBorderColor = () => {
    const totalClasses = props.present.length + props.absent.length;
    const attendancePercentage =
      totalClasses > 0 ? (props.present.length * 100) / totalClasses : 0;

    if (attendancePercentage >= 75) return '#4ade80'; // Green
    if (attendancePercentage >= 50) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  if (
    props.present.includes(props.date) ||
    props.absent.includes(props.date) ||
    props.cancel.includes(props.date)
  ) {
    return (
      <View style={[styles.div, {borderLeftColor: getBorderColor()}]}>
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
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
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
      </View>
    );
  }
};

export default AttendDiv;

const styles = StyleSheet.create({
  div: {
    width: '90%',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 12,
    borderLeftWidth: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textArea: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  attendShow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subName: {
    fontSize: 16,
    marginBottom: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  subData: {
    color: '#181818',
    fontSize: 14,
    letterSpacing: 1,
    width: '40%',
    fontFamily: 'Poppins-Regular',
  },
  btnArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
});
