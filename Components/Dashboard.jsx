import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {useState} from 'react';

const Dashboard = () => {
  const [overall, setOverall] = useState(0);
  const data = useSelector(state => state);
  useEffect(() => {
    let present = 0;
    let absent = 0;
    data.forEach(subject => {
      present += subject.present.length;
      absent += subject.absent.length;
    });
    if (present !== 0) {
      setOverall(((present * 100) / (absent + present)).toPrecision(4));
    } else {
      setOverall(0);
    }
  }, [data]);

  return (
    <View style={styles.card}>
      <Text style={styles.subTitle}>Hello 👋</Text>
      <Text style={styles.title}>Overall Attendance: {overall}%</Text>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: '90%',
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 20,
    shadowColor: '#18181840',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#181818',
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#181818',
  },
});
