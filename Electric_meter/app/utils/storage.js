import AsyncStorage from '@react-native-async-storage/async-storage';

export const getLoggedInUserId = async () => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            return user.id;
        }
        return null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
};

export const getLoggedInUser = async () => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
            return JSON.parse(userJson);
        }
        return null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};