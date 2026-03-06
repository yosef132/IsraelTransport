import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { AuthContext } from '../../contexts/AuthContext';

const AdminMainScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?fit=crop&w=1500&q=80' }} 
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text h3 style={styles.title}>Admin Dashboard</Text>
        <Button 
          title="Booking Requests" 
          onPress={() => navigation.navigate('Booking Requests Screen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Vehicles" 
          onPress={() => navigation.navigate('VehiclesScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Schedule" 
          onPress={() => navigation.navigate('Schedule')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Add work schedule" 
          onPress={() => navigation.navigate('WorkScheduleScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Add Trip" 
          onPress={() => navigation.navigate('AddTripScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        
        <Button 
          title="Edit Users" 
          onPress={() => navigation.navigate('EditUsersScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Edit Drivers" 
          onPress={() => navigation.navigate('EditDriversScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Report a Bug" 
          onPress={() => navigation.navigate('ReportABug')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button 
          title="Logout" 
          onPress={logout}
          buttonStyle={[styles.button, styles.logoutButton]}
          titleStyle={styles.buttonTitle}
        />
        
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background to improve text visibility
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    width: 250,
    marginVertical: 10,
    paddingVertical: 15,
    backgroundColor: '#1E90FF',
    borderRadius: 30,
  },
  logoutButton: {
    backgroundColor: '#FF4500', 
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminMainScreen;
