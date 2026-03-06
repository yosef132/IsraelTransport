import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Button, Modal, Portal, Provider as PaperProvider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from 'expo-linear-gradient';

const WorkScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchDrivers();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/bookings');
      setBookings(response.data.filter((booking) => booking.status === 'Confirmed'));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/drivers/GetAllDrivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const handleCreateSchedule = async () => {
    if (!selectedDate || !selectedBooking || !selectedDriver) {
      Alert.alert('Validation Error', 'Please select a booking, a driver, and a date.');
      return;
    }

    setLoading(true);

    try {
      const scheduleData = {
        assignedDate: `${selectedDate}T09:00:00Z`,
        tripID: selectedBooking,
        driverID: selectedDriver,
      };

      const response = await axios.post('https://israeltransport.onrender.com/api/schedule/CreateSchedule', scheduleData);

      if (response.status === 201) {
        Alert.alert('Success', 'Schedule created successfully');
        setModalVisible(false);
        setSelectedBooking(null);
        setSelectedDriver(null);
      } else {
        Alert.alert('Error', 'Failed to create schedule');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      Alert.alert('Error', 'Failed to create schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider>
      <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.linearGradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <Calendar style={styles.calendar}
            onDayPress={handleDayPress}
            markedDates={{
              [selectedDate]: { selected: true, marked: true, selectedColor: '#FF6347' },
            }}
            theme={{
              arrowColor: '#FF6347',
              todayTextColor: '#FF6347',
              selectedDayBackgroundColor: '#FF6347',
              selectedDayTextColor: '#ffffff',
              monthTextColor: '#FF6347',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: 'bold',
            }}
          />

          <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
              <Text style={styles.modalTitle}>Create Schedule</Text>

              <RNPickerSelect
                onValueChange={(value) => setSelectedBooking(value)}
                items={bookings.map((booking) => ({ label: booking.FullName, value: booking.BookingID }))}
                placeholder={{ label: 'Select a Booking', value: null }}
                style={pickerSelectStyles}
                value={selectedBooking}
              />

              <RNPickerSelect
                onValueChange={(value) => setSelectedDriver(value)}
                items={drivers.map((driver) => ({ label: driver.fullName, value: driver.userID }))}
                placeholder={{ label: 'Select a Driver', value: null }}
                style={pickerSelectStyles}
                value={selectedDriver}
              />

              <Button mode="contained" onPress={handleCreateSchedule} disabled={loading} style={styles.button}>
                {loading ? <ActivityIndicator color="#fff" /> : 'Create Schedule'}
              </Button>
            </Modal>
          </Portal>
        </ScrollView>
      </LinearGradient>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  calendar: {
    borderRadius: 9,
  },
  linearGradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF6347',
    paddingVertical: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginBottom: 16,
  },
});

export default WorkScheduleScreen;
