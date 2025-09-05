import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const FoodTypeChart = ({ foodData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);