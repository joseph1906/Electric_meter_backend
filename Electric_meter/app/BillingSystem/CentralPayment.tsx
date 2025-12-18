import { createContext, ReactNode, useContext, useState } from 'react';

export type PaymentData = {
    method: string;
    amount: number;
    units: number;
    email?: string;
    cardLastFour?: string;
    phoneNumber?: string; 
};

export type PaymentHistoryItem = PaymentData & {
    id: string;
    timestamp: string;
    date: string;
};

type PaymentContextType = {
    lastPayment: PaymentData | null;
    paymentHistory: PaymentHistoryItem[];
    setLastPayment: (payment: PaymentData) => void;
    addPaymentToHistory: (payment: PaymentData) => void;
};

export const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
    const [lastPayment, setLastPayment] = useState<PaymentData | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);

    const addPaymentToHistory = (payment: PaymentData) => {
        console.log('addPaymentToHistory called with:', payment);
        
        const historyItem: PaymentHistoryItem = {
            ...payment,
            id: `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toLocaleString(),
            date: new Date().toISOString(),
        };
        
        console.log('Adding to history:', historyItem);
        setPaymentHistory(prev => {
            const newHistory = [historyItem, ...prev];
            console.log('New history length:', newHistory.length);
            return newHistory;
        });
    };

    const setLastPaymentHandler = (payment: PaymentData) => {
        console.log('setLastPayment called with:', payment);
        setLastPayment(payment);
    };

    return (
        <PaymentContext.Provider value={{ 
            lastPayment, 
            paymentHistory,
            setLastPayment: setLastPaymentHandler,
            addPaymentToHistory 
        }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePaymentContext = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePaymentContext must be used within a PaymentProvider');
    }
    return context;
};