import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, ScrollView, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

const VehiclesScreen = () => {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ Make: '', Model: '', Year: '', Km: '', vehicleType: '', carPlateNumber: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/vehicles/GetAllVehicles');
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      Alert.alert('Error', 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.Make || !form.Model || !form.Year || !form.Km || !form.vehicleType || !form.carPlateNumber) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/vehicles/UpdateVehicle/${editingId}`, form);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await axios.post('https://israeltransport.onrender.com/api/vehicles/CreateVehicle', form);
        Alert.alert('Success', 'Vehicle created successfully');
      }
      setForm({ Make: '', Model: '', Year: '', Km: '', vehicleType: '', carPlateNumber: '' });
      setEditingId(null);
      fetchVehicles();
    } catch (error) {
      console.error('Error submitting vehicle:', error);
      Alert.alert('Error', 'Failed to submit vehicle');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (VehicleID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this vehicle?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(VehicleID),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (VehicleID) => {
    if (!VehicleID) {
      Alert.alert('Error', 'Vehicle ID is missing');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`https://israeltransport.onrender.com/api/vehicles/DeleteVehicle/${VehicleID}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      Alert.alert('Success', 'Vehicle deleted successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Alert.alert('Error', 'Failed to delete vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehicle) => {
    setForm(vehicle);
    setEditingId(vehicle.VehicleID);
  };

  return (
    <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.linearGradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <TextInput
            label="Make"
            value={form.Make}
            onChangeText={(value) => handleChange('Make', value)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <TextInput
            label="Model"
            value={form.Model}
            onChangeText={(value) => handleChange('Model', value)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <TextInput
            label="Year"
            value={form.Year}
            onChangeText={(value) => handleChange('Year', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <TextInput
            label="Kilometers"
            value={form.Km}
            onChangeText={(value) => handleChange('Km', value)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <TextInput
            label="Vehicle Type"
            value={form.vehicleType}
            onChangeText={(value) => handleChange('vehicleType', value)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <TextInput
            label="Car Plate Number"
            value={form.carPlateNumber}
            onChangeText={(value) => handleChange('carPlateNumber', value)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: '#FF6347', underlineColor: 'transparent' } }}
          />
          <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
            {editingId ? "Update Vehicle" : "Add Vehicle"}
          </Button>
        </View>

        {loading && <ActivityIndicator animating={true} size="large" color="#FF6347" />}

        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id?.toString() ?? Math.random().toString()}
          renderItem={({ item }) => (
            <Animated.View style={{ opacity: fadeAnim }}>
              <Card style={styles.card}>
                <Card.Title
                  title={`${item.Make} ${item.Model}`}
                  subtitle={`Plate: ${item.carPlateNumber}`}
                  left={(props) => <AntDesign {...props} name="car" size={24} color="#FF6347" />}
                />
                <Card.Content>
                  <Divider style={styles.divider} />
                  <Paragraph>Year: {item.Year}</Paragraph>
                  <Paragraph>Kilometers: {item.Km.Km||item.Km} </Paragraph>
                  <Paragraph>Vehicle Type: {item.vehicleType}</Paragraph>
                </Card.Content>
                <Card.Actions style={styles.buttonContainerVertical}>
                  <Button color="#FF6347" onPress={() => handleEdit(item)} style={styles.buttonSpacing}>Edit</Button>
                  <Button color="#FF3B30" onPress={() => confirmDelete(item.VehicleID)} style={styles.buttonSpacing}>Delete</Button>
                </Card.Actions>
              </Card>
            </Animated.View>
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF6347',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  divider: {
    marginVertical: 8,
  },
  buttonContainerVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  buttonSpacing: {
    marginVertical: 5,
  },
});

export default VehiclesScreen;
