import React from "react";
import { Chart } from "react-google-charts";

const PlotComponent = ({ plotData, title, chartType="BarChart" }) => {
  return (
    <div className="plot-container">
      <h3>{title}</h3>
      <Chart 
        chartType={chartType}
        width="100%"
        height="400px"
        data={plotData}
        options={{
          chartArea: { width: '50%' },
          hAxis: { title: 'Frequency', minValue: 0 },
          vAxis: { title: 'Position' },
          legend: { position: 'none' }
        }}
      />
    </div>
  );
};

export default PlotComponent;
