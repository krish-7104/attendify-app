import {StyleSheet, Text, ScrollView, View} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import {ANALYSIS_INTERSTITIAL} from '../../utils/app-data';

const bannerAdUnitId = __DEV__
  ? TestIds.ANCHORED_ADAPTIVE_BANNER
  : ANALYSIS_BANNER;
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : ANALYSIS_INTERSTITIAL;
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});
const Analysis = ({navigation}) => {
  const data = useSelector(state => state);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    interstitial.load();
    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: 'black',
      title: 'Analysis',
      headerTitle: () => (
        <Text style={styles.headerTitle}>Attendance Analysis</Text>
      ),
    });
  }, [navigation]);

  const getAttendanceSuggestion = (presentCount, totalCount) => {
    const currentPercentage = (presentCount * 100) / totalCount;
    if (currentPercentage < 75) {
      const lecturesNeeded = Math.ceil(
        (0.75 * totalCount - presentCount) / 0.25,
      );
      return `Attend ${lecturesNeeded} more lectures to reach 75% attendance.`;
    }
    return '';
  };

  const getBorderColor = subject => {
    const totalClasses = subject.present.length + subject.absent.length;
    const attendancePercentage =
      totalClasses > 0 ? (subject.present.length * 100) / totalClasses : 0;

    if (attendancePercentage >= 75) return '#4ade80'; // Green
    if (attendancePercentage >= 50) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.analysisContainer}>
          {data.map(subject => (
            <View
              style={[styles.card, {borderLeftColor: getBorderColor(subject)}]}
              key={subject.id}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{subject.name}</Text>
                <Text style={styles.totalPercentage}>
                  {subject.present.length === 0 && subject.absent.length === 0
                    ? '0%'
                    : `${(
                        (subject.present.length * 100) /
                        (subject.present.length + subject.absent.length)
                      ).toFixed(2)}%`}
                </Text>
              </View>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, {backgroundColor: '#4ade80'}]}
                  />
                  <Text style={styles.subTitle}>
                    Present: {subject.present.length}/
                    {subject.present.length + subject.absent.length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, {backgroundColor: '#f87171'}]}
                  />
                  <Text style={styles.subTitle}>
                    Absent: {subject.absent.length}/
                    {subject.present.length + subject.absent.length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <View
                    style={[styles.statDot, {backgroundColor: '#60a5fa'}]}
                  />
                  <Text style={styles.subTitle}>
                    Cancel: {subject.cancel ? subject.cancel.length : 0}
                  </Text>
                </View>
              </View>
              {subject.present.length !== 0 &&
                subject.absent.length !== 0 &&
                (subject.present.length * 100) /
                  (subject.present.length + subject.absent.length) <
                  75 && (
                  <Text style={styles.attendanceSuggestion}>
                    {getAttendanceSuggestion(
                      subject.present.length,
                      subject.present.length + subject.absent.length,
                    )}
                  </Text>
                )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{marginVertical: 10}}>
        <BannerAd
          unitId={bannerAdUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </View>
  );
};

export default Analysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: '#181818',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 6,
  },
  sectionTitle: {
    marginVertical: 14,
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#181818',
  },
  analysisContainer: {
    width: '90%',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 14,
    borderRadius: 10,
    borderLeftWidth: 6,
    elevation: 3,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    color: '#181818',
    fontSize: 16,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#181818',
    fontSize: 13,
  },
  totalPercentage: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#181818',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  attendanceSuggestion: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#f87171',
    marginTop: 6,
  },
});
