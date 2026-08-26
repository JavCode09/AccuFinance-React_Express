// components/pages/Dashboard.js
import React from 'react';

const Dashboard = ({titleModule}) => {
    return (
        <div className="dashboard-container">
          <div className="containerPanel-title">
                    <h2>{titleModule}</h2>
                </div>
        </div>
    );
};

export default Dashboard;
