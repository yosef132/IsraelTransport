import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator, Portal, Modal, Provider } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const initialFormState = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  language: '',
  country: '',
  city: '',
  userID: '',
  drivingLicense: '',
  drivingLicenseExpiration: '',
};

const EditDriversScreen = () => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/drivers/GetAllDrivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      Alert.alert('Error', 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password || !form.language || !form.country || !form.city || !form.drivingLicense || !form.drivingLicenseExpiration) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/drivers/UpdateDriver/${editingId}`, form);
        Alert.alert('Success', 'Driver updated successfully');
      } else {
        await axios.post('https://israeltransport.onrender.com/api/drivers/CreateDriver', form);
        Alert.alert('Success', 'Driver created successfully');
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchDrivers();
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting driver:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to submit driver');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (userID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this driver?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDelete(userID),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (userID) => {
    if (!userID) {
      Alert.alert('Error', 'User ID is missing');
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`https://israeltransport.onrender.com/api/drivers/DeleteDriver/${userID}`);
      Alert.alert('Success', 'Driver deleted successfully');
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      Alert.alert('Error', 'Failed to delete driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (driver) => {
    setForm({
      fullName: driver.fullName,
      username: driver.username,
      email: driver.email,
      password: driver.password,
      language: driver.language,
      country: driver.country,
      city: driver.city,
      userID: driver.userID,
      drivingLicense: driver.drivingLicense,
      drivingLicenseExpiration: new Date(driver.drivingLicenseExpiration).toISOString().split('T')[0], // Format to YYYY-MM-DD
    });
    setEditingId(driver.userID);
    setModalVisible(true);
  };

  const openAddDriverModal = () => {
    setForm(initialFormState);
    setEditingId(null);
    setModalVisible(true);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setForm({ ...form, drivingLicenseExpiration: date.toISOString().split('T')[0] }); // Format to YYYY-MM-DD
    hideDatePicker();
  };

  const renderDriver = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.fullName}</Title>
        <Paragraph>Username: {item.username}</Paragraph>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Language: {item.language}</Paragraph>
        <Paragraph>Country: {item.country}</Paragraph>
        <Paragraph>City: {item.city}</Paragraph>
        <Paragraph>Driving License: {item.drivingLicense}</Paragraph>
        <Paragraph>Driving License Expiration: {new Date(item.drivingLicenseExpiration).toLocaleDateString()}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(item)}>Edit</Button>
        <Button onPress={() => confirmDelete(item.userID)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Button mode="contained" onPress={openAddDriverModal} style={styles.addButton}>
          Add Driver
        </Button>
        <FlatList
          data={drivers}
          keyExtractor={(item) => item.userID.toString()}
          renderItem={renderDriver}
          ListEmptyComponent={() => <Paragraph style={styles.noDriversText}>No drivers available</Paragraph>}
        />
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Button onPress={() => setModalVisible(false)} style={styles.backButton}>
                Back
              </Button>
              <TextInput
                label="Full Name"
                value={form.fullName}
                onChangeText={(value) => handleChange('fullName', value)}
                style={styles.input}
              />
              <TextInput
                label="Username"
                value={form.username}
                onChangeText={(value) => handleChange('username', value)}
                style={styles.input}
              />
              <TextInput
                label="Email"
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                style={styles.input}
              />
              <TextInput
                label="Password"
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                label="Language"
                value={form.language}
                onChangeText={(value) => handleChange('language', value)}
                style={styles.input}
              />
              <TextInput
                label="Country"
                value={form.country}
                onChangeText={(value) => handleChange('country', value)}
                style={styles.input}
              />
              <TextInput
                label="City"
                value={form.city}
                onChangeText={(value) => handleChange('city', value)}
                style={styles.input}
              />
              <TextInput
                label="Driving License"
                value={form.drivingLicense}
                onChangeText={(value) => handleChange('drivingLicense', value)}
                style={styles.input}
              />
              <Button onPress={showDatePicker} style={styles.dateButton}>
                {form.drivingLicenseExpiration ? `Expiration: ${form.drivingLicenseExpiration}` : 'Set Expiration Date'}
              </Button>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
                {editingId ? "Update Driver" : "Add Driver"}
              </Button>
            </ScrollView>
          </Modal>
        </Portal>
        {loading && <ActivityIndicator animating={true} size="large" />}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  addButton: {
    marginBottom: 16,
  },
  noDriversText: {
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  modalContent: {
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  dateButton: {
    marginBottom: 16,
  },
});

export default EditDriversScreen;
