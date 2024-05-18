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
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);

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

      const barData = Object.keys(birthMonthCounts).sort((a, b) =>
        new Date(Date.parse(a + " 1, 2000")) - new Date(Date.parse(b + " 1, 2000"))
      ).map(month => ({
        month,
        count: birthMonthCounts[month]
      }));

      setHeaders(Object.keys(filteredData[0]));

      setBarChartData(barData);
      setTableData(filteredData);
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '20px' }}>
        <div id="piechartdiv" style={{ width: "400px", height: "400px" }} />
        <div style={{ width: "600px", height: "400px" }}>
          <BarChart data={barChartData} />
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((person, index) => (
              <tr key={index}>
                {headers.map((header, i) => (
                  <td key={i}>{person[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default GenderPieChart;

