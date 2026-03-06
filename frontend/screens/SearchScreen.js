import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Card, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!query) {
      alert('Please enter a trip category or name to search.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`https://israeltransport.onrender.com/api/trips/GetTripByType/${query}`);
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Error fetching trips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }) => (
    <Card containerStyle={styles.tripCard}>
      {item.ImageURL ? (
        <Card.Image source={{ uri: item.ImageURL }} style={styles.image} />
      ) : (
        <Card.Image source={require('../assets/images/trip1.jpg')} style={styles.image} />
      )}
      <Card.Title style={styles.title}>{item.TripName}</Card.Title>
      <Text style={styles.description}>{item.Description}</Text>
      <Text style={styles.details}>Type: {item.TripType}</Text>
      <Button
        title="Book a Bus"
        buttonStyle={styles.bookButton}
        onPress={() => navigation.navigate('Book A Bus', { tripId: item.TripID })}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search by trip category or name"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTrip}
          keyExtractor={(item) => item.TripID.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => !loading && <Text style={styles.noResultsText}>No trips found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tripCard: {
    borderRadius: 15,
    padding: 0,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});

export default SearchScreen;
