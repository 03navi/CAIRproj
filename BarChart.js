// /src/BarChart.js
import React, { useEffect, useRef } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const BarChart = ({ data }) => {
  const chart = useRef(null);

  useEffect(() => {
    am4core.useTheme(am4themes_animated);
    
    const sortedData = [...data].sort((a, b) => {
      const monthsOrder = {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "June": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
      };
      return monthsOrder[a.month] - monthsOrder[b.month];
    });

    const newChart = am4core.create("barchartdiv", am4charts.XYChart);
    newChart.data = sortedData;

    const categoryAxis = newChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.rotation = 270;

    const valueAxis = newChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 50;

    const series = newChart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "count";
    series.dataFields.categoryX = "month";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 0.8;

    chart.current = newChart;

    return () => {
      if (chart.current) {
        chart.current.dispose();
        chart.current = null;
      }
    };
  }, [data]);

  return (
    <div id="barchartdiv" style={{ width: "100%", height: "400px" }} />
  );
};

export default BarChart;
