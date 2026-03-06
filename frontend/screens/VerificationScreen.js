import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function VerificationScreen({ route }) {
  const { email } = route.params; // Get email from route parameters
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/users/verify-code', {
        email,
        verificationCode,
      });

      if (response.status === 200) {
        alert('Verification successful. You can now log in.');
        navigation.navigate('LoginScreen');
      } else {
        alert('Verification failed. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Verification failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>
        <TextInput
          label="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          style={styles.input}
          mode="outlined"
          keyboardType="number-pad"
        />
        <Button mode="contained" onPress={handleVerifyCode} style={styles.button}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Verify Code'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
  },
});

export default VerificationScreen;
