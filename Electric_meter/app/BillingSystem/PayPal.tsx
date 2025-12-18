import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Added Alert here
import { TextInput } from 'react-native-paper';
import { PaymentContext } from './CentralPayment';

export default function PayPal() {
    const params = useLocalSearchParams();
    const amount = params.amtNum ? Number(params.amtNum) : 0;
    
    const { setLastPayment } = useContext(PaymentContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const calculateUnits = (amt: number) => amt / 1000;
    
    const HandlePayment = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password");
            return;
        }
        
        if (!email.includes("@")) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }
        
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        Alert.alert("Connecting to PayPal...", "Please wait...");

        setTimeout(() => {
            const paymentSuccess = Math.random() > 0.3;
            
            if (paymentSuccess) {
                const units = calculateUnits(amount);
                setLastPayment({ 
                    method: "PayPal", 
                    amount: amount, 
                    units,
                    email: email 
                });
                Alert.alert("Payment Successful", "Your PayPal payment has been approved.");
                router.push("/BillingSystem/Printable");
            } else {
                Alert.alert("Payment Failed", "Please check your credentials and try again.");
            }
        }, 2000);
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
                <View>
                <Text style={styles.MainTitle}>PayPal Payment</Text>

                <Text style={styles.amountText}>Amount: UGX {amount.toLocaleString()}</Text>

                <TextInput
                    placeholder="PayPal Email Address"
                    value={email}
                    style={styles.Input}
                    underlineColorAndroid="transparent"
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="email" />}
                />

                <TextInput
                    placeholder="PayPal Password"
                    value={password}
                    style={styles.Input}
                    underlineColorAndroid="transparent"
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    left={<TextInput.Icon icon="lock" />}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={HandlePayment} style={styles.submit}>
                        <Text style={styles.Submit}>Pay with PayPal</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.securityText}>
                    🔒 Your credentials are secure and encrypted
                </Text>
            </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: "#FAFBF9",
        width: "100%",
        padding: "5%",
        paddingTop:"5%"
    },
    Container: {
        backgroundColor:"#fff",
    },

    MainTitle: {
        fontSize: 30,
        textAlign: "center",
        color: "#000",
        fontWeight: "bold",
    },
     back: {
        width:moderateScale(20),
        height: verticalScale(18),
        marginLeft: "5%",
        marginBottom:"7%"
    },

    MainText: {
        fontSize: 16,
        textAlign: "center", 
        color: "blue",
        marginBottom: 20,
    },
    amountText: {
        fontSize: 20,
        textAlign: "center",
        color: "green",
        fontWeight: "bold",
        marginVertical: 15,
        padding: 10,
        borderRadius: 8,
    },
    Input: {
        marginLeft: "5%",
        marginBottom: "5%",
        marginTop: "2%",
        marginRight: "5%",
        height: 60,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        marginTop: 20,
    },
    submit: {
        width: "90%",
        height: 60,
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: "5%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0070BA", 
        padding: "2.5%",
        borderRadius: 8,
    },
    Submit: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: "#fff",
    },
    securityText: {
        fontSize: 14,
        textAlign: "center",
        color: "gray",
        marginTop: 15,
        fontStyle: "italic",
    },
});