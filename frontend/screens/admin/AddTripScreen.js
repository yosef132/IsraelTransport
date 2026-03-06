import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator, Portal, Modal, Provider } from 'react-native-paper';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity, Image } from 'react-native';

const initialFormState = {
  TripName: '',
  TripType: '',
  OpenHour: Array(7).fill('Closed'), // Initialize with "Closed"
  CloseHour: Array(7).fill('Closed'), // Initialize with "Closed"
  Description: '',
  ImageUri: null,
  ImageURL: null, // URL to save image after upload
};

const AddTripScreen = () => {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const [currentField, setCurrentField] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/trips/GetAllTrips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value, index) => {
    if (index !== undefined) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: prevForm[name].map((v, i) => (i === index ? value : v)),
      }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!form.TripName || !form.TripType || !form.Description) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }
  
    const openHour = form.OpenHour.map((time) => (time && time !== "" ? time : "Closed"));
    const closeHour = form.CloseHour.map((time) => (time && time !== "" ? time : "Closed"));
  
    setLoading(true);
    try {
      // Upload the image and get the URL
      const imageUrl = await uploadImage();
      if (imageUrl === null) {
        return; // Stop if image upload failed
      }
  
      // Construct the payload with the image URL
      const payload = {
        TripName: form.TripName,
        TripType: form.TripType,
        OpenHour: openHour,
        CloseHour: closeHour,
        Description: form.Description,
        ImageURL: imageUrl, // Use the uploaded image URL
      };
  
      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/trips/UpdateTrip/${editingId}`, payload);
        Alert.alert('Success', 'Trip updated successfully');
      } else {
        await axios.post('https://israeltransport.onrender.com/api/trips/CreateTrip', payload);
        Alert.alert('Success', 'Trip created successfully');
      }
  
      setForm(initialFormState);
      setEditingId(null);
      fetchTrips();
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting trip:', error);
      Alert.alert('Error', 'Failed to submit trip');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tripId) => {
    setLoading(true);
    try {
      await axios.delete(`https://israeltransport.onrender.com/api/trips/DeleteTrip/${tripId}`);
      Alert.alert('Success', 'Trip deleted successfully');
      fetchTrips();
    } catch (error) {
      console.error('Error deleting trip:', error);
      Alert.alert('Error', 'Failed to delete trip');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
  
        // Update the form with the image URI and other necessary information for upload
        setForm((prevForm) => ({
          ...prevForm,
          ImageUri: localUri, // Store for preview
          ImageInfo: { uri: localUri, name: filename, type }, // Store for uploading
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const uploadImage = async () => {
    if (!form.ImageInfo) {
      return null; // No image selected
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: form.ImageInfo.uri,
        name: form.ImageInfo.name,
        type: form.ImageInfo.type,
      });
  
      // Add the trip name to formData
      formData.append('tripName', form.TripName); // Assuming tripName needs to be sent
  
      const response = await axios.post(
        'https://israeltransport.onrender.com/api/image/UploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      return response.data.url; // Assuming the backend returns a field called `url`
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = (date) => {
    const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    handleChange(currentField, formattedTime, currentDayIndex);
    setTimePickerVisibility(false);
  };

  const showTimePicker = (index, field) => {
    setCurrentDayIndex(index);
    setCurrentField(field);
    setTimePickerVisibility(true);
  };

  const renderTrip = ({ item }) => {
    const openHours = Array.isArray(item.OpenHour) ? item.OpenHour.map((hour) => hour || 'Closed') : Array(7).fill('Closed');
    const closeHours = Array.isArray(item.CloseHour) ? item.CloseHour.map((hour) => hour || 'Closed') : Array(7).fill('Closed');

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title>{item.TripName}</Title>
          {item.ImageURL && (
            <Image source={{ uri: item.ImageURL }} style={styles.image} />
          )}
          <Paragraph>Type: {item.TripType}</Paragraph>
          <Paragraph>Open Hours: {openHours.join(', ')}</Paragraph>
          <Paragraph>Close Hours: {closeHours.join(', ')}</Paragraph>
          <Paragraph>Description: {item.Description}</Paragraph>
          <Button mode="contained" onPress={() => handleDelete(item.TripID)} style={styles.deleteButton}>
            Delete Trip
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.TripID ? item.TripID.toString() : Math.random().toString()}
          renderItem={renderTrip}
          ListEmptyComponent={() => <Paragraph style={styles.noTripsText}>No trips available</Paragraph>}
        />
        <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
          Add a Trip
        </Button>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Button onPress={() => setModalVisible(false)} style={styles.backButton}>
                Back
              </Button>
              <TextInput
                label="Trip Name"
                value={form.TripName}
                onChangeText={(value) => handleChange('TripName', value)}
                style={styles.input}
              />
              <TextInput
                label="Trip Type"
                value={form.TripType}
                onChangeText={(value) => handleChange('TripType', value)}
                style={styles.input}
              />
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                <View key={day} style={styles.rowContainer}>
                  <Text style={styles.dayText}>{day}</Text>
                  <View style={styles.timeButtonsContainer}>
                    <Button onPress={() => showTimePicker(index, 'OpenHour')} style={styles.timePickerButton}>
                      {form.OpenHour[index] || 'Closed'}
                    </Button>
                    <Button onPress={() => showTimePicker(index, 'CloseHour')} style={styles.timePickerButton}>
                      {form.CloseHour[index] || 'Closed'}
                    </Button>
                  </View>
                </View>
              ))}
              <TextInput
                label="Description"
                value={form.Description}
                onChangeText={(value) => handleChange('Description', value)}
                multiline
                style={styles.input}
              />
              <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                <Text style={styles.imagePickerText}>{form.ImageUri ? 'Change Image' : 'Pick an Image'}</Text>
              </TouchableOpacity>
              {form.ImageUri && (
                <Image source={{ uri: form.ImageUri }} style={styles.previewImage} />
              )}
              <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
                {loading ? <ActivityIndicator color="#fff" /> : (editingId ? "Update Trip" : "Add Trip")}
              </Button>
            </ScrollView>
          </Modal>
        </Portal>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={() => setTimePickerVisibility(false)}
        />

        {loading && <ActivityIndicator animating={true} size="large" />}
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeButtonsContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'space-between',
  },
  container: {
    padding: 16,
    flex: 1,
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
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
  timePickerButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  imagePickerButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePickerText: {
    color: '#007AFF',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    marginTop: 10,
  },
});

export default AddTripScreen;
