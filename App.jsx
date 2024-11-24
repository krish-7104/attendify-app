import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {mystore} from './redux/store';
import Main from './Screens/Add Attendance/Main';
import Subject from './Screens/Add Subject/Subject';
import EditAttend from './Screens/Edit Attendance/EditAttend';
import Setting from './Screens/Settings/Setting';
import Analysis from './Screens/Analysis/Analysis';
import {Linking} from 'react-native';
import {View, Image, StyleSheet, Text} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import {useEffect} from 'react';
import {ONESIGNAL} from './app-data';

export default function App() {
  useEffect(() => {
    const ConfigureOnesignal = () => {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      OneSignal.initialize(ONESIGNAL);
      OneSignal.Notifications.requestPermission(true);
    };
    !__DEV__ && ConfigureOnesignal();
  }, []);
  const Drawer = createDrawerNavigator();
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{paddingTop: 50, flex: 1}}>
        <View style={styles.headerContainer}>
          <Image source={require('./assets/logo.png')} style={styles.icon} />
          <Text style={styles.title}>Attendify</Text>
        </View>
        <DrawerItemList {...props} />
        <View
          style={{
            width: '100%',
            position: 'absolute',
            bottom: 20,
          }}>
          <DrawerItem
            label="About Developer"
            onPress={() => Linking.openURL('https://krishjotaniya.netlify.app')}
          />
          <DrawerItem
            label="Feedback"
            onPress={() =>
              Linking.openURL(
                'https://krishjotaniya.netlify.app/contact?ref=Attendify-App-Feedback',
              )
            }
          />
        </View>
      </DrawerContentScrollView>
    );
  }
  return (
    <Provider store={mystore}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={props => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="Home" component={Main} />
          <Drawer.Screen name="Subject" component={Subject} />
          <Drawer.Screen name="Analysis" component={Analysis} />
          <Drawer.Screen name="Edit Attendance" component={EditAttend} />
          <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
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
