import colors from '@/assets/styling/colors';
import { moderateScale, scale, verticalScale } from '@/assets/styling/scaling';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { EncodingType } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.1.2:5000';

export default function Profile() {
  const [user, setUser] = useState<{
    id: number;
    Firstname: string;
    Lastname: string;
    Email: string;
    Telephone: string;
    District: string;
    MeterNumber: string;
    PhaseType: string;
  } | null>(null);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageKey, setImageKey] = useState(0); // ✅ Forces image re-render

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);

          // Try loading from DB first
          try {
            const response = await fetch(
              `${API_URL}/api/get-profile-image/${parsedUser.id}`
            );
            const data = await response.json();

            if (data.success && data.image) {
              // ✅ Store base64 directly in state — no file system needed
              setProfileImage(data.image);
              console.log('✅ Image loaded from DB');
            } else {
              // Fallback: load from AsyncStorage
              const saved = await AsyncStorage.getItem('profileImage');
              if (saved) {
                setProfileImage(saved);
                console.log('✅ Image loaded from AsyncStorage');
              }
            }
          } catch (fetchError) {
            console.log('DB fetch failed:', fetchError);
            const saved = await AsyncStorage.getItem('profileImage');
            if (saved) setProfileImage(saved);
          }
        }
      } catch (e) {
        console.log('Failed to load user:', e);
      }
    };
    loadUser();
  }, []);

const pickImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Required', 'Please allow gallery access.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.2,
  });

  console.log('🖼️ Picker result canceled:', result.canceled);

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    console.log('🖼️ Image URI:', uri);
    setUploading(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: EncodingType.Base64,
      });

      console.log('📦 Base64 length:', base64.length);

      if (!base64 || base64.length < 100) {
        Alert.alert('Error', 'Could not read image.');
        setUploading(false);
        return;
      }

      const imageBase64 = `data:image/jpeg;base64,${base64}`;
      console.log('✅ imageBase64 ready, length:', imageBase64.length);

      // ✅ Update state FIRST — show image immediately
      setProfileImage(imageBase64);
      setImageKey(prev => prev + 1);
      console.log('✅ State updated — image should show now');

      // ✅ Save to AsyncStorage
      await AsyncStorage.setItem('profileImage', imageBase64);
      console.log('✅ Saved to AsyncStorage');

      // ✅ Upload to backend
      const storedUser = await AsyncStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      console.log('👤 User ID for upload:', parsedUser?.id);

      if (parsedUser?.id) {
        const response = await fetch(`${API_URL}/api/upload-profile-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: parsedUser.id,
            imageBase64: imageBase64,
          }),
        });

        const data = await response.json();
        console.log('🗄️ DB upload result:', data.success, data.message);

        if (data.success) {
          Alert.alert('Success', 'Profile picture updated!');
        } else {
          Alert.alert('Saved locally', 'Image shown but DB save failed: ' + data.message);
        }
      }
    } catch (error: any) {
      console.log('❌ Full error:', JSON.stringify(error));
      Alert.alert('Error details', error?.message || 'Unknown error');
    } finally {
      setUploading(false);
    }
  }
};

  const Data = [
    {
      id: 1,
      iconLeft: require("../assets/styling/MeterNumber.jpg"),
      label: `Meter: ${user?.MeterNumber || 'N/A'}`,
      next: require("../assets/styling/arrow.png")
    },
    {
      id: 2,
      iconLeft: require("../assets/styling/location.png"),
      label: `District: ${user?.District || 'N/A'}`,
      next: require("../assets/styling/arrow.png")
    },
    {
      id: 3,
      iconLeft: require("../assets/styling/compliant.png"),
      label: `Phase: ${user?.PhaseType || 'N/A'}`,
      next: require("../assets/styling/arrow.png")
    },
    {
      id: 4,
      iconLeft: require("../assets/styling/out.png"),
      label: `Phone: ${user?.Telephone || 'N/A'}`,
      next: require("../assets/styling/arrow.png")
    },
  ];

  const SIZE = moderateScale(130);
  const SIZE_TWO = moderateScale(150);
  const SIZE_THREE = moderateScale(170);

  return (
    <ScrollView>
      <SafeAreaView style={styles.mainContainer}>
        <View style={[styles.mainContainer, { paddingHorizontal: moderateScale(20) }]}>

          <TouchableOpacity onPress={() => Alert.alert("working")}>
            <Image
              source={require("../assets/images/left-arrow.png")}
              style={styles.Imgcontainer}
            />
          </TouchableOpacity>

          <Text style={styles.profileText}>Profile</Text>

          <View style={{ alignItems: "center", marginTop: moderateScale(20) }}>

            <View style={{ position: 'relative' }}>

              {/* Outer ring */}
              <View style={{
                height: SIZE_THREE,
                width: SIZE_THREE,
                borderRadius: SIZE_THREE / 2,
                borderWidth: 1,
                borderColor: colors.roundColor,
                alignItems: "center",
                justifyContent: "center",
              }}>
                {/* Middle ring */}
                <View style={{
                  height: SIZE_TWO,
                  width: SIZE_TWO,
                  borderRadius: SIZE_TWO / 2,
                  borderWidth: 1,
                  borderColor: colors.roundColor,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {/* Innermost circle with image */}
<View style={{
  height: SIZE,
  width: SIZE,
  borderRadius: SIZE / 2,
  overflow: 'hidden',
  backgroundColor: colors.BackgroundColor,
  alignItems: 'center',      // ← ADD
  justifyContent: 'center',  // ← ADD
}}>
  {uploading ? (
    <ActivityIndicator size="large" color={colors.roundColor} />
  ) : (
    <Image
  key={imageKey}
  style={{ height: SIZE, width: SIZE, borderRadius: SIZE / 2 }}
  source={
    profileImage
      ? { uri: profileImage }
      : require("../assets/image.png")
  }
  onLoad={() => console.log('✅ Image rendered successfully')}
  onError={(e) => console.log('❌ Image render error:', e.nativeEvent.error)}
  resizeMode="cover"
/>
  )}
</View>                
</View>
              </View>

              {/* Camera button */}
              <TouchableOpacity
                onPress={pickImage}
                disabled={uploading}
                style={{
                  position: 'absolute',
                  bottom: moderateScale(8),
                  right: moderateScale(8),
                  backgroundColor: colors.BackgroundColor,
                  borderRadius: 100,
                  padding: moderateScale(7),
                  borderWidth: 1,
                  borderColor: colors.roundColor,
                  zIndex: 10,
                }}>
                <Text style={{ fontSize: moderateScale(16) }}>📷</Text>
              </TouchableOpacity>
              

            </View>

            {/* Name and Email */}
            <View style={{ alignItems: 'center', marginTop: moderateScale(10) }}>
              <Text style={styles.userNameText}>
                {user ? `${user.Firstname} ${user.Lastname}` : 'Loading...'}
              </Text>
              <Text style={styles.userNumber}>
                {user ? user.Email : ''}
              </Text>
            </View>
          </View>

          {/* Info List */}
          <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={Data}
            contentContainerStyle={{
              marginTop: moderateScale(40),
              paddingBottom: moderateScale(20),
              justifyContent: "center",
              marginLeft: "20%"
            }}
            ItemSeparatorComponent={() => <View style={{ height: moderateScale(20) }} />}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <View style={{
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  height: moderateScale(32),
                  width: moderateScale(32),
                  backgroundColor: colors.BackgroundColor
                }}>
                  <Image
                    style={{ height: moderateScale(16), width: moderateScale(16) }}
                    source={item.iconLeft}
                  />
                </View>
                <View style={{ width: '55%', marginHorizontal: moderateScale(10) }}>
                  <Text>{item.label}</Text>
                </View>
                <View style={{ width: '20%' }}>
                  <Image
                    style={{ width: moderateScale(12), height: moderateScale(12) }}
                    source={item.next}
                  />
                </View>
              </View>
            )}
          />

        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer:  { flex: 1 },
  Imgcontainer:   { width: moderateScale(12), height: moderateScale(12) },
  profileText:    { fontWeight: "bold", fontStyle: "italic", fontSize: moderateScale(16), textAlign: "center", marginTop: moderateScale(12) },
  userNameText:   { fontSize: moderateScale(14), color: '#000000', textAlign: 'center', marginTop: moderateScale(16) },
  userNumber:     { fontSize: moderateScale(12), color: '#000000', textAlign: 'center', marginTop: moderateScale(4) },
});