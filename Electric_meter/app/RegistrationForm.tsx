import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';
import colors from '@/assets/styling/colors';

export default function RegistrationForm() {


  const Data = [
        {id: 1, iconLeft: require("../assets/styling/history.png"), label: "Order History", next: require("../assets/styling/arrow.png")},
      ]

  const [form, setForm] = useState({
    Firstname: '',
    Lastname: '',
    NationalId: '',
    Telephone: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    District: '',
    MeterNumber: '',
    PhaseType: '',
    InstallationDate: '',
    PaymentMode: '',
    Declaration: false,
  });

  const handleChange = (name: string, value: any) => {
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.Firstname || !form.Lastname || !form.Email || !form.Password) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }
    if (form.Password !== form.ConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!form.Declaration) {
      Alert.alert('Error', 'You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      axios.post('http://localhost:3000/ReactTask', form)
      .then(res => console.log("Registered successfully"))
      .catch(err => console.log(err))
      router.push('/DrawerIndex'); 
    } else {
  Alert.alert('Error', 'Form validation failed');
}
  };

  return (
    <ScrollView style={styles.MainContainer}>
      <View style={styles.container}>
                      <TouchableOpacity onPress={() => {
                        router.push("/LoginForm")
                      }}>
                           <Image source={require("../assets/images/left-arrow.png")} 
                      style={styles.Imgcontainer}/>

                      </TouchableOpacity>
           <Text style={styles.title}>Customer Registration</Text>
      </View>
      <TextInput
        placeholder="First Name"
        style={styles.input}
        value={form.Firstname}
        onChangeText={(text) => handleChange('Firstname', text)}
      />

      <TextInput
        placeholder="Last Name"
        style={styles.input}
        value={form.Lastname}
        onChangeText={(text) => handleChange('Lastname', text)}
      />
     
      <TextInput
        placeholder="National ID / Passport Number"
        style={styles.input}
        value={form.NationalId}
        onChangeText={(text) => handleChange('NationalId', text)}
      />

      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={form.Telephone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleChange('Telephone', text)}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={form.Email}
        keyboardType="email-address"
        onChangeText={(text) => handleChange('Email', text)}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={form.Password}
        onChangeText={(text) => handleChange('Password', text)}
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={form.ConfirmPassword}
        onChangeText={(text) => handleChange('ConfirmPassword', text)}
      />

      
      <TextInput
        placeholder="Meter Number"
        style={styles.input}
        value={form.MeterNumber}
        onChangeText={(text) => handleChange('MeterNumber', text)}
      />
<Picker
  selectedValue={form.District}
  placeholder='Select District'
  onValueChange={(itemValue) => handleChange('District', itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Select District" value=""/>
  <Picker.Item label="Abim" value="Abim" />
  <Picker.Item label="Adjumani" value="Adjumani" />
  <Picker.Item label="Agago" value="Agago" />
  <Picker.Item label="Alebtong" value="Alebtong" />
  <Picker.Item label="Amolatar" value="Amolatar" />
  <Picker.Item label="Amudat" value="Amudat" />
  <Picker.Item label="Amuria" value="Amuria" />
  <Picker.Item label="Amuru" value="Amuru" />
  <Picker.Item label="Apac" value="Apac" />
  <Picker.Item label="Arua" value="Arua" />
  <Picker.Item label="Budaka" value="Budaka" />
  <Picker.Item label="Bududa" value="Bududa" />
  <Picker.Item label="Bugiri" value="Bugiri" />
  <Picker.Item label="Bugweri" value="Bugweri" />
  <Picker.Item label="Buhweju" value="Buhweju" />
  <Picker.Item label="Buikwe" value="Buikwe" />
  <Picker.Item label="Bukedea" value="Bukedea" />
  <Picker.Item label="Bukomansimbi" value="Bukomansimbi" />
  <Picker.Item label="Bukwo" value="Bukwo" />
  <Picker.Item label="Bulambuli" value="Bulambuli" />
  <Picker.Item label="Buliisa" value="Buliisa" />
  <Picker.Item label="Bundibugyo" value="Bundibugyo" />
  <Picker.Item label="Bunyangabu" value="Bunyangabu" />
  <Picker.Item label="Bushenyi" value="Bushenyi" />
  <Picker.Item label="Busia" value="Busia" />
  <Picker.Item label="Butaleja" value="Butaleja" />
  <Picker.Item label="Butambala" value="Butambala" />
  <Picker.Item label="Butebo" value="Butebo" />
  <Picker.Item label="Buvuma" value="Buvuma" />
  <Picker.Item label="Buyende" value="Buyende" />
  <Picker.Item label="Dokolo" value="Dokolo" />
  <Picker.Item label="Gomba" value="Gomba" />
  <Picker.Item label="Gulu" value="Gulu" />
  <Picker.Item label="Hoima" value="Hoima" />
  <Picker.Item label="Ibanda" value="Ibanda" />
  <Picker.Item label="Iganga" value="Iganga" />
  <Picker.Item label="Isingiro" value="Isingiro" />
  <Picker.Item label="Jinja" value="Jinja" />
  <Picker.Item label="Kaabong" value="Kaabong" />
  <Picker.Item label="Kabale" value="Kabale" />
  <Picker.Item label="Kabarole" value="Kabarole" />
  <Picker.Item label="Kaberamaido" value="Kaberamaido" />
  <Picker.Item label="Kagadi" value="Kagadi" />
  <Picker.Item label="Kakumiro" value="Kakumiro" />
  <Picker.Item label="Kalangala" value="Kalangala" />
  <Picker.Item label="Kaliro" value="Kaliro" />
  <Picker.Item label="Kalungu" value="Kalungu" />
  <Picker.Item label="Kampala" value="Kampala" />
  <Picker.Item label="Kamuli" value="Kamuli" />
  <Picker.Item label="Kamwenge" value="Kamwenge" />
  <Picker.Item label="Kanungu" value="Kanungu" />
  <Picker.Item label="Kapchorwa" value="Kapchorwa" />
  <Picker.Item label="Kapelebyong" value="Kapelebyong" />
  <Picker.Item label="Kasanda" value="Kasanda" />
  <Picker.Item label="Kasese" value="Kasese" />
  <Picker.Item label="Katakwi" value="Katakwi" />
  <Picker.Item label="Kayunga" value="Kayunga" />
  <Picker.Item label="Kibaale" value="Kibaale" />
  <Picker.Item label="Kiboga" value="Kiboga" />
  <Picker.Item label="Kibuku" value="Kibuku" />
  <Picker.Item label="Kikuube" value="Kikuube" />
  <Picker.Item label="Kiruhura" value="Kiruhura" />
  <Picker.Item label="Kiryandongo" value="Kiryandongo" />
  <Picker.Item label="Kisoro" value="Kisoro" />
  <Picker.Item label="Kitagwenda" value="Kitagwenda" />
  <Picker.Item label="Kitgum" value="Kitgum" />
  <Picker.Item label="Koboko" value="Koboko" />
  <Picker.Item label="Kole" value="Kole" />
  <Picker.Item label="Kotido" value="Kotido" />
  <Picker.Item label="Kumi" value="Kumi" />
  <Picker.Item label="Kwania" value="Kwania" />
  <Picker.Item label="Kween" value="Kween" />
  <Picker.Item label="Kyankwanzi" value="Kyankwanzi" />
  <Picker.Item label="Kyegegwa" value="Kyegegwa" />
  <Picker.Item label="Kyenjojo" value="Kyenjojo" />
  <Picker.Item label="Kyotera" value="Kyotera" />
  <Picker.Item label="Lamwo" value="Lamwo" />
  <Picker.Item label="Lira" value="Lira" />
  <Picker.Item label="Luuka" value="Luuka" />
  <Picker.Item label="Luwero" value="Luwero" />
  <Picker.Item label="Lwengo" value="Lwengo" />
  <Picker.Item label="Lyantonde" value="Lyantonde" />
  <Picker.Item label="Madi-Okollo" value="Madi-Okollo" />
  <Picker.Item label="Manafwa" value="Manafwa" />
  <Picker.Item label="Maracha" value="Maracha" />
  <Picker.Item label="Masaka" value="Masaka" />
  <Picker.Item label="Masindi" value="Masindi" />
  <Picker.Item label="Mayuge" value="Mayuge" />
  <Picker.Item label="Mbale" value="Mbale" />
  <Picker.Item label="Mbarara" value="Mbarara" />
  <Picker.Item label="Mitooma" value="Mitooma" />
  <Picker.Item label="Mityana" value="Mityana" />
  <Picker.Item label="Moroto" value="Moroto" />
  <Picker.Item label="Moyo" value="Moyo" />
  <Picker.Item label="Mpigi" value="Mpigi" />
  <Picker.Item label="Mubende" value="Mubende" />
  <Picker.Item label="Mukono" value="Mukono" />
  <Picker.Item label="Nabilatuk" value="Nabilatuk" />
  <Picker.Item label="Nakapiripirit" value="Nakapiripirit" />
  <Picker.Item label="Nakaseke" value="Nakaseke" />
  <Picker.Item label="Nakasongola" value="Nakasongola" />
  <Picker.Item label="Namayingo" value="Namayingo" />
  <Picker.Item label="Namisindwa" value="Namisindwa" />
  <Picker.Item label="Namutumba" value="Namutumba" />
  <Picker.Item label="Napak" value="Napak" />
  <Picker.Item label="Nebbi" value="Nebbi" />
  <Picker.Item label="Ngora" value="Ngora" />
  <Picker.Item label="Ntoroko" value="Ntoroko" />
  <Picker.Item label="Ntungamo" value="Ntungamo" />
  <Picker.Item label="Nwoya" value="Nwoya" />
  <Picker.Item label="Obongi" value="Obongi" />
  <Picker.Item label="Omoro" value="Omoro" />
  <Picker.Item label="Otuke" value="Otuke" />
  <Picker.Item label="Oyam" value="Oyam" />
  <Picker.Item label="Pader" value="Pader" />
  <Picker.Item label="Pakwach" value="Pakwach" />
  <Picker.Item label="Pallisa" value="Pallisa" />
  <Picker.Item label="Rakai" value="Rakai" />
  <Picker.Item label="Rubanda" value="Rubanda" />
  <Picker.Item label="Rubirizi" value="Rubirizi" />
  <Picker.Item label="Rukiga" value="Rukiga" />
  <Picker.Item label="Rukungiri" value="Rukungiri" />
  <Picker.Item label="Sembabule" value="Sembabule" />
  <Picker.Item label="Serere" value="Serere" />
  <Picker.Item label="Sheema" value="Sheema" />
  <Picker.Item label="Sironko" value="Sironko" />
  <Picker.Item label="Soroti" value="Soroti" />
  <Picker.Item label="Tororo" value="Tororo" />
  <Picker.Item label="Wakiso" value="Wakiso" />
  <Picker.Item label="Yumbe" value="Yumbe" />
  <Picker.Item label="Zombo" value="Zombo" />
</Picker>


      <Picker
        selectedValue={form.PhaseType}
        onValueChange={(itemValue) => handleChange('PhaseType', itemValue)}
        style={styles.picker} 
      >
        <Picker.Item label="Select Phase Type" value="default"/>
        <Picker.Item label="Single Phase" value="Single Phase"/>
        <Picker.Item label="Three Phase" value="Three Phase"/>
      </Picker>


      <View style={styles.checkboxContainer}>
        <Switch
          value={form.Declaration}
          onValueChange={(value) => handleChange('Declaration', value)}
        />
        <Text style={styles.label}>I agree to the terms and conditions</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  MainContainer: { 
    padding: 40,
    backgroundColor: '#1B1A31', 
    },

    container: {
      alignContent:"center",
      justifyContent:"center",
    },

  title: { 
    textAlign:"center",
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: "#d9d9d9",
    marginTop: 10,
    fontStyle: "italic",
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#ccc',
    backgroundColor: "#fff", 
    padding: 10, 
    marginBottom: 10,
    color: "#000", 
    borderRadius: 5,
    fontSize: 15,
    fontStyle:"normal"
  },  

  picker: {
    borderWidth: 1, 
    borderColor: '#CCC', 
    backgroundColor: "#fff",
    width: "100%",
    height: "5%",
    marginBottom: 10,
    borderRadius: 5,
    color: "#000",
    fontSize: 15,
  },
  
  label: { 
    fontSize: 15,
    marginVertical: 5, 
    marginBottom: 10,
    marginLeft: 10,
    color: "#d9d9d9"
  },


  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 20, 
    color: "#d9d9d9"
  },
  
  submitBtn: { 
    backgroundColor: '#484763',
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center'
   },

  submitText: {
     color: '#fff', 
     fontWeight: 'bold',
     fontSize: 20,
    },
      Imgcontainer: {
        width: moderateScale(14),
        height: verticalScale(18),
    },
});
