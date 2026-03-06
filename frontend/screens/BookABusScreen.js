import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Card, Text, Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { AuthContext } from '../contexts/AuthContext';

const BookABusScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const tripId = route?.params?.tripId || null; // Handle undefined params safely

  const [formData, setFormData] = useState({
    bookingTypeID: 1,
    status: 'Pending',
    startTrailDate: new Date(),
    endTrailDate: new Date(),
    passengers: '',
    pickupAddress: '',
    dropoffAddress: '',
    fullName: '',
    email: '',
    phone: '',
    stopStations: '',
    notes: ''
  });
  const [showStartTrailPicker, setShowStartTrailPicker] = useState(false);
  const [showEndTrailPicker, setShowEndTrailPicker] = useState(false);
  const [bookingTypes, setBookingTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date();

  useEffect(() => {
    // Fetch available booking types
    const fetchBookingTypes = async () => {
      try {
        const response = await axios.get('https://israeltransport.onrender.com/api/bookingtypes/GetAllBookingTypes');
        setBookingTypes(response.data);
      } catch (error) {
        console.error('Error fetching booking types:', error);
      }
    };

    fetchBookingTypes();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate, field) => {
    if (selectedDate) {
      const currentDate = selectedDate || formData[field];
      setFormData({ ...formData, [field]: currentDate });
    }
    if (field === 'startTrailDate') setShowStartTrailPicker(false);
    if (field === 'endTrailDate') setShowEndTrailPicker(false);
  };

  const handleSubmit = async () => {
    if (!user || !user.userID) {
      navigation.navigate('Home');
      return;
    }

    setLoading(true);

    const bookingData = {
      BookingID: Math.floor(Math.random() * 1000000), // Generate a unique BookingID
      UserID: user.userID,
      status: formData.status,
      startTrailDate: formData.startTrailDate.toISOString(),
      endTrailDate: formData.endTrailDate.toISOString(),
      Passengers: parseInt(formData.passengers, 10),
      PickupAddress: formData.pickupAddress,
      DropOffAddress: formData.dropoffAddress,
      FullName: formData.fullName,
      Email: formData.email,
      PhoneNumber: formData.phone,
      stopStations: formData.stopStations.split(',').map(station => station.trim()),
      notes: formData.notes
    };

    try {
      const response = await axios.post('https://israeltransport.onrender.com/api/bookings/create', bookingData);

      if (response.status === 201) {
        Alert.alert(
          'Booking Successful',
          'Your booking has been successfully created!',
          [
            { text: 'OK', onPress: () => navigation.navigate('ClientScreen') }
          ]
        );
      } else {
        Alert.alert(
          'Booking Failed',
          'Failed to create booking. Please try again later.',
          [
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Error',
        'An error occurred while creating the booking. Please check your details and try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.title}>Book A Bus</Card.Title>
        <Card.Divider />

        <Text style={styles.label}>Booking Type</Text>
        <RNPickerSelect
          onValueChange={(value) => handleChange('bookingTypeID', value)}
          items={bookingTypes.map((type) => ({ label: type.TypeName, value: type.BookingTypeID }))}
          style={pickerSelectStyles}
          value={formData.bookingTypeID}
          placeholder={{ label: 'Select Booking Type', value: null }}
        />

        <Input
          label="Passengers"
          value={formData.passengers}
          onChangeText={(text) => handleChange('passengers', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowStartTrailPicker(true)}>
          <Text style={styles.dateText}>Start Trail Date: {formData.startTrailDate.toDateString()}</Text>
          <Icon name="calendar" type="font-awesome" color="#007AFF" />
        </TouchableOpacity>
        {showStartTrailPicker && (
          <DateTimePicker
            value={formData.startTrailDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'startTrailDate')}
            minimumDate={today}
          />
        )}

        <TouchableOpacity style={styles.datePicker} onPress={() => setShowEndTrailPicker(true)}>
          <Text style={styles.dateText}>End Trail Date: {formData.endTrailDate.toDateString()}</Text>
          <Icon name="calendar" type="font-awesome" color="#007AFF" />
        </TouchableOpacity>
        {showEndTrailPicker && (
          <DateTimePicker
            value={formData.endTrailDate}
            mode="date"
            display="default"
            onChange={(event, date) => handleDateChange(event, date, 'endTrailDate')}
            minimumDate={today}
          />
        )}

        <Input
          label="Pick Up Address"
          value={formData.pickupAddress}
          onChangeText={(text) => handleChange('pickupAddress', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
        />
        <Input
          label="Drop Off Address"
          value={formData.dropoffAddress}
          onChangeText={(text) => handleChange('dropoffAddress', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
        />
        <Input
          label="Full Name"
          value={formData.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
        />
        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
          keyboardType="email-address"
        />
        <Input
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => handleChange('phone', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
          keyboardType="phone-pad"
        />
        <Input
          label="Stop Stations (comma separated)"
          value={formData.stopStations}
          onChangeText={(text) => handleChange('stopStations', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
        />
        <Input
          label="Notes"
          value={formData.notes}
          onChangeText={(text) => handleChange('notes', text)}
          style={[styles.input, { borderBottomWidth: 0 }]}
        />

        <Button
          title="Get a Quote Now!"
          onPress={handleSubmit}
          buttonStyle={styles.button}
          disabled={loading}
          icon={<Icon name="check-circle" type="font-awesome" color="white" style={{ marginRight: 10 }} />}
        />
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
      </Card>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  card: {
    borderRadius: 15,
    padding: 25,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 0,
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
});

export default BookABusScreen;