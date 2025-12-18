import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { PaymentContext } from './CentralPayment';

export default function PayUg() {
    const params = useLocalSearchParams();
    const amount = params.amtNum ? Number(params.amtNum) : 0;
    
    const { setLastPayment } = useContext(PaymentContext);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [pin, setPin] = useState("");

    const calculateUnits = (amt: number) => amt / 1000;
    
    const HandlePayment = () => {
        if (!phoneNumber || !pin) {
            Alert.alert("Error", "Please enter both phone number and PIN");
            return;
        }
        
        const cleanPhoneNumber = phoneNumber.replace(/\s/g, '');
        if (!cleanPhoneNumber.startsWith("256") && !cleanPhoneNumber.startsWith("0")) {
            Alert.alert("Error", "Please enter a valid Ugandan phone number");
            return;
        }
        
        if (pin.length !== 4) {
            Alert.alert("Error", "PIN must be 4 digits");
            return;
        }

        Alert.alert("Processing PayUg Payment...", "Please wait...");

        setTimeout(() => {
            const paymentSuccess = Math.random() > 0.3;
            
            if (paymentSuccess) {
                const units = calculateUnits(amount);
                
                setLastPayment({ 
                    method: "PayUg", 
                    amount: amount, 
                    units,
                    phoneNumber: cleanPhoneNumber
                });

                router.push("/BillingSystem/Printable");
            } else {
                Alert.alert("Payment Failed", "Please check your details and try again.");
            }
        }, 2000);
    };

    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.startsWith('256')) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
        } else if (cleaned.startsWith('0')) {
            return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        }
        return cleaned;
    };

    const handleBack = () => {
        router.push("/DrawerIndex");
    };

    return (
        <ScrollView style={styles.Container}>
            <View style={styles.MainContainer}>                
                    <TouchableOpacity onPress={handleBack}>
                        <Image source={require("@/assets/images/left-arrow.png")}
                            style={styles.back}/>
                    </TouchableOpacity>
                <Text style={styles.MainTitle}>PayUg Payment</Text>
                <Text style={styles.amountText}>Amount: UGX {amount.toLocaleString()}</Text>

                <TextInput
                    placeholder="Phone Number (256XXX or 0XXX)"
                    value={formatPhoneNumber(phoneNumber)}
                    style={styles.Input}
                    onChangeText={(text) => setPhoneNumber(text.replace(/\s/g, ''))}
                    keyboardType="phone-pad"
                    left={<TextInput.Icon icon="phone" />}
                />

                <TextInput
                    placeholder="4-digit PIN"
                    value={pin}
                    style={styles.Input}
                    onChangeText={setPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    left={<TextInput.Icon icon="lock" />}
                />

                <TouchableOpacity onPress={HandlePayment} style={styles.submit}>
                    <Text style={styles.Submit}>Pay with PayUg</Text>
                </TouchableOpacity>

                <Text style={styles.securityText}>🔒 Your details are secure and encrypted</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    Container: {
        backgroundColor:"#FAFBF9",
        paddingTop: "2%"
    },

    MainContainer: { 
    backgroundColor: "#FAFBF9", 
    width: "100%", 
    padding: "5%" 
},

    back: {
        width: moderateScale(20),
        height: verticalScale(18),
        marginBottom: "15%",
        marginLeft:"5%",
    },

    MainTitle: { 
        fontSize: 30,
        textAlign: "center", 
        color: "green", 
        fontWeight: "bold" 
    },

    MainText: { 
        fontSize: 16, 
        textAlign: "center", 
        color: "green", 
        marginBottom: 20, 
        fontWeight: "600" 
    },

    amountText: { 
        fontSize: 20, 
        textAlign: "center", 
        color: "green", 
        fontWeight: "bold", 
        marginVertical: 15,  
        padding: 10, 
        borderRadius: 8 
    },

    Input: { 
        marginHorizontal: "5%", 
        marginBottom: 15, 
        height: 60, 
        backgroundColor: "#fff" 
    },

    submit: { 
        width: "90%", 
        height: 60, 
        marginHorizontal: "5%", 
        marginBottom: 15, 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: "#484763", 
        borderRadius: 8 
    },

    Submit: { 
        fontSize: 20, 
        fontWeight: "bold", 
        color: "#fff" 
    },

    securityText: { 
        fontSize: 14, 
        textAlign: "center", 
        color: "gray", 
        marginTop: 15, 
        fontStyle: "italic" 
    },
});