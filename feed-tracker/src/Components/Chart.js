import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FoodTypeChart = ({ foodData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const typeCounts = {};

    foodData.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });
