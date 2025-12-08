// Map Configuration and Global Variables
let neighborhoodsLayer = L.layerGroup();

// Initialize map centered on Dublin
const map = L.map('map').setView([53.3498, -6.2603], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Layer groups
const coffeeLayer = L.layerGroup().addTo(map);
const searchLayer = L.layerGroup().addTo(map);

// Global state variables
let allCoffeeShops = [];
let currentMode = 'nearest';
let distanceModeShops = [];
let radiusCircle = null;
let distanceLine = null;