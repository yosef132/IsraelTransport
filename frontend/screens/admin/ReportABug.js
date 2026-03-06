import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-elements';
import axios from 'axios';

const ReportABugScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://israeltransport.onrender.com/api/reports/');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (reportID) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [ 
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`https://israeltransport.onrender.com/api/reports/delete/${reportID}`);
              setReports(reports.filter(report => report.ReportID !== reportID));
              Alert.alert('Success', 'Report deleted successfully');
            } catch (error) {
              console.error('Error deleting report:', error);
              Alert.alert('Error', 'Failed to delete report');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderReport = ({ item }) => (
    <Card containerStyle={styles.card}>
      <Card.Title>Report ID: {item.ReportID}</Card.Title>
      <Card.Divider />
      <Text style={styles.message}>Message: {item.Message}</Text>
      <Text style={styles.status}>Status: {item.Status}</Text>
      <Text style={styles.timestamp}>Date: {new Date(item.Timestamp).toLocaleDateString()}</Text>
      <Button
        title="Delete Report"
        buttonStyle={styles.deleteButton}
        onPress={() => deleteReport(item.ReportID)}
      />
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.ReportID.toString()}
        renderItem={renderReport}
        ListEmptyComponent={() => <Text style={styles.noReportsText}>No reports available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    fontSize: 16,
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
  },
  noReportsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default ReportABugScreen;
