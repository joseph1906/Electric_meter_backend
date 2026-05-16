import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, ScrollView,
  StyleSheet, Switch, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import axios from 'axios';

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isSubmitting = useRef(false);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const [form, setForm] = useState({
    Firstname: '', Lastname: '', NationalId: '', Telephone: '',
    Email: '', Password: '', ConfirmPassword: '', District: '',
    MeterNumber: '', PhaseType: '', Declaration: false,
  });

  const handleChange = (name: string, value: any) => {
    setErrorMessage('');
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    if (!form.Firstname.trim()) { setErrorMessage('First name is required'); return false; }
    if (!form.Lastname.trim()) { setErrorMessage('Last name is required'); return false; }
    if (!form.Email.trim()) { setErrorMessage('Email is required'); return false; }
    if (!form.Telephone.trim()) { setErrorMessage('Phone number is required'); return false; }
    if (!form.Password) { setErrorMessage('Password is required'); return false; }
    if (form.Password !== form.ConfirmPassword) { setErrorMessage('Passwords do not match'); return false; }
    if (form.Password.length < 6) { setErrorMessage('Password must be at least 6 characters'); return false; }
    if (!form.Declaration) { setErrorMessage('You must agree to the terms and conditions'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.Email)) { setErrorMessage('Please enter a valid email address'); return false; }
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(form.Telephone.replace(/[^0-9]/g, ''))) {
      setErrorMessage('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setErrorMessage('');
    if (!validateForm()) { isSubmitting.current = false; return; }
    setLoading(true);

    const submitData = {
      Firstname: form.Firstname.trim(),
      Lastname: form.Lastname.trim(),
      NationalId: form.NationalId.trim() || null,
      Telephone: form.Telephone.trim(),
      Email: form.Email.trim().toLowerCase(),
      Password: form.Password,
      District: form.District || null,
      MeterNumber: form.MeterNumber.trim() || null,
      PhaseType: form.PhaseType === 'default' ? null : form.PhaseType,
      Declaration: form.Declaration,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, submitData);
      if (response.data.success) {
        setErrorMessage('');
        router.push({ pathname: '/OTPVerification', params: { email: form.Email.trim().toLowerCase() } });
        setForm({
          Firstname: '', Lastname: '', NationalId: '', Telephone: '',
          Email: '', Password: '', ConfirmPassword: '', District: '',
          MeterNumber: '', PhaseType: '', Declaration: false,
        });
      }
    } catch (error: any) {
      let msg = 'An unexpected error occurred';
      if (error.response?.data) msg = error.response.data.message || `Server error (${error.response.status})`;
      else if (error.request) msg = `Cannot connect to server at ${API_BASE_URL}`;
      else msg = error.message || msg;
      setErrorMessage(msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const inputStyle = (hasValue: boolean) => ({
    ...styles.input,
    borderColor: hasValue ? 'rgba(129,176,255,0.4)' : 'rgba(255,255,255,0.12)',
  });

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/LoginForm')} style={styles.backBtn}>
          <Image source={require('../assets/images/left-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Customer registration</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Error */}
      {errorMessage !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
        </View>
      )}

      {/* Personal info */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Personal info</Text>

        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>First name *</Text>
            <TextInput
              style={inputStyle(!!form.Firstname)}
              placeholder="Jean"
              placeholderTextColor="#6b7280"
              value={form.Firstname}
              onChangeText={(t) => handleChange('Firstname', t)}
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>Last name *</Text>
            <TextInput
              style={inputStyle(!!form.Lastname)}
              placeholder="Pierre"
              placeholderTextColor="#6b7280"
              value={form.Lastname}
              onChangeText={(t) => handleChange('Lastname', t)}
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>National ID / Passport</Text>
        <TextInput
          style={inputStyle(!!form.NationalId)}
          placeholder="CM90012345"
          placeholderTextColor="#6b7280"
          value={form.NationalId}
          onChangeText={(t) => handleChange('NationalId', t)}
        />

        <Text style={styles.fieldLabel}>Phone number *</Text>
        <TextInput
          style={inputStyle(!!form.Telephone)}
          placeholder="+256 771 234 567"
          placeholderTextColor="#6b7280"
          keyboardType="phone-pad"
          value={form.Telephone}
          onChangeText={(t) => handleChange('Telephone', t)}
        />

        <Text style={styles.fieldLabel}>Email address *</Text>
        <TextInput
          style={inputStyle(!!form.Email)}
          placeholder="you@example.com"
          placeholderTextColor="#6b7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.Email}
          onChangeText={(t) => handleChange('Email', t)}
        />
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Security</Text>

        <Text style={styles.fieldLabel}>Password * (min 6 characters)</Text>
        <TextInput
          style={inputStyle(!!form.Password)}
          placeholder="••••••••"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={form.Password}
          onChangeText={(t) => handleChange('Password', t)}
        />

        <Text style={styles.fieldLabel}>Confirm password *</Text>
        <TextInput
          style={inputStyle(!!form.ConfirmPassword)}
          placeholder="••••••••"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={form.ConfirmPassword}
          onChangeText={(t) => handleChange('ConfirmPassword', t)}
        />
      </View>

      {/* Meter details */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Meter details</Text>

        <Text style={styles.fieldLabel}>Meter number</Text>
        <TextInput
          style={inputStyle(!!form.MeterNumber)}
          placeholder="MTR-00482910"
          placeholderTextColor="#6b7280"
          value={form.MeterNumber}
          onChangeText={(t) => handleChange('MeterNumber', t)}
        />

        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>District</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={form.District}
                onValueChange={(v) => handleChange('District', v)}
                style={styles.picker}
                dropdownIconColor="#9ca3af"
              >
                <Picker.Item label="Select district" value="" color="#6b7280" />
                <Picker.Item label="Abim" value="Abim" color="#fff" />
                <Picker.Item label="Adjumani" value="Adjumani" color="#fff" />
                <Picker.Item label="Agago" value="Agago" color="#fff" />
                <Picker.Item label="Alebtong" value="Alebtong" color="#fff" />
                <Picker.Item label="Amolatar" value="Amolatar" color="#fff" />
                <Picker.Item label="Amudat" value="Amudat" color="#fff" />
                <Picker.Item label="Amuria" value="Amuria" color="#fff" />
                <Picker.Item label="Amuru" value="Amuru" color="#fff" />
                <Picker.Item label="Apac" value="Apac" color="#fff" />
                <Picker.Item label="Arua" value="Arua" color="#fff" />
                <Picker.Item label="Budaka" value="Budaka" color="#fff" />
                <Picker.Item label="Bududa" value="Bududa" color="#fff" />
                <Picker.Item label="Bugiri" value="Bugiri" color="#fff" />
                <Picker.Item label="Bugweri" value="Bugweri" color="#fff" />
                <Picker.Item label="Buhweju" value="Buhweju" color="#fff" />
                <Picker.Item label="Buikwe" value="Buikwe" color="#fff" />
                <Picker.Item label="Bukedea" value="Bukedea" color="#fff" />
                <Picker.Item label="Bukomansimbi" value="Bukomansimbi" color="#fff" />
                <Picker.Item label="Bukwo" value="Bukwo" color="#fff" />
                <Picker.Item label="Bulambuli" value="Bulambuli" color="#fff" />
                <Picker.Item label="Buliisa" value="Buliisa" color="#fff" />
                <Picker.Item label="Bundibugyo" value="Bundibugyo" color="#fff" />
                <Picker.Item label="Bunyangabu" value="Bunyangabu" color="#fff" />
                <Picker.Item label="Bushenyi" value="Bushenyi" color="#fff" />
                <Picker.Item label="Busia" value="Busia" color="#fff" />
                <Picker.Item label="Butaleja" value="Butaleja" color="#fff" />
                <Picker.Item label="Butambala" value="Butambala" color="#fff" />
                <Picker.Item label="Butebo" value="Butebo" color="#fff" />
                <Picker.Item label="Buvuma" value="Buvuma" color="#fff" />
                <Picker.Item label="Buyende" value="Buyende" color="#fff" />
                <Picker.Item label="Dokolo" value="Dokolo" color="#fff" />
                <Picker.Item label="Gomba" value="Gomba" color="#fff" />
                <Picker.Item label="Gulu" value="Gulu" color="#fff" />
                <Picker.Item label="Hoima" value="Hoima" color="#fff" />
                <Picker.Item label="Ibanda" value="Ibanda" color="#fff" />
                <Picker.Item label="Iganga" value="Iganga" color="#fff" />
                <Picker.Item label="Isingiro" value="Isingiro" color="#fff" />
                <Picker.Item label="Jinja" value="Jinja" color="#fff" />
                <Picker.Item label="Kaabong" value="Kaabong" color="#fff" />
                <Picker.Item label="Kabale" value="Kabale" color="#fff" />
                <Picker.Item label="Kabarole" value="Kabarole" color="#fff" />
                <Picker.Item label="Kaberamaido" value="Kaberamaido" color="#fff" />
                <Picker.Item label="Kagadi" value="Kagadi" color="#fff" />
                <Picker.Item label="Kakumiro" value="Kakumiro" color="#fff" />
                <Picker.Item label="Kalangala" value="Kalangala" color="#fff" />
                <Picker.Item label="Kaliro" value="Kaliro" color="#fff" />
                <Picker.Item label="Kalungu" value="Kalungu" color="#fff" />
                <Picker.Item label="Kampala" value="Kampala" color="#fff" />
                <Picker.Item label="Kamuli" value="Kamuli" color="#fff" />
                <Picker.Item label="Kamwenge" value="Kamwenge" color="#fff" />
                <Picker.Item label="Kanungu" value="Kanungu" color="#fff" />
                <Picker.Item label="Kapchorwa" value="Kapchorwa" color="#fff" />
                <Picker.Item label="Kapelebyong" value="Kapelebyong" color="#fff" />
                <Picker.Item label="Kasanda" value="Kasanda" color="#fff" />
                <Picker.Item label="Kasese" value="Kasese" color="#fff" />
                <Picker.Item label="Katakwi" value="Katakwi" color="#fff" />
                <Picker.Item label="Kayunga" value="Kayunga" color="#fff" />
                <Picker.Item label="Kibaale" value="Kibaale" color="#fff" />
                <Picker.Item label="Kiboga" value="Kiboga" color="#fff" />
                <Picker.Item label="Kibuku" value="Kibuku" color="#fff" />
                <Picker.Item label="Kikuube" value="Kikuube" color="#fff" />
                <Picker.Item label="Kiruhura" value="Kiruhura" color="#fff" />
                <Picker.Item label="Kiryandongo" value="Kiryandongo" color="#fff" />
                <Picker.Item label="Kisoro" value="Kisoro" color="#fff" />
                <Picker.Item label="Kitagwenda" value="Kitagwenda" color="#fff" />
                <Picker.Item label="Kitgum" value="Kitgum" color="#fff" />
                <Picker.Item label="Koboko" value="Koboko" color="#fff" />
                <Picker.Item label="Kole" value="Kole" color="#fff" />
                <Picker.Item label="Kotido" value="Kotido" color="#fff" />
                <Picker.Item label="Kumi" value="Kumi" color="#fff" />
                <Picker.Item label="Kwania" value="Kwania" color="#fff" />
                <Picker.Item label="Kween" value="Kween" color="#fff" />
                <Picker.Item label="Kyankwanzi" value="Kyankwanzi" color="#fff" />
                <Picker.Item label="Kyegegwa" value="Kyegegwa" color="#fff" />
                <Picker.Item label="Kyenjojo" value="Kyenjojo" color="#fff" />
                <Picker.Item label="Kyotera" value="Kyotera" color="#fff" />
                <Picker.Item label="Lamwo" value="Lamwo" color="#fff" />
                <Picker.Item label="Lira" value="Lira" color="#fff" />
                <Picker.Item label="Luuka" value="Luuka" color="#fff" />
                <Picker.Item label="Luwero" value="Luwero" color="#fff" />
                <Picker.Item label="Lwengo" value="Lwengo" color="#fff" />
                <Picker.Item label="Lyantonde" value="Lyantonde" color="#fff" />
                <Picker.Item label="Madi-Okollo" value="Madi-Okollo" color="#fff" />
                <Picker.Item label="Manafwa" value="Manafwa" color="#fff" />
                <Picker.Item label="Maracha" value="Maracha" color="#fff" />
                <Picker.Item label="Masaka" value="Masaka" color="#fff" />
                <Picker.Item label="Masindi" value="Masindi" color="#fff" />
                <Picker.Item label="Mayuge" value="Mayuge" color="#fff" />
                <Picker.Item label="Mbale" value="Mbale" color="#fff" />
                <Picker.Item label="Mbarara" value="Mbarara" color="#fff" />
                <Picker.Item label="Mitooma" value="Mitooma" color="#fff" />
                <Picker.Item label="Mityana" value="Mityana" color="#fff" />
                <Picker.Item label="Moroto" value="Moroto" color="#fff" />
                <Picker.Item label="Moyo" value="Moyo" color="#fff" />
                <Picker.Item label="Mpigi" value="Mpigi" color="#fff" />
                <Picker.Item label="Mubende" value="Mubende" color="#fff" />
                <Picker.Item label="Mukono" value="Mukono" color="#fff" />
                <Picker.Item label="Nabilatuk" value="Nabilatuk" color="#fff" />
                <Picker.Item label="Nakapiripirit" value="Nakapiripirit" color="#fff" />
                <Picker.Item label="Nakaseke" value="Nakaseke" color="#fff" />
                <Picker.Item label="Nakasongola" value="Nakasongola" color="#fff" />
                <Picker.Item label="Namayingo" value="Namayingo" color="#fff" />
                <Picker.Item label="Namisindwa" value="Namisindwa" color="#fff" />
                <Picker.Item label="Namutumba" value="Namutumba" color="#fff" />
                <Picker.Item label="Napak" value="Napak" color="#fff" />
                <Picker.Item label="Nebbi" value="Nebbi" color="#fff" />
                <Picker.Item label="Ngora" value="Ngora" color="#fff" />
                <Picker.Item label="Ntoroko" value="Ntoroko" color="#fff" />
                <Picker.Item label="Ntungamo" value="Ntungamo" color="#fff" />
                <Picker.Item label="Nwoya" value="Nwoya" color="#fff" />
                <Picker.Item label="Obongi" value="Obongi" color="#fff" />
                <Picker.Item label="Omoro" value="Omoro" color="#fff" />
                <Picker.Item label="Otuke" value="Otuke" color="#fff" />
                <Picker.Item label="Oyam" value="Oyam" color="#fff" />
                <Picker.Item label="Pader" value="Pader" color="#fff" />
                <Picker.Item label="Pakwach" value="Pakwach" color="#fff" />
                <Picker.Item label="Pallisa" value="Pallisa" color="#fff" />
                <Picker.Item label="Rakai" value="Rakai" color="#fff" />
                <Picker.Item label="Rubanda" value="Rubanda" color="#fff" />
                <Picker.Item label="Rubirizi" value="Rubirizi" color="#fff" />
                <Picker.Item label="Rukiga" value="Rukiga" color="#fff" />
                <Picker.Item label="Rukungiri" value="Rukungiri" color="#fff" />
                <Picker.Item label="Sembabule" value="Sembabule" color="#fff" />
                <Picker.Item label="Serere" value="Serere" color="#fff" />
                <Picker.Item label="Sheema" value="Sheema" color="#fff" />
                <Picker.Item label="Sironko" value="Sironko" color="#fff" />
                <Picker.Item label="Soroti" value="Soroti" color="#fff" />
                <Picker.Item label="Tororo" value="Tororo" color="#fff" />
                <Picker.Item label="Wakiso" value="Wakiso" color="#fff" />
                <Picker.Item label="Yumbe" value="Yumbe" color="#fff" />
                <Picker.Item label="Zombo" value="Zombo" color="#fff" />
              </Picker>
            </View>
          </View>

          <View style={styles.halfCol}>
            <Text style={styles.fieldLabel}>Phase type</Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={form.PhaseType}
                onValueChange={(v) => handleChange('PhaseType', v)}
                style={styles.picker}
                dropdownIconColor="#9ca3af"
              >
                <Picker.Item label="Select phase" value="default" color="#6b7280" />
                <Picker.Item label="Single phase" value="Single Phase" color="#fff" />
                <Picker.Item label="Three phase" value="Three Phase" color="#fff" />
              </Picker>
            </View>
          </View>
        </View>
      </View>

      {/* Declaration */}
      <View style={styles.declarationBox}>
        <Switch
          value={form.Declaration}
          onValueChange={(v) => handleChange('Declaration', v)}
          trackColor={{ false: '#374151', true: '#484763' }}
          thumbColor={form.Declaration ? '#81b0ff' : '#6b7280'}
        />
        <Text style={styles.declarationText}>
          I agree to the{' '}
          <Text style={{ color: '#81b0ff' }}>terms and conditions</Text> *
        </Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.submitText}>Register</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1B1A31',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: moderateScale(14),
    height: verticalScale(14),
    tintColor: '#fff',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    textAlign: 'center',
  },

  // Section card
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // Fields
  fieldLabel: {
    color: '#9ca3af',
    fontSize: 11,
    marginBottom: 4,
    marginTop: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: 11,
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },

  // Row layout
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },

  // Picker
  pickerWrap: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    height: 48,
  },

  // Declaration
  declarationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  declarationText: {
    color: '#d1d5db',
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },

  // Submit
  submitBtn: {
    backgroundColor: '#484763',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});