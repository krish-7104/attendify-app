import {StyleSheet, Text, ScrollView, View} from 'react-native';
import React from 'react';
import {useLayoutEffect} from 'react';
import Dashboard from '../../Components/Dashboard';
import {useSelector} from 'react-redux';

const Analysis = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Analysis',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 20,
              marginTop: 6,

              color: '#181818',
              fontFamily: 'Poppins-SemiBold',
            }}>
            Attendance Analysis
          </Text>
        );
      },
    });
  }, [navigation]);
  const data = useSelector(state => state);
  const getAttendanceSuggestion = (presentCount, totalCount) => {
    const currentPercentage = (presentCount * 100) / totalCount;
    if (currentPercentage < 75) {
      const lecturesNeeded = Math.ceil(
        (0.75 * totalCount - presentCount) / 0.25,
      );
      return `Attend ${lecturesNeeded} more lectures to reach 75% attendance.`;
    }
    return ' ';
  };

  return (
    <View>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        <Dashboard />
        <Text
          style={{
            marginVertical: 14,
            fontSize: 18,
            fontFamily: 'Poppins-Medium',
            color: '#181818',
          }}>
          Subject Wise Analysis
        </Text>
        <View
          style={{
            // backgroundColor: '#fff',
            width: '90%',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // elevation: 1,
          }}>
          {data.map((subject, index) => {
            return (
              <View style={styles.card} key={subject.id}>
                <Text style={styles.title}>{subject.name}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#4ade80',
                          paddingHorizontal: 6,
                          paddingVertical: 6,
                          borderRadius: 30,
                          marginRight: 4,
                        }}></View>
                      <Text style={styles.subTitle}>
                        Present: {subject.present.length}/
                        {subject.present.length + subject.absent.length}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#f87171',
                          paddingHorizontal: 6,
                          paddingVertical: 6,
                          borderRadius: 30,
                          marginRight: 4,
                        }}></View>
                      <Text style={styles.subTitle}>
                        Absent: {subject.absent.length}/
                        {subject.present.length + subject.absent.length}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#60a5fa',
                          paddingHorizontal: 6,
                          paddingVertical: 6,
                          borderRadius: 30,
                          marginRight: 4,
                        }}></View>
                      <Text style={styles.subTitle}>
                        Cancel: {subject?.cancel ? subject?.cancel?.length : 0}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.totalPercentage}>
                    {subject.present.length === 0 && subject.absent.length === 0
                      ? 0
                      : (
                          (subject.present.length * 100) /
                          (subject.present.length + subject.absent.length)
                        ).toPrecision(4)}
                    %
                  </Text>
                </View>
                {subject.present.length === 0 && subject.absent.length === 0 ? (
                  <Text style={styles.attendanceSuggestion}>
                    {getAttendanceSuggestion(0, 0)}
                  </Text>
                ) : (
                  (subject.present.length * 100) /
                    (subject.present.length + subject.absent.length) <
                    75 && (
                    <Text style={styles.attendanceSuggestion}>
                      {getAttendanceSuggestion(
                        subject.present.length,
                        subject.present.length + subject.absent.length,
                      )}
                    </Text>
                  )
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Analysis;

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '96%',
    backgroundColor: '#fff',
    marginBottom: 14,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    color: '#181818',
    fontSize: 16,
    marginBottom: 4,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#181818',
    fontSize: 13,
    color: '#18181890',
  },
  totalPercentage: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  attendanceSuggestion: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
    marginTop: 6,
  },
});
