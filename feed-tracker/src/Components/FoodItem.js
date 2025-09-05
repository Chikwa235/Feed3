import React from 'react';

const FoodItem = ({ item, index, removeFoodItem }) => {
  const calculateDaysLeft = (date) => {
    const now = new Date();
    const exp = new Date(date);
    return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft(item.expiry);
  const status = daysLeft > 5 ? 'safe' : daysLeft > 2 ? 'warning' : 'danger';