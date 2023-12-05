import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useLayoutEffect} from 'react';

const HowToUse = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'How To Use',
      headerTitle: () => {
        return (
          <Text
            style={{
              fontSize: 20,
              marginTop: 6,
              marginLeft: -8,
              color: '#181818',
              fontFamily: 'Poppins-SemiBold',
            }}>
            How To Use
          </Text>
        );
      },
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.text}>
          1. Go to Subjects screen from top left menu add your subjects.
        </Text>
        <Text style={styles.text}>
          2. You can also edit the subjects by clicking on the name of the
          subject.
        </Text>
        <Text style={styles.text}>
          3. After adding subject you can add attendance of any day, you can
          change the date by left and right icon around date in home page.
        </Text>
        <Text style={styles.text}>
          4. You can click on add attendance on home screen and select Green
          tick (Present), Red Cross (Absent) and Blue Sign (Cancel Lecture).
        </Text>
        <Text style={styles.text}>
          5. You can add multiple attendance of any subject on same day.
        </Text>
        <Text style={styles.text}>
          6. You can export this attendance by going to settings and
          "attendance.attendify" file will be created that you can store it
          anywhere and can import it whenever nevessary
        </Text>
        <Text style={styles.text}>
          7. You can also edit the attendance of any date, visit to Edit
          Attendance screen and change do changes.
        </Text>
        <Text style={styles.text}>
          8. When you term ends or semester ends you can delete all the
          attendance data by going to Settings and reset the app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HowToUse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    color: 'black',
    marginVertical: 6,
    fontSize: 15,
    lineHeight: 24,
  },
});
