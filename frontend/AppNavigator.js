import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DriverScreen from './screens/DriverScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ClientScreen from './screens/ClientScreen';
import BookABusScreen from './screens/BookABusScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import AdminMainScreen from './screens/admin/AdminMainScreen';
import BookingRequestsScreen from './screens/admin/BookingRequestsScreen';
import VehiclesScreen from './screens/admin/VehiclesScreen';
import Schedule from './screens/admin/Schedule';
import WorkScheduleScreen from './screens/admin/WorkScheduleScreen';
import AddTripScreen from './screens/admin/AddTripScreen';
import EditUsersScreen from './screens/admin/EditUsersScreen';
import EditDriversScreen from './screens/admin/EditDriversScreen';
import VerificationScreen from './screens/VerificationScreen';
import ReportABug from './screens/admin/ReportABug';
import { AuthContext } from './contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }
       else if (route.name === 'Book A Bus') {
        iconName = 'bus-outline';
      }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={ClientScreen}  options={{ headerShown: false }} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Book A Bus" component={BookABusScreen} />
    
  </Tab.Navigator>
);

const AdminStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminMainScreen" component={AdminMainScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Booking Requests Screen" component={BookingRequestsScreen}  />
    <Stack.Screen name="VehiclesScreen" component={VehiclesScreen} />
    <Stack.Screen name="Schedule" component={Schedule} />
    <Stack.Screen name="WorkScheduleScreen" component={WorkScheduleScreen} />
    <Stack.Screen name="AddTripScreen" component={AddTripScreen} />
    <Stack.Screen name="EditUsersScreen" component={EditUsersScreen} />
    <Stack.Screen name="EditDriversScreen" component={EditDriversScreen} />
    <Stack.Screen name="ReportABug" component={ReportABug} />
  </Stack.Navigator>
);

const AuthStackNavigator = () => (
  <Stack.Navigator initialRouteName="WelcomeScreen">
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
  </Stack.Navigator>
);
const DriverStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="DriverScreen" component={DriverScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Optional: add a loading spinner while user data is being loaded
  }

  return (
    <NavigationContainer>
      {user ? (
        user.userType === 'admin' ? (
          <AdminStackNavigator />
        ) : user.userType === 'Driver' ? (
          <DriverStackNavigator />
        ) : (
          <ClientTabNavigator />
        )
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
  
};

export default AppNavigator;
