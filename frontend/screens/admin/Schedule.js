import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Animated,ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import { Card, Provider as PaperProvider, Divider, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchSchedules();
    fetchTrips();
    fetchDrivers();
    fetchBookings();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/schedule/GetAllSchedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
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

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/drivers/GetAllDrivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
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

  const getDriverName = (driverID) => {
    const driver = drivers.find((d) => d.userID === driverID);
    return driver ? driver.fullName : 'Unknown Driver';
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

  return (
    <PaperProvider>
      <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.linearGradient}>
        <ScrollView style={styles.container}>
          <Calendar  style={styles.calendar}
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

          {loading ? (
            <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
          ) : (
            <Animated.View style={[styles.scheduleContainer, { opacity: fadeAnim }]}>
              {selectedDate && getSchedulesForSelectedDate().length > 0 ? (
                getSchedulesForSelectedDate().map((schedule) => (
                  <Card key={schedule._id} style={styles.card}>
                    <Card.Title
                      left={(props) => <AntDesign {...props} name="car" size={24} color="#FF6347" />}
                      subtitle={`Driver: ${getDriverName(schedule.driverID)}`}
                    />
                    <Card.Content>
                      <Divider style={styles.divider} />
                      <Text style={styles.cardText}>Booking Details:</Text>
                      <Text style={styles.cardText}>{getBookingDetails(schedule.tripID)}</Text>
                      <Text style={styles.cardText}>Status: {schedule.status}</Text>
                    </Card.Content>
                  </Card>
                ))
              ) : (
                <Text style={styles.noScheduleText}>No schedule available for this day.</Text>
              )}
            </Animated.View>
          )}
        </ScrollView >
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
});

export default ScheduleScreen;
