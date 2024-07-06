import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import Icon from 'react-native-vector-icons/AntDesign';

const MoreDetails = ({navigation, route}) => {
  const [month, setMonth] = useState(moment().format('YYYY-MM'));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Analysis Details',
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
  const {subject} = route.params;
  const subjectData = data.find(sub => sub.id === subject);

  const combinedData = [
    ...subjectData.present.map(date => ({date, status: 'Present'})),
    ...subjectData.absent.map(date => ({date, status: 'Absent'})),
    ...subjectData.cancel.map(date => ({date, status: 'Cancel'})),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filterDatesForMonth = (data, month) => {
    return data.filter(item => moment(item.date).format('YYYY-MM') === month);
  };

  const currentMonthDates = filterDatesForMonth(combinedData, month);

  const handleMonthChange = direction => {
    setMonth(moment(month).add(direction, 'months').format('YYYY-MM'));
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <TouchableOpacity
        style={{
          backgroundColor: 'black',
          padding: 10,
          zIndex: 40,
          borderRadius: 10,
          marginTop: 10,
        }}>
        <Icon name="back" color={'white'} size={24} />
      </TouchableOpacity>
      <View activeOptacity={0.9} style={styles.card} key={subject.id}>
        <Text style={styles.title}>{subjectData.name}</Text>
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
                style={{
                  backgroundColor: '#4ade80',
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderRadius: 30,
                  marginRight: 4,
                }}></View>
              <Text style={styles.subTitle}>
                Present: {subjectData.present.length}/
                {subjectData.present.length + subjectData.absent.length}
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
                style={{
                  backgroundColor: '#f87171',
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderRadius: 30,
                  marginRight: 4,
                }}></View>
              <Text style={styles.subTitle}>
                Absent: {subjectData.absent.length}/
                {subjectData.present.length + subjectData.absent.length}
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
                style={{
                  backgroundColor: '#60a5fa',
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderRadius: 30,
                  marginRight: 4,
                }}></View>
              <Text style={styles.subTitle}>
                Cancel: {subjectData?.cancel ? subjectData?.cancel?.length : 0}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text style={styles.totalPercentage}>
              {subjectData.present.length === 0 &&
              subjectData.absent.length === 0
                ? 0
                : (
                    (subjectData.present.length * 100) /
                    (subjectData.present.length + subjectData.absent.length)
                  ).toPrecision(4)}
              %
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.dateDiv}>
        <TouchableOpacity
          style={styles.changedateBtn}
          onPress={() => handleMonthChange(-1)}>
          <Icon name="caretleft" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.date}>{moment(month).format('MMMM YYYY')}</Text>
        <TouchableOpacity
          style={styles.changedateBtn}
          onPress={() => handleMonthChange(1)}>
          <Icon name="caretright" size={20} color="black" />
        </TouchableOpacity>
      </View>
      {currentMonthDates.map((item, index) => (
        <View key={index} style={styles.dateContainer}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text
            style={[
              styles.statusText,
              item.status === 'Present' && {backgroundColor: '#4ade80'},
              item.status === 'Absent' && {backgroundColor: '#f87171'},
              item.status === 'Cancel' && {backgroundColor: '#60a5fa'},
            ]}>
            {item.status.slice(0, 1)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default MoreDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    width: '90%',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 1,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '96%',
    backgroundColor: '#fff',
    marginTop: 10,
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
    fontSize: 13,
    color: '#18181890',
  },
  totalPercentage: {
    fontSize: 24,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    flex: 1,
    paddingBottom: 10,
  },
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
