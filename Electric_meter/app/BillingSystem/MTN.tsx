import { moderateScale, verticalScale } from '@/assets/styling/scaling';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { PaymentContext } from './CentralPayment';

export default function Airtel() { 
    const { setLastPayment } = useContext(PaymentContext);
    const [input, setInput] = useState("");
    
    const params = useLocalSearchParams();
    const amount = params.amtNum ? Number(params.amtNum) : 0;
    
    const calculateUnits = (amount: number) => amount / 1000;
    
    const HandlePayment = () => {
        if (input && input.length === 10) {
            const units = calculateUnits(amount);
            setLastPayment({ method: "Airtel", amount: amount, units });
            router.push("/BillingSystem/Printable");
        } else {
            alert("Please enter a Airtel valid number");
        }
    }

    const handleKeyPress = (value: string) => { 
        if (!/^\d$/.test(value) || input.length >= 9) return;
        setInput(input + value);
    };

    const handleBackspace = () => {
        setInput(input.slice(0, -1));
    };

    const handleClear = () => {
        setInput(""); 
    };


    const handleBack = () => {
        router.push("/DrawerIndex");
    };
        
    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.MainContainer}>
            <TouchableOpacity onPress={handleBack}>
                <Image source={require("@/assets/images/left-arrow.png")}
                style={styles.back}/>
            </TouchableOpacity>
                <Text style={styles.MainTitle}>MTN Mobile Number</Text>

                <Text style={styles.amountText}>Amount: UGX {amount.toLocaleString()}</Text>

                <Text style={styles.MainText}>
                    Please, enter your MTN number
                </Text>

                <TextInput
                    placeholder="Telephone Number"
                    keyboardType='numeric'
                    onChangeText={setInput}
                    style={styles.Input}
                    underlineColorAndroid="transparent"
                />
                
                <Text style={styles.MainText}>
                    Please, enter your Mobile money password
                </Text>

                <TextInput
                    placeholder="password"
                    style={styles.Input}
                    underlineColorAndroid="transparent"
                    secureTextEntry
                />

                <View>
                    <TouchableOpacity onPress={HandlePayment} style={styles.submit}>
                        <Text style={styles.Submit}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: "#D9D9D9",
        width: "100%",
        alignContent: "center",
        padding: "5%",
    },

    MainContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#D9D9D9",
        width: "100%",
        alignContent: "center",
        paddingTop:"10%",
        paddingBottom:"5%",
    },

    back: {
        width:moderateScale(22),
        height:verticalScale(20),
        marginLeft: "5%",
    },

    MainTitle: {
        fontSize: 30,
        textAlign: "center",
        color: "orange",
        opacity: 0.7,
        fontWeight: "bold",
    },

    MainText: {
        marginLeft: "5%",
        fontSize: 18,
        textAlign: "justify", 
        color: "#484763",
    },

    amountText: {
        fontSize: 18,
        textAlign: "center",
        color: "green",
        fontWeight: "bold",
        marginVertical: 10,
    },

    Input: {
        margin:"5%",
        height: 70,
        backgroundColor:"#FFFFFF",
    },

    view: {
        flexDirection: "row",
        width: "90%",
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: "5%",
    },

    Touche: {
        width: "30%",
        height: 80,
        marginRight: "5%",
        backgroundColor: "#87CEEB",
        alignItems: "center",
        justifyContent: "center",
    },

    Text: {
        fontSize: 60,
        fontWeight: "bold",
    },

    submit: {
        width: "90%",
        height: 80,
        marginLeft: "5%",
        marginRight: "5%",
        marginBottom: "5%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#484763",
        borderRadius: 8,
    },

    Submit: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        color:"#fff",
        opacity:0.8,
    },

});