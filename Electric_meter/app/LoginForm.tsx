import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function LoginForm() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/Registration')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err=> console.log(err));
  }, []);
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }
    router.push('/DrawerIndex'); 
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => router.push('/RegistrationForm')}>
        <Text style={styles.Text}>Don't have an account? Register now</Text>
      </TouchableOpacity>      

      <TouchableOpacity onPress={handleSubmit}
        style={styles.button}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#D9D9D9",
    justifyContent: "center"
   },

  title: { 
     fontSize: 30,
     fontWeight: "bold", 
     marginBottom: 20, 
     textAlign: "center",
     color: "#1B1A31" 
    },

    Text: {
      color: "#1B1A31",
      fontSize: 17,
      fontWeight: "bold"
    },

  input: { 
     height: 50,
     marginBottom: 10 , 
     backgroundColor:"#D9D9D9",
     textShadowColor:"#FFF",
    },

  button: { 
    marginTop: 20, 
    backgroundColor: "#1B1A31", 
    padding: 10, 
    borderRadius: 5, 
    alignItems: "center" 
  },

  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff"
  }
});
