import colors from '@/assets/styling/colors';
import { moderateScale, scale, verticalScale } from '@/assets/styling/scaling';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const [photo, setPhoto] = useState();
    
    const Data = [
        {id: 1, iconLeft: require("../assets/styling/MeterNumber.jpg"), label: "Meter Number", next: require("../assets/styling/arrow.png")},
        {id: 2, iconLeft: require("../assets/styling/location.png"), label: "Kampala", next: require("../assets/styling/arrow.png")},
        {id: 3, iconLeft: require("../assets/styling/compliant.png"), label: "Phase Type", next: require("../assets/styling/arrow.png")},
        {id: 6, iconLeft: require("../assets/styling/out.png"), next: require("../assets/styling/arrow.png")},
    ];

    return(
        <ScrollView>
        <SafeAreaView style={styles.mainContainer}>
            <View style={[styles.mainContainer, 
                {paddingHorizontal: moderateScale(20)}]}>
                <TouchableOpacity onPress={() => Alert.alert("working")}>
                     <Image source={require("../assets/images/left-arrow.png")} 
                style={styles.Imgcontainer}/>
                </TouchableOpacity>
                <Text style={styles.profileText}>{"Profile"}</Text>
                
                <View style={{alignItems:"center", marginTop:verticalScale(20)}}>
                    <View style={styles.ProfileView}>
                        <View style={styles.ProfileViewTwo}>
                            <View style={styles.ProfileViewStyle}>
                                <Image style={styles.profileImg}
                                source={require("../assets/image.png")}/>
                                <TouchableOpacity onPress={() => Alert.alert('Edit Image')}
                                style={styles.edit}>
                                <Image style={styles.editImg}
                                source={require("../assets/styling/image.png")}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.userNameText}>{"SAJ.COM"}</Text>
                        <Text style={styles.userNumber}>{"1234567654"}</Text>
                        <Text style={styles.userNumber}>{"sayen@gmail.com"}</Text>
                    </View>
                </View>

                <FlatList
                    keyExtractor={(item) => item.id.toString()}
                    data={Data}
                    contentContainerStyle={{
                        marginTop: moderateScale(40),
                        paddingBottom: moderateScale(20),
                        justifyContent:"center",
                        marginLeft: "20%"
                    }}

                    ItemSeparatorComponent={() => <View style={{height: verticalScale(20)}} />}
                    renderItem={({item}) => {
                        return(
                            <View style={{flexDirection:"row", alignItems:'center'}}>
                                <View style={{
                                    maxWidth:'20%',
                                    borderRadius: 100,
                                    alignItems:"center",
                                    justifyContent: "center",
                                    height: moderateScale(32),
                                    width: moderateScale(32),
                                    backgroundColor: colors.BackgroundColor
                                }}>
                                    <Image style={{
                                        height: moderateScale(16),
                                        width: moderateScale(16),
                                    }} 
                                    source={item.iconLeft}/>
                                </View>
                                <View style={{width:'55%', marginHorizontal: moderateScale(10)}}>
                                    <Text>{item.label}</Text>
                                </View>
                                <View style={{width:'20%'}}>
                                    <Image
                                        style={{
                                            width: moderateScale(12),
                                            height: moderateScale(12)
                                        }}
                                        source={item.next}/>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
        boxSizing:"border-box"
    },

    Imgcontainer: {
        width: moderateScale(12),
        height: verticalScale(12),
    },

    profileText: {
        fontWeight:"bold",
        fontStyle:"italic",
        fontSize: scale(16),
        textAlign:"center",
        marginTop: verticalScale(12),
    },

    ProfileView: {
        alignItems: "center",
        justifyContent: "center",
        height: verticalScale(150),
        width: moderateScale(150),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.roundColor,
    },

    ProfileViewTwo: {
        alignItems: "center",
        justifyContent: "center",
        height: verticalScale(130),
        width: moderateScale(130),
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.roundColor,
    },

    ProfileViewStyle: {
        backgroundColor: colors.BackgroundColor, 
        height: verticalScale(100),
        width: moderateScale(100),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
    },

    profileImg: {
        height: verticalScale(80),
        width: moderateScale(80),
        borderRadius: 40,
    },

    edit: {
        position: 'absolute',
        bottom: moderateScale(6),
        right: moderateScale(4),
    },

    editImg: {
        width: moderateScale(20),
        height: moderateScale(26),
    },

    userNameText: {
        fontSize: scale(14),
        color: '#000000',
        textAlign:'center',
        marginTop: moderateScale(16),
    },

    userNumber: {
        fontSize: scale(12),
        color: '#000000',
        textAlign:'center',
        marginTop: moderateScale(4),
    },

})