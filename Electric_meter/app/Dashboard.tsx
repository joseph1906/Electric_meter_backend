import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import ChartOne from "./ChartOne";

export default function Dashboard () {
    return(
    <ScrollView style={styles.MainContainer}>
        <View style={styles.MainContainer}>
            <Text style={styles.TextEntry}>Welcome to Joseph</Text>
            <View style={styles.backText}>
                <Text style={styles.MeterText}> .00</Text>
            </View>
            <View style={styles.chart}>
                <ChartOne/>
            </View>
        </View>
    </ScrollView>
    )
}

const styles = StyleSheet.create({

    MainContainer: {
        backgroundColor: "#1B1A31",
    },

    TextEntry: {
        color: "#d9d9d9",
        marginTop: 20,
        marginBottom: 20,
        fontSize: 40,
        textAlign:"center",
        fontWeight: "bold",
        fontStyle: "italic",
    },

    backText: {
        backgroundColor: "#e4e4e4",
        margin: 20,
        borderRadius: 5,
    },

    MeterText: {
        color:"#1B1A31",
        fontSize: 70,
        textAlign: "center",
        fontWeight: "bold",
    },

    chart: {
        backgroundColor: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
        margin: 20,
        borderRadius: 5,
    },
    
})