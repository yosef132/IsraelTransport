import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Animated, Alert, Modal } from 'react-native';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Card, Provider as PaperProvider, Divider, Button, TextInput } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

const DriverScreen = () => {
  const { user, logout } = useContext(AuthContext); // Added logout function
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [kmValue, setKmValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false); // State to manage the loading indicator
  const fadeAnim = useState(new Animated.Value(0))[0];

  // DropDownPicker State
  const [open, setOpen] = useState(false);
  const [vehicleItems, setVehicleItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSchedules(user.userID);
      fetchTrips();
      fetchBookings();
      fetchVehicles();
    }
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);

  const fetchSchedules = async (userID) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://israeltransport.onrender.com/api/schedule/GetScheduleByDriverID/${userID}`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      Alert.alert('Error', 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/trips/GetAllTrips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/vehicles/GetAllVehicles');
      setVehicles(response.data);
      // Prepare vehicle items for dropdown
      setVehicleItems(
        response.data.map((vehicle) => ({
          label: `${vehicle.Make} ${vehicle.Model} (${vehicle.Year}) - ${vehicle.carPlateNumber}`,
          value: vehicle.VehicleID,
        }))
      );
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getSchedulesForSelectedDate = () => {
    return schedules.filter((schedule) => schedule.assignedDate.startsWith(selectedDate));
  };

  const getTripDetails = (tripID) => {
    const trip = trips.find((t) => t.TripID === tripID);
    return trip ? trip.TripName : 'Unknown Trip';
  };

  const getBookingDetails = (tripID) => {
    const booking = bookings.find((b) => b.BookingID === tripID);
    return booking
      ? `Booking by ${booking.FullName}, 
Pickup Address: ${booking.PickupAddress},
Dropoff Address: ${booking.DropOffAddress}
Email: ${booking.Email}
Phone: ${booking.PhoneNumber}
Passengers: ${booking.Passengers}
Notes: ${booking.notes}
Start Trail Date: ${new Date(booking.startTrailDate).toLocaleString()}
End Trail Date: ${new Date(booking.endTrailDate).toLocaleString()}`
      : 'Unknown Booking';
  };

  const handleUpdateKm = () => {
    setModalVisible(true);
  };

  const updateVehicleKm = async () => {
    if (!selectedVehicle || !kmValue) {
      Alert.alert('Error', 'Please select a vehicle and enter the kilometers driven.');
      return;
    }

    setUpdating(true); // Start loading animation
    try {
      await axios.put(`https://israeltransport.onrender.com/api/vehicles/UpdateVehicleKm/${selectedVehicle}`, {
        Km: kmValue,
      });
      Alert.alert('Success', 'Vehicle kilometers updated successfully.');
      setModalVisible(false);
      setKmValue('');
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle km:', error);
      Alert.alert('Error', 'Failed to update vehicle kilometers.');
    } finally {
      setUpdating(false); // End loading animation
    }
  };

  return (
    <PaperProvider>
      <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.linearGradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.calendarContainer}>
            <Calendar
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
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          ) : (
            <Animated.View style={[styles.scheduleContainer, { opacity: fadeAnim }]}>
              {selectedDate && getSchedulesForSelectedDate().length > 0 ? (
                getSchedulesForSelectedDate().map((schedule) => (
                  <Card key={schedule._id} style={styles.card}>
                    <Card.Title 
                      title={`Trip`} 
                      left={(props) => <AntDesign {...props} name="car" size={24} color="#FF6347" />}
                    />
                    <Card.Content>
                      <Divider style={styles.divider} />
                      <Text style={styles.cardText}>Booking Details: {getBookingDetails(schedule.tripID)}</Text>
                      <Text style={styles.cardText}>Status: {schedule.status}</Text>
                    </Card.Content>
                    <Card.Actions>
                      <Button
                        mode="contained"
                        color="#FF6347"
                        icon="car"
                        onPress={handleUpdateKm}
                      >
                        Update Km
                      </Button>
                    </Card.Actions>
                  </Card>
                ))
              ) : (
                <Text style={styles.noScheduleText}>No schedule available for this day.</Text>
              )}
            </Animated.View>
          )}

          {/* Update KM Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Vehicle Km</Text>
                <Divider style={styles.divider} />

                {/* DropDown Picker for Vehicle Selection */}
                <DropDownPicker
                  open={open}
                  value={selectedVehicle}
                  items={vehicleItems}
                  setOpen={setOpen}
                  setValue={setSelectedVehicle}
                  setItems={setVehicleItems}
                  placeholder="Select a Vehicle"
                  style={styles.dropdown}
                  containerStyle={{ marginBottom: 15 }}
                />

                <TextInput
                  label="Kilometers Driven"
                  mode="outlined"
                  value={kmValue}
                  onChangeText={setKmValue}
                  keyboardType="numeric"
                  style={styles.input}
                />
                
                {updating ? (
                  <ActivityIndicator size="large" color="#FF6347" />
                ) : (
                  <Button
                    mode="contained"
                    onPress={updateVehicleKm}
                    style={styles.button}
                    color="#FF6347"
                  >
                    Update Km
                  </Button>
                )}

                <Button onPress={() => setModalVisible(false)} style={styles.button} color="#555">
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>

          {/* Logout Button */}
          <Button 
            mode="contained" 
            onPress={logout} 
            color="#FF6347" 
            style={styles.logoutButton}
            icon="logout"
          >
            Log Out
          </Button>
        </ScrollView>
      </LinearGradient>
    </PaperProvider>
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
  calendarContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 15,
    elevation: 3,
  },
  loader: {
    marginTop: 20,
  },
  scheduleContainer: {
    marginTop: 20,
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
    padding: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  divider: {
    marginVertical: 8,
  },
  noScheduleText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dropdown: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignSelf: 'center',
  },
});

export default DriverScreen;
