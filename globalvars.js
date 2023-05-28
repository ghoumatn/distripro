import * as FileSystem from 'expo-file-system';

export const clientFilePath = `${FileSystem.documentDirectory}clients.json`;
export const productFilePath = `${FileSystem.documentDirectory}products.json`;
export const ordersFilePath = `${FileSystem.documentDirectory}orders.json`;
export const mapocheFilePath = `${FileSystem.documentDirectory}mapoche.json`;
export const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
];

export const weekdays = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

export function getDayName(date = new Date(), locale = 'fr-FR') {
    return date.toLocaleDateString(locale, {weekday: 'long'});
}