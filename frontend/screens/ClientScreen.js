import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TextInput, Modal, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { AuthContext } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ClientScreen = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('https://israeltransport.onrender.com/api/trips/GetAllTrips');
        setTrips(response.data.sort((a, b) => a.TripType.localeCompare(b.TripType)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleExpand = (item) => {
    setExpandedTrip(item);
  };

  const handleCollapse = () => {
    setExpandedTrip(null);
  };

  const handleBookBus = (tripID) => {
    if (user) {
      navigation.navigate('Book A Bus', { tripId: tripID });
    } else {
      alert('Please log in to book a bus!');
      navigation.navigate('WelcomeScreen');
    }
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => handleExpand(item)}>
      <Card style={styles.tripCard}>
        {item.ImageURL ? (
          <Card.Cover source={{ uri: item.ImageURL }} style={styles.image} />
        ) : (
          <Card.Cover source={require('../assets/images/trip1.jpg')} style={styles.image} />
        )}
        <Card.Content>
          <Title style={styles.title}>{item.TripName}</Title>
          <Paragraph style={styles.description}>{item.Description}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const filteredTrips = trips.filter((trip) =>
    trip.TripName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTrips = filteredTrips.reduce((acc, trip) => {
    const { TripType } = trip;
    if (!acc[TripType]) {
      acc[TripType] = [];
    }
    acc[TripType].push(trip);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80' }} style={styles.backgroundImage}>
          <Text style={styles.headerTitle}>Israel Transport</Text>
          <Text style={styles.headerSubtitle}>Explore the world with us</Text>
          <View style={styles.searchContainerOverlay}>
            <Ionicons name="search" size={20} color="#6c757d" />
            <TextInput
              style={styles.searchInput}
              placeholder="Choose your destination"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </ImageBackground>
      </View>

      {Object.keys(groupedTrips).map((tripType) => (
        <View key={tripType} style={[styles.sectionContainer, styles.sectionContainerWithRadius]}>
          <Text style={styles.sectionTitle}>{tripType}</Text>
          <FlatList
            data={groupedTrips[tripType]}
            renderItem={renderTrip}
            keyExtractor={(item) => (item.TripID ? item.TripID.toString() : Math.random().toString())}
            contentContainerStyle={styles.list}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ))}

      {expandedTrip && (
        <Modal visible={true} transparent={true} animationType="slide">
          <BlurView intensity={250} style={styles.absolute}>
            <View style={styles.modalContainer}>
              <Card style={styles.expandedCard}>
                {expandedTrip.ImageURL ? (
                  <Card.Cover source={{ uri: expandedTrip.ImageURL }} style={styles.expandedImage} />
                ) : (
                  <Card.Cover source={require('../assets/images/trip1.jpg')} style={styles.expandedImage} />
                )}
                <Card.Content>
                  <Title style={styles.expandedTitle}>{expandedTrip.TripName}</Title>
                  <Paragraph style={styles.expandedDescription}>{expandedTrip.Description}</Paragraph>
                  <Paragraph style={styles.expandedDetails}>Route: {expandedTrip.TripType}</Paragraph>
                  <Title style={styles.hoursTitle}>Hours</Title>
                  {expandedTrip.OpenHour.map((openHour, index) => (
                    <Paragraph key={index} style={styles.hoursText}>
                      {`${daysOfWeek[index]}: ${openHour || 'Closed'} - ${
                        expandedTrip.CloseHour[index] || 'Closed'
                      }`}
                    </Paragraph>
                  ))}
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={handleCollapse} style={styles.collapseButton}>
                    See Less
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </BlurView>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 110,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingBottom: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'serif',
  },
  searchContainerOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 20,
    width: '90%',
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginRight: 15,
  },
  tripCard: {
    borderRadius: 15,
    width: width * 0.7,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  image: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 150,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#343a40',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionContainerWithRadius: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedCard: {
    width: width * 0.9,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#ffffff',
  },
  expandedImage: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  expandedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#343a40',
  },
  expandedDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  expandedDetails: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 8,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  hoursText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#6c757d',
  },
  collapseButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    color: '#fff',
  },
});

export default ClientScreen;
