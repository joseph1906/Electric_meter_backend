import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { PaymentContext } from './CentralPayment';

export default function Visa() {
    const params = useLocalSearchParams();
    const amount = params.amtNum ? Number(params.amtNum) : 0;
    
    const { setLastPayment } = useContext(PaymentContext);
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const HandlePayment = () => {
        if (!cardNumber || !expiry || !cvv) {
            Alert.alert('Error', 'Please fill in all card details');
            return;
        }

        Alert.alert('Processing...', 'Please wait');

        setTimeout(() => {
            const units = amount / 1000;
            setLastPayment({ 
                method: 'Visa', 
                amount, 
                units,
                cardLastFour: cardNumber.slice(-4) 
            });
            router.push('/BillingSystem/Printable');
        }, 2000);
    };


    const handleBack = () => {
        router.push("/DrawerIndex");
    };
    
    return (
        <ScrollView style={styles.MainContainer}>
                <TouchableOpacity onPress={handleBack}>
                    <Image source={require("@/assets/images/left-arrow.png")}
                    style={styles.back}/>
                </TouchableOpacity>
                <View style={styles.MainContainer}>
            <Text style={styles.MainTitle}>MasterCard Payment</Text>
            <Text style={styles.amountText}>Amount: UGX {amount.toLocaleString()}</Text>

            <TextInput
                placeholder="Card Number"
                value={cardNumber}
                style={styles.Input}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                left={<TextInput.Icon icon="credit-card" />}
            />

            <TextInput
                placeholder="MM/YY"
                value={expiry}
                style={styles.Input}
                onChangeText={setExpiry}
                left={<TextInput.Icon icon="calendar" />}
            />

            <TextInput
                placeholder="CVV"
                value={cvv}
                style={styles.Input}
                onChangeText={setCvv}
                keyboardType="numeric"
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
            />

            <TouchableOpacity onPress={HandlePayment} style={styles.submit}>
                <Text style={styles.Submit}>Pay with MasterCard</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: "#FAFBF9",
        width: "100%",
        padding: "5%",
        paddingTop: "10%"
    },

    MainTitle: {
        fontSize: 30,
        textAlign: "center",
        color: "#EB001B",
        fontWeight: "bold",
    },

    back: {
        width:moderateScale(20),
        height: verticalScale(18),
        marginLeft: "10%"
    },

    amountText: {
        fontSize: 20,
        textAlign: "center",
        color: "green",
        fontWeight: "bold",
        marginVertical: 15,
    },
    Input: {
        marginHorizontal: "5%",
        marginBottom: 15,
        height: 60,
        backgroundColor: "#fff",
    },
    submit: {
        width: "90%",
        height: 60,
        marginHorizontal: "5%",
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1A1F71",
        borderRadius: 8,
    },
    Submit: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});