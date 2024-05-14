// /src/App.js
import React, { useState, useEffect } from 'react';
import GenderPieChart from './GenderPieChart';
import TopBar from './Components/TopBar';

function App() {
  const [peopleData, setPeopleData] = useState([]);

  useEffect(() => {
    fetch('people-1000.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split("\n");
        const header = rows[0].split(",");
        const sexIndex = header.indexOf("Sex");
        const dobIndex = header.indexOf("Date of birth");

        if (sexIndex === -1 || dobIndex === -1) {
          console.error("Sex or Date of Birth column not found in the CSV file.");
          return;
        }

        const people = [];
        for (let i = 1; i < rows.length; i++) { 
          const rowData = rows[i].split(",");
          if (rowData.length > Math.max(sexIndex, dobIndex) && rowData[sexIndex] && rowData[dobIndex]) { 
            const sex = rowData[sexIndex].toLowerCase();
            const dateOfBirth = rowData[dobIndex];
            // Validate the date format (simple YYYY-MM-DD check)
            const dateParts = dateOfBirth.split("-");
            if (dateParts.length === 3 && !isNaN(Date.parse(dateOfBirth))) {
              people.push({ sex, dateOfBirth });
            }
          }
        }
        console.log('People Data:', people);
        setPeopleData(people);
      });
  }, []);

  return (
    <div className="App">
      <TopBar />
      <GenderPieChart data={peopleData} />
    </div>
  );
}

export default App;
