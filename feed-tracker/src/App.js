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

    const calculateMostWastedType = () => {
    const now = new Date();
    const counts = {};
    foodData.forEach(item => {
      if (new Date(item.expiry) < now) {
        counts[item.type] = (counts[item.type] || 0) + 1;
      }
    });
    const maxType = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'None');
    setMostWasted(maxType.charAt(0).toUpperCase() + maxType.slice(1));
  };

    const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

    useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addFoodItem = (newItem) => {
    setFoodData(prev => [...prev, newItem]);
  };

    const removeFoodItem = (index) => {
    setFoodData(prev => prev.filter((_, i) => i !== index));
  };

    const filterFoodItems = (type) => {
    if (type === 'all') {
      setFilteredFoodData(foodData);
    } else {
      setFilteredFoodData(foodData.filter(item => item.type === type));
    }
  };

  const searchFoodItems = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = foodData.filter(item => item.name.toLowerCase().includes(lowerQuery));
  setFilteredFoodData(results);
  setNoResults(results.length === 0); // <-- sets warning if no results
};


useEffect(() => {
  if (!mapRef.current) return;

  // Initialize map
  const map = L.map(mapRef.current, {
    center: [-15.3875, 28.3228],
    zoom: 13,
  });
    L.tileLayer(
    "https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?&apiKey=d6a634c2a6464ced87bf6df192a6bf65",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://www.geoapify.com/">Geoapify</a>',
    }
  ).addTo(map);

  let isMounted = true; // Guard flag

    // Function to safely set user location
const setUserLocation = (lat, lng) => {
  if (!isMounted) return;
  map.setView([lat, lng], 15);

    // Correct marker with proper icon
  L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  })
  .addTo(map)
  .bindPopup("You are here!")
  .openPopup();
};

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (isMounted) {
          setUserLocation(latitude, longitude);
        }
      },

       (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  } else {
    console.warn("Geolocation not supported");
  }

  return () => {
    isMounted = false; // Prevent async callbacks from touching map after unmount
    map.remove();
  };
}, []);

 return (
    <div>
      <header>
        <div className="header-top-row">
          <h1>🌍 FEED - Food Expiry & Donation Tracker</h1>
          <button id="darkToggleBtn" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Disable Dark Mode' : '🌙 Enable Dark Mode'}
          </button>
        </div>

 <form id="foodForm" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newItem = {
            name: formData.get('foodName'),
            expiry: formData.get('expiryDate'),
            type: formData.get('foodType'),
          };
          addFoodItem(newItem);
          e.target.reset();
        }}>

 <input type="text" name="foodName" placeholder="Food Name" required />
          <input type="date" name="expiryDate" required />
          <select name="foodType">
            <option value="fruits">Fruits</option>
            <option value="vegetables">Vegetables</option>
            <option value="canned">Canned</option>
            <option value="dry">Dry Goods</option>
            <option value="leftovers">Leftovers</option>
          </select>
          <button type="submit">Add</button>
        </form>
      </header>

 <section className="filters">
        <button type="button" onClick={() => filterFoodItems('all')}>📦 All</button>
        <button type="button" onClick={() => filterFoodItems('fruits')}>🍎 Fruits</button>
        <button type="button" onClick={() => filterFoodItems('vegetables')}>🥦 Vegetables</button>
        <button type="button" onClick={() => filterFoodItems('canned')}>🥫 Canned</button>
        <button type="button" onClick={() => filterFoodItems('dry')}>🍞 Dry Goods</button>
        <button type="button" onClick={() => filterFoodItems('leftovers')}>🍽️ Leftovers</button>
      </section>

