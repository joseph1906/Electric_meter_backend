import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Debug() {

    const testRoutes  = [
        { name: 'Billing', path: '/BillingSystem/Billing' },
        { name: 'Airtel', path: '/BillingSystem/Airtel' },
        { name: 'MTN', path: '/BillingSystem/MTN' },
        { name: 'Visa', path: '/BillingSystem/Visa' },
        { name: 'MasterCard', path: '/BillingSystem/MasterCard' },
        { name: 'PayPal', path: '/BillingSystem/PayPal' },
        { name: 'PayUg', path: '/BillingSystem/PayUg' },
        { name: 'Printable', path: '/BillingSystem/Printable' }
    ];

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>Test Billing System Routes:</Text>
            {testRoutes.map(route => (
                <TouchableOpacity 
                    key={route.path} 
                    onPress={() => router.push(path)}
                    style={{ padding: 15, backgroundColor: '#ddd', marginBottom: 10 }}
                >
                    <Text>{route.name} - {route.path}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}