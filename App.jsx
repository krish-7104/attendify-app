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
export default function App() {
  const Drawer = createDrawerNavigator();
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 80,
        }}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="About Developer"
          onPress={() => Linking.openURL('https://krishjotaniya.live')}
        />
        <DrawerItem
          label="Feedback"
          onPress={() =>
            Linking.openURL('https://krishjotaniya.live/contactme')
          }
        />
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
          <Drawer.Screen name="Reset App" component={Setting} />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
