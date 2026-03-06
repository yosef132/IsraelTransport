import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { TextInput, Button, Text, Icon } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword || !language || !country || !city) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/users/SignUp', {
        fullName,
        username,
        email,
        password,
        language,
        country,
        city,
        userTypeID: 2,
        userType: 'Client',
      });

      if (response.status === 201) {
        alert('Sign up successful. Please verify your email.');
        navigation.navigate('VerificationScreen', { email });
      } else {
        alert('Sign up failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Sign up failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Create Your Account</Text>
      <TextInput
        label="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Language"
        value={language}
        onChangeText={setLanguage}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <TextInput
        label="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#007AFF' } }}
      />
      <Button mode="contained" onPress={handleSignUp} style={styles.button} labelStyle={styles.buttonLabel}>
        {loading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
