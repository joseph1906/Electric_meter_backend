import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import Billing from './BillingSystem/Billing';
import HistoryPayment from './BillingSystem/HistoryPayment';
import Dashboard from "./Dashboard";
import Profile from './Profile';

export type TabStackParamList = {
    Dashboard: undefined;
    Billing: undefined;
    HistoryPayment: undefined;
};

const drawer = createDrawerNavigator();

const Navigator = () => {
    
    return(
        <drawer.Navigator initialRouteName='Dashboard'>
            <drawer.Screen name="Profile" component={Profile} />
            <drawer.Screen name="Dashboard" component={Dashboard}/>
            <drawer.Screen name="History Payment" component={HistoryPayment}/>
            <drawer.Screen name='Billing Payment' component={Billing}/>
        </drawer.Navigator>
    )
};

const styles = StyleSheet.create({
    MainConatiner: {},

    Container: {}
})

export default Navigator;