import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {mystore} from './redux/store';
import Main from './Screens/Add Attendance/Main';
import Subject from './Screens/Add Subject/Subject';
import EditAttend from './Screens/Edit Attendance/EditAttend';
import Setting from './Screens/Settings/Setting';
import Analysis from './Screens/Analysis/Analysis';
import HowToUse from './Screens/HowToUse/HowToUse';
import {StyleSheet} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {ONESIGNAL} from './onesignal';
import {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export default function App() {
  useEffect(() => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize(ONESIGNAL);
    OneSignal.Notifications.requestPermission(true);
  }, []);

  const MyTheme = {
    colors: {
      primary: '#2563eb',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
    },
  };

  const Tab = createBottomTabNavigator();

  return (
    <Provider store={mystore}>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home-outline';
              } else if (route.name === 'Subjects') {
                iconName = 'book-outline';
              } else if (route.name === 'Analysis') {
                iconName = 'analytics-outline';
              } else if (route.name === 'Edit') {
                iconName = 'create-outline';
              } else if (route.name === 'Settings') {
                iconName = 'settings-outline';
              }

              return <Icon name={iconName} size={22} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#18181870',
            gestureEnabled: true,
            swipeEnabled: true,
            tabBarStyle: {
              height: 60,
              padding: 10,
              paddingBottom: 4,
            },
            tabBarLabelStyle: {
              fontFamily: 'Poppins-Medium',
            },
          })}>
          <Tab.Screen name="Home" component={Main} />
          <Tab.Screen name="Subjects" component={Subject} />
          <Tab.Screen name="Analysis" component={Analysis} />
          <Tab.Screen name="Edit" component={EditAttend} />
          <Tab.Screen name="Settings" component={Setting} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
});
