import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, ScrollView, Animated } from 'react-native';
import { Text, Button } from 'react-native-elements';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Divider, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const BookingRequestsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentBooking, setCurrentBooking] = useState({});
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateField, setDateField] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [bookings]);

  const fetchBookings = async () => {
    try {
await new Promise(resolve => setTimeout(resolve, 500));
const response = await axios.get('https://israeltransport.onrender.com/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`https://israeltransport.onrender.com/api/bookings/delete/${bookingID}`);
              setBookings(prevBookings => prevBookings.filter(booking => booking.BookingID !== bookingID));
            } catch (error) {
              console.error('Error deleting booking:', error);
              Alert.alert('Error', 'Failed to delete booking');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdate = (booking, type) => {
    setCurrentBooking(booking);
    setModalType(type);
    setModalVisible(true);
  };


  const updateBooking = async () => {
    setLoading(true);
    try {
      await axios.put(`https://israeltransport.onrender.com/api/bookings/update/${currentBooking.BookingID}`, currentBooking);
      setModalVisible(false);
    setLoading(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  const showDatePicker = (field) => {
    setDateField(field);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateChange = (date) => {
    setCurrentBooking({ ...currentBooking, [dateField]: date.toISOString() });
    hideDatePicker();
  };

  const renderBooking = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={styles.card}>
        <Card.Title 
          title={item.FullName}
          subtitle={`Phone : ${item.PhoneNumber}`}
          left={(props) => <AntDesign {...props} name="solution1" size={24} color="#FF6347" />}
        />
      <Card.Content>
          <Divider style={styles.divider} />
          <Text style={styles.cardText}>Email: {item.Email}</Text>
          <Text style={styles.cardText}>Status: {item.status}</Text>
          <Text style={styles.cardText}>Start Trail Date: {new Date(item.startTrailDate).toLocaleString()}</Text>
          <Text style={styles.cardText}>End Trail Date: {new Date(item.endTrailDate).toLocaleString()}</Text>
          <Text style={styles.cardText}>Pickup Address: {item.PickupAddress}</Text>
          <Text style={styles.cardText}>Dropoff Address: {item.DropOffAddress}</Text>
          <Text style={styles.cardText}>Passengers: {item.Passengers}</Text>
          <Text style={styles.cardText}>stopStations: {item.stopStations}</Text>
          <Text style={styles.cardText}>Notes: {item.notes}</Text>
        </Card.Content>
        <Card.Actions style={styles.buttonContainerVertical}>
          <Button title="Update Status" onPress={() => handleUpdate(item, 'status')} buttonStyle={styles.button} containerStyle={styles.buttonSpacing} />
          <Button title="Update Dates" onPress={() => handleUpdate(item, 'dates')} buttonStyle={styles.button} containerStyle={styles.buttonSpacing} />
          <Button title="Update Info" onPress={() => handleUpdate(item, 'info')} buttonStyle={styles.button} containerStyle={styles.buttonSpacing} />
          <Button title="DELETE" onPress={() => handleDelete(item.BookingID)} buttonStyle={[styles.button, styles.deleteButton]} containerStyle={styles.buttonSpacing} />
        </Card.Actions>
      </Card>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  const renderModalContent = () => {
    switch (modalType) {
      case 'status':
        return (
          <>
            <Text style={styles.modalTitle}>Update Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currentBooking.status}
                style={styles.picker}
                onValueChange={(itemValue) => setCurrentBooking({ ...currentBooking, status: itemValue })}
              >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Confirmed" value="Confirmed" />
                <Picker.Item label="Cancelled" value="Cancelled" />
              </Picker>
            </View>
          </>
        );
      case 'dates':
        return (
          <>
            <Text style={styles.modalTitle}>Update Dates</Text>
            <TouchableOpacity onPress={() => showDatePicker('startTrailDate')}>
              <Text style={styles.datePickerText}>Start Trail Date: {new Date(currentBooking.startTrailDate).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showDatePicker('endTrailDate')}>
              <Text style={styles.datePickerText}>End Trail Date: {new Date(currentBooking.endTrailDate).toLocaleString()}</Text>
            </TouchableOpacity>
          </>
        );
      case 'info':
        return (
          <>
            <Text style={styles.modalTitle}>Update Info</Text>
            <TextInput
              label="Full Name"
              value={currentBooking.FullName}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, FullName: text })}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={currentBooking.Email}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, Email: text })}
              style={styles.input}
            />
            <TextInput
              label="Phone Number"
              value={currentBooking.PhoneNumber}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, PhoneNumber: text })}
              style={styles.input}
            />
            <TextInput
              label="Pickup Address"
              value={currentBooking.PickupAddress}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, PickupAddress: text })}
              style={styles.input}
            />
            <TextInput
              label="Dropoff Address"
              value={currentBooking.DropOffAddress}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, DropOffAddress: text })}
              style={styles.input}
            />
            <TextInput
              label="Passengers"
              value={String(currentBooking.Passengers)}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, Passengers: Number(text) })}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              label="Notes"
              value={currentBooking.notes}
              onChangeText={(text) => setCurrentBooking({ ...currentBooking, notes: text })}
              style={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#6dd5ed', '#2193b0']} style={styles.linearGradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.BookingID.toString()}
        />

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalScrollViewContent}>
            <View style={styles.modalContent}>
              {renderModalContent()}
              <Button title="Update" onPress={updateBooking} buttonStyle={styles.button} containerStyle={styles.buttonSpacing} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} buttonStyle={[styles.button, styles.cancelButton]} containerStyle={styles.buttonSpacing} />
            </View>
          </ScrollView>
        </Modal>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleDateChange}
          onCancel={hideDatePicker}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainerVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#FF6347',
  },
  buttonSpacing: {
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  modalScrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
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
  input: {
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  cancelButton: {
    backgroundColor: '#555',
  },
});

export default BookingRequestsScreen;
