import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.0.178:8080/api/dietplans'; // replace with your IP

export default function App() {
  const [dietPlans, setDietPlans] = useState([]);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = () => {
    axios
      .get(API_BASE_URL)
      .then((res) => setDietPlans(res.data))
      .catch((err) => console.error('GET error:', err))
      .finally(() => setLoading(false));
  };

  const submitDietPlan = () => {
    if (!mealName.trim() || !calories.trim()) {
      Alert.alert('Please enter both a meal name and calories');
      return;
    }

    const newPlan = {
      userId: 'demoUser',
      mealName: mealName.trim(),
      calories: parseInt(calories),
    };

    axios
      .post(API_BASE_URL, newPlan)
      .then(() => {
        setMealName('');
        setCalories('');
        fetchDietPlans();
      })
      .catch((err) => {
        console.error('POST error:', err);
        Alert.alert('Error adding meal');
      });
  };

  const deleteDietPlan = (id) => {
    axios
      .delete(`${API_BASE_URL}/${id}`)
      .then(() => fetchDietPlans())
      .catch((err) => {
        console.error('DELETE error:', err);
        Alert.alert('Error deleting meal');
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.mealItem}>
      <Text style={styles.mealText}>
        {item.mealName} — {item.calories} cal
      </Text>
      <TouchableOpacity onPress={() => deleteDietPlan(item.id || item._id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🍽️ My Meals Today</Text>

      {/* Add Meal Section */}
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={mealName}
          onChangeText={setMealName}
        />
        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
        />
        <Button title="Add Meal" onPress={submitDietPlan} color="#007bff" />
      </View>

      {/* Meal List Section */}
      <Text style={styles.subHeader}>📋 All Meals</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : dietPlans.length === 0 ? (
        <Text style={styles.text}>No meals added yet.</Text>
      ) : (
        <FlatList
          data={dietPlans}
          keyExtractor={(item, index) => item.id || item._id || index.toString()}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 20,
    marginVertical: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 6,
    padding: 10,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  mealText: {
    fontSize: 18,
  },
  deleteButton: {
    fontSize: 16,
    color: 'red',
  },
  text: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});
