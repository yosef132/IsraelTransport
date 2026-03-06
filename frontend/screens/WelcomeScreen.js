import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { Text, Button, Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <PaperProvider>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80' }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Israel Transport</Text>
          <Text style={styles.subtitle}>Know where your next trip is and make it a great one! 😊</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Log In
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('SignUpScreen')}
            style={styles.buttonOutline}
            labelStyle={styles.buttonOutlineLabel}
          >
            Sign Up
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Home')}
            style={styles.buttonOutlineBlack}
            labelStyle={styles.buttonOutlineLabelBlack}
          >
            Explore Trips in Israel
          </Button>
        </View>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#f0f0f0',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 26,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    marginTop: 15,
    width: '80%',
    paddingVertical: 12,
    backgroundColor: '#ff8c00',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
  },
  buttonLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonOutline: {
    marginTop: 15,
    width: '80%',
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff8c00',
  },
  buttonOutlineBlack: {
    marginTop: 15,
    width: '80%',
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonOutlineLabel: {
    fontSize: 18,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  buttonOutlineLabelBlack: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
