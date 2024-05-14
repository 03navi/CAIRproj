// /src/GenderPieChart.js
import React, { useState, useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Modal from './Components/Modal';
import BarChart from './Components/BarChart';

const GenderPieChart = ({ data }) => {
  const chart = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);

    const newChart = am4core.create("piechartdiv", am4charts.PieChart);
    const maleCount = data.filter(person => person.sex === "male").length;
    const femaleCount = data.filter(person => person.sex === "female").length;

    newChart.data = [
      { category: "Male", value: maleCount },
      { category: "Female", value: femaleCount },
    ];

    const pieSeries = newChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.category = "category";
    pieSeries.dataFields.value = "value";
    pieSeries.labels.template.disabled = true;

    // Set reverseOrder to true to reverse the order of categories in the legend
    newChart.legend = new am4charts.Legend();
    newChart.legend.reverseOrder = true;

    pieSeries.slices.template.events.on("hit", (event) => {
      const category = event.target.dataItem.category.toLowerCase();
      const filteredData = data.filter(person => person.sex === category);

      const birthMonthCounts = {};
      filteredData.forEach(person => {
        const date = new Date(person.dateOfBirth);
        if (!isNaN(date)) {
          const birthMonth = date.toLocaleString('default', { month: 'long' });
          birthMonthCounts[birthMonth] = (birthMonthCounts[birthMonth] || 0) + 1;
        }
      });

      const barData = Object.keys(birthMonthCounts).map(month => ({
        month,
        count: birthMonthCounts[month]
      }));

      console.log('Filtered Data:', filteredData);
      console.log('Bar Data:', barData);

      setBarChartData(barData);
      setIsModalOpen(true);
    });

    chart.current = newChart;

    return () => {
      if (chart.current) {
        chart.current.dispose();
        chart.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div id="piechartdiv" style={{ width: "400px", height: "400px" }} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <BarChart data={barChartData} />
      </Modal>
    </div>
  );
};

export default GenderPieChart;
