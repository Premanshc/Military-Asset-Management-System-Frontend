import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      }
    };

    fetchDashboard();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4">Purchases</th>
              <th className="py-3 px-4">Transfers In</th>
              <th className="py-3 px-4">Transfers Out</th>
              <th className="py-3 px-4">Assigned</th>
              <th className="py-3 px-4">Expended</th>
              <th className="py-3 px-4">Closing</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item, index) => (
              <tr key={index} className="text-gray-700 text-sm border-t">
                <td className="py-2 px-4 font-medium">{item.assetName}</td>
                <td className="py-2 px-4">{item.assetType}</td>
                <td className="py-2 px-4 text-center">{item.purchases}</td>
                <td className="py-2 px-4 text-center">{item.transfersIn}</td>
                <td className="py-2 px-4 text-center">{item.transfersOut}</td>
                <td className="py-2 px-4 text-center">{item.assigned}</td>
                <td className="py-2 px-4 text-center">{item.expended}</td>
                <td className="py-2 px-4 text-center font-semibold">{item.closingBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
