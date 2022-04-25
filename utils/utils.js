import { Platform } from 'react-native';

export const baseUrl = Platform.OS === 'android' ?
    'http://10.0.2.2:8080/': 
    'http://localhost:8080/';

export const baseCpnUrl = Platform.OS === 'android' ?
    'http://10.0.2.2:8010/': 
    'http://localhost:8010/';