import React, { useEffect, useState, useRef } from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import FoodItem from './Components/FoodItem';
import DonateForm from './Components/DonateForm';
import NGOCard from './Components/NGOCard';
import Chart from './Components/Chart';
import './App.css';

const App = () => {
  const [foodData, setFoodData] = useState(JSON.parse(localStorage.getItem('foodData')) || []);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [mostWasted, setMostWasted] = useState('Calculating...');
  const [savedItemsCount, setSavedItemsCount] = useState(0);
  const [filteredFoodData, setFilteredFoodData] = useState(foodData);
  const [noResults, setNoResults] = useState(false);

    const mapRef = useRef(null); // Ref for the map container

      // Update localStorage and calculate stats
  useEffect(() => {
    localStorage.setItem('foodData', JSON.stringify(foodData));
    calculateMostWastedType();
    setSavedItemsCount(foodData.filter(item => new Date(item.expiry) >= new Date()).length);
    setFilteredFoodData(foodData);
  }, [foodData]);