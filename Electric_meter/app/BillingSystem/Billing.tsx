import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function Billing() {
    const [input, setInput] = useState("");
    
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const handlePaymentNavigation = (method: string) => {
        if (!input || input === "0") {
            alert("Please enter an amount to purchase the payment");
            return;
        }
        router.push(`/BillingSystem/${method}?amtNum=${input}`);
    };

    const paymentMethods = [
        { method: 'Airtel', label: 'Airtel Money', color: '#FF0000', textColor: '#fff' },
        { method: 'MTN', label: 'MTN Mobile\nMoney', color: '#FFC107', textColor: '#000' },
        { method: 'Visa', label: 'Visa', color: '#1A1F71', textColor: '#fff' },
        { method: 'MasterCard', label: 'MasterCard', color: '#EB001B', textColor: '#fff' },
        { method: 'PayPal', label: 'PayPal', color: '#003087', textColor: '#fff' },
        { method: 'PayUg', label: 'Payoneer', color: '#FF6C2C', textColor: '#fff' },
    ];

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic' style={styles.MainContainer}>
            <View style={styles.Container}>
                <View style={styles.container}>
                    <Text style={styles.MainTitle}>Billing & Payments</Text>

                    <View style={styles.container1}>
                        <View>
                            <Text style={styles.Text}>Enter the amount of money</Text>
                            <TextInput
                                placeholder='Enter the amount of money'
                                style={styles.Input}
                                value={input}
                                onChangeText={setInput}
                                underlineColor='transparent'
                                keyboardType='numeric'
                            />
                        </View>
                        <View>
                            <Text style={styles.TextDate}>Today's Date</Text>
                            <Text style={styles.Date}>{formattedDate}</Text>
                        </View>
                    </View>

                    <Text style={styles.Title}>Payment Options</Text>
                    <Text style={styles.TextMode}>Choose a payment mode</Text>

                    <View style={styles.grid}>
                        {paymentMethods.map((item) => (
                            <TouchableOpacity
                                key={item.method}
                                onPress={() => handlePaymentNavigation(item.method)}
                                style={[styles.Touche, { backgroundColor: item.color }]}
                            >
                                <Text style={[styles.PaymentLabel, { color: item.textColor }]}>
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: "#D9D9D9",
        width: "100%",
    },
    Container: {
        backgroundColor: "#D9D9D9",
        padding: "5%",
    },
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: "5%",
    },
    MainTitle: {
        color: "#171816",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        marginBottom: 20,
    },
    container1: {
        backgroundColor: "#484763",
        padding: "3%",
        borderColor: "#F1F0F2",
        borderWidth: 3,
        borderRadius: 8,
        marginBottom: 20,
    },
    Title: {
        color: "#000001",
        fontWeight: "bold",
        fontSize: 25,
        marginBottom: 15,
    },
    Text: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold"
    },
    TextDate: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 10,
        fontWeight: "bold",
        opacity: 0.5,
    },
    Input: {
        borderRadius: 10,
        marginBottom: 10,
    },
    Date: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
    TextMode: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 10,
        opacity: 0.5,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    Touche: {
    width: "45%",
    height: 120,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 8,
},
PaymentLabel: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
},
});