import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardLogistics = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLogisticsData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/logistics-dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching logistics dashboard:', err);
      }
    };

    fetchLogisticsData();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Logistics Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4">Purchases</th>
              <th className="py-3 px-4">Transfers In</th>
              <th className="py-3 px-4">Transfers Out</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="text-gray-700 border-t text-sm">
                <td className="py-2 px-4 font-medium">{item.assetName}</td>
                <td className="py-2 px-4 text-center">{item.purchases}</td>
                <td className="py-2 px-4 text-center">{item.transfersIn}</td>
                <td className="py-2 px-4 text-center">{item.transfersOut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardLogistics;
