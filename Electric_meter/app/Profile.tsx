import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Profile() {
  const router = useRouter();
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
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
          try {
            const response = await fetch(`${API_URL}/api/get-profile-image/${parsedUser.id}`);
            const data = await response.json();
            if (data.success && data.image) {
              setProfileImage(data.image);
            } else {
              const saved = await AsyncStorage.getItem('profileImage');
              if (saved) setProfileImage(saved);
            }
          } catch {
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

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUploading(true);
      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (!base64 || base64.length < 100) {
          Alert.alert('Error', 'Could not read image.');
          return;
        }
        const imageBase64 = `data:image/jpeg;base64,${base64}`;
        setProfileImage(imageBase64);
        setImageKey(prev => prev + 1);
        await AsyncStorage.setItem('profileImage', imageBase64);

        const storedUser = await AsyncStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        if (parsedUser?.id) {
          const response = await fetch(`${API_URL}/api/upload-profile-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: parsedUser.id, imageBase64 }),
          });
          const data = await response.json();
          if (data.success) Alert.alert('Success', 'Profile picture updated!');
        }
      } catch (error: any) {
        Alert.alert('Error', error?.message || 'Failed to save image.');
      } finally {
        setUploading(false);
      }
    }
  };

  const rows = [
    {
      id: 1,
      label: 'Meter number',
      value: user?.MeterNumber || 'N/A',
      color: '#EEEDFE',
      iconColor: '#534AB7',
      icon: (
        <View style={[styles.iconBox, { backgroundColor: '#EEEDFE' }]}>
          <Text style={[styles.iconEmoji, { color: '#534AB7' }]}>⚡</Text>
        </View>
      ),
    },
    {
      id: 2,
      label: 'District',
      value: user?.District || 'N/A',
      color: '#E1F5EE',
      iconColor: '#0F6E56',
      icon: (
        <View style={[styles.iconBox, { backgroundColor: '#E1F5EE' }]}>
          <Text style={[styles.iconEmoji, { color: '#0F6E56' }]}>📍</Text>
        </View>
      ),
    },
    {
      id: 3,
      label: 'Phase type',
      value: user?.PhaseType || 'N/A',
      color: '#FAEEDA',
      iconColor: '#854F0B',
      icon: (
        <View style={[styles.iconBox, { backgroundColor: '#FAEEDA' }]}>
          <Text style={[styles.iconEmoji, { color: '#854F0B' }]}>🔌</Text>
        </View>
      ),
    },
    {
      id: 4,
      label: 'Phone',
      value: user?.Telephone || 'N/A',
      color: '#E6F1FB',
      iconColor: '#185FA5',
      icon: (
        <View style={[styles.iconBox, { backgroundColor: '#E6F1FB' }]}>
          <Text style={[styles.iconEmoji, { color: '#185FA5' }]}>📞</Text>
        </View>
      ),
    },
  ];

  const initials = user
    ? `${user.Firstname[0]}${user.Lastname[0]}`.toUpperCase()
    : '?';

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Dark header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn}>
          </TouchableOpacity>
          <View style={{ width: 36 }} />
        </View>

        {/* Avatar — overlaps header */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            {uploading ? (
              <View style={styles.avatar}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            ) : profileImage ? (
              <Image
                key={imageKey}
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}

            {/* Camera button */}
            <TouchableOpacity
              onPress={pickImage}
              disabled={uploading}
              style={styles.cameraBtn}
            >
              <Text style={{ fontSize: 13 }}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {user ? `${user.Firstname} ${user.Lastname}` : 'Loading...'}
          </Text>
          <Text style={styles.userEmail}>{user?.Email || ''}</Text>
        </View>

        {/* Info card */}
        <View style={styles.card}>
          {rows.map((item, index) => (
            <View key={item.id}>
              <View style={styles.row}>
                {item.icon}
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowValue}>{item.value}</Text>
                </View>
                <Text style={styles.rowChevron}>›</Text>
              </View>
              {index < rows.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        {/* Edit button */}
        <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit profile</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scroll: {
    paddingBottom: 40,
  },

  // Header
  header: {
    backgroundColor: '#1B1A31',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 56,
  },
  backArrow: {
    color: '#fff',
    fontSize: 26,
    lineHeight: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginTop: -44,
    marginBottom: 20,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    backgroundColor: '#484763',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B1A31',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B1A31',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6b7280',
  },

  // Info card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconEmoji: {
    fontSize: 15,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  rowChevron: {
    fontSize: 20,
    color: '#d1d5db',
    lineHeight: 22,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#f3f4f6',
    marginLeft: 64,
  },

  // Edit button
  editBtn: {
    backgroundColor: '#1B1A31',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});