import React, { useState, useContext } from 'react';
import { View, StyleSheet, ImageBackground, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Checkbox, Text } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (username && password) {
      setLoading(true);
      try {
        const response = await axios.post('https://israeltransport.onrender.com/api/users/Login', {
          username,
          password,
        });

        if (response.status === 200) {
          let userData = response.data.user;

          if (response.data.userType === 'Driver' && response.data.driver) {
            userData = response.data.driver;
            userData.userType = 'Driver';
          }

          if (userData && userData.userID) {
            await login(userData, rememberMe);
            Alert.alert('Success', 'Login successful', [{ text: 'OK' }]);

            if (userData.userType === 'client') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'AppTabs' }],
              });
            } else if (userData.userType === 'admin') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'AdminScreen' }],
              });
            } else if (userData.userType === 'Driver') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'DriverScreen' }],
              });
            } else {
              Alert.alert('Error', 'Unknown user type');
            }
          } else {
            throw new Error('User data does not contain userID');
          }
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        Alert.alert('Error', 'Login failed: Password or username is incorrect');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Warning', 'Please enter username and password');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://www.tripsavvy.com/thmb/fpc4dIbgqBEGwqwJ3Fl7O0Dtx70=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/icefields-parkway-road-trip-641871108-c9c504640f8849c5bdef26c8eee4d1bb.jpg' }}
      style={styles.background}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />
        <View style={styles.rememberMeContainer}>
          <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'}
            onPress={() => setRememberMe(!rememberMe)}
            color="#007AFF"
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </View>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={{ fontSize: 18 }}
        >
          {loading ? <ActivityIndicator color="#fff" /> : 'Log In'}
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

