import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
export default function Billing() {
    const [input, setInput] = useState("");
    const amtNum = Number(input);
    
    const today = new Date();

    const handlePaymentNavigation = (method: string) => {
        if (!input || input === "0") {
            alert("Please enter an amount to purchase the payment");
            return;
        }
        router.push(`/BillingSystem/${method}?amtNum=${input}`);
    };

    const formattedDate = today.toISOString().split("T")[0];
    
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
                    <View>
                        <View style={styles.Block}>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('Airtel')}
                                style={styles.Touche}
                                >
                                    <Image 
                                        source={require("../../assets/images/Airtel.png")}
                                        style={styles.Img}
                                    />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('MTN')}
                                style={styles.Touche}
                            >
                                <Image 
                                    source={require("../../assets/images/MTN.png")}
                                    style={styles.Img}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('Visa')}
                                style={styles.Touche}
                            >
                                <Image 
                                    source={require("../../assets/images/Visa.jpg")}
                                    style={styles.Img}
                                />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.Block}>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('MasterCard')}
                                style={styles.Touche}
                            >
                                <Image 
                                    source={require("../../assets/images/MasterCard.png")}
                                    style={styles.Img}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('PayPal')}
                                style={styles.Touche}
                            >
                                <Image 
                                    source={require("../../assets/images/Paypal.png")}
                                    style={styles.Img}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => handlePaymentNavigation('PayUg')}
                                style={styles.Touche}
                            >
                                <Image 
                                    source={require("../../assets/images/Payoneer.png")}
                                    style={styles.Img}
                                />
                            </TouchableOpacity>
                        </View>
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
        fontWeight:"bold"
    },

    TextDate: {
        color: "#fff",
        fontSize: 20,
        marginBottom: 10,
        fontWeight:"bold",
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
        fontWeight:"bold",
        fontSize: 18,
        marginBottom: 10,
        opacity: 0.5,
    },

    Block: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
    },

    Touche: {
        borderColor: "#D9D9D9",
        borderWidth: 2,
        width: "30%",
        padding: "3%",
        alignItems: "center",
        marginRight: "5%",
        marginBottom: 20,
        backgroundColor: "#D9D9D9"
    },

    Img: {
        width: "100%",
        height: 80,
    },
});