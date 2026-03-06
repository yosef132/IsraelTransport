import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator, Portal, Modal, Provider, Appbar, Searchbar,Text} from 'react-native-paper';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const initialFormState = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  language: '',
  country: '',
  city: '',
  userTypeID: '',
  userID: '',
};

const EditUsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users.filter(user => user.fullName.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/users/GetAllUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.username || !form.email || !form.password || !form.language || !form.country || !form.city || !form.userID || !form.userTypeID) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`https://israeltransport.onrender.com/api/users/EditUser/${editingId}`, form);
        Alert.alert('Success', 'User updated successfully');
      } else {
        Alert.alert('Error', 'Invalid user ID');
      }
      setForm(initialFormState);
      setEditingId(null);
      fetchUsers();
      setModalVisible(false);
    } catch (error) {
      console.error('Error submitting user:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to submit user');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (userID) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
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
      await axios.delete(`https://israeltransport.onrender.com/api/users/DeleteUser/${userID}`);
      Alert.alert('Success', 'User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      password: user.password,
      language: user.language,
      country: user.country,
      city: user.city,
      userTypeID: user.userTypeID,
      userID: user.userID,
    });
    setEditingId(user.userID);
    setModalVisible(true);
  };

  const renderUser = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.fullName}</Title>
        <Paragraph>Username: {item.username}</Paragraph>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Language: {item.language}</Paragraph>
        <Paragraph>Country: {item.country}</Paragraph>
        <Paragraph>City: {item.city}</Paragraph>
        <Paragraph>User Type: {item.userTypeID === 1 ? 'Admin' : 'Client'}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => handleEdit(item)}>Edit</Button>
        <Button onPress={() => confirmDelete(item.userID)}>Delete</Button>
      </Card.Actions>
    </Card>
  );

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Action icon="reload" onPress={fetchUsers} />
        <Appbar.Content title="Edit Users" />
      </Appbar.Header>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search by full name"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.userID.toString()}
          renderItem={renderUser}
          ListEmptyComponent={() => <Paragraph style={styles.noUsersText}>No users available</Paragraph>}
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
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>User Type</Text>
                <RNPickerSelect
                  onValueChange={(value) => handleChange('userTypeID', value)}
                  items={[
                    { label: 'Admin', value: 1 },
                    { label: 'Client', value: 2 },
                  ]}
                  value={form.userTypeID}
                  placeholder={{ label: 'Select user type', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              <Button mode="contained" onPress={handleSubmit} disabled={loading} style={styles.button}>
                {editingId ? "Update User" : "Submit"}
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
  searchbar: {
    marginBottom: 16,
  },
  noUsersText: {
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
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

export default EditUsersScreen;
