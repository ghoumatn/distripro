import * as FileSystem from 'expo-file-system';

export const clientFilePath = `${FileSystem.documentDirectory}clients.json`;
export const productFilePath = `${FileSystem.documentDirectory}products.json`;
export const ordersFilePath = `${FileSystem.documentDirectory}orders.json`;