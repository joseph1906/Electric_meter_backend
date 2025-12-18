import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Button, StyleSheet, Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ElectricMeterForm() {
  const [read, setRead] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  console.log({ read, start, end, startDate, endDate });

  const handleSubmit = () => {
    console.log({ read, start, end, startDate, endDate });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Electric Meter Entry</Text>
      <TextInput style={styles.input} value={read} placeholder="Read" editable={false} />

      <TextInput
        style={styles.input}
        placeholder="Start (kwh)"
        value={start}
        onChangeText={text => setStart(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="End (kwh)"
        value={end}
        onChangeText={text => setEnd(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={text => setStartDate(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={text => setEndDate(text)}
      />

      <Button title="Submit" onPress={handleSubmit} />
      <TouchableOpacity onPress={() => router.push('/Profile')}>
        <Text>Profile</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  image: { width: 50, height: 50, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
});
