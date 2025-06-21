import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardAdmin = () => {
  const { token } = useAuth();
  const [overview, setOverview] = useState({
    totalBases: 0,
    totalAssets: 0,
    totalUsers: 0,
  });
  const [assets, setAssets] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    baseId: '',
    assetType: '',
  });
  const [bases, setBases] = useState([]);

  // Fetch overview and base list
  useEffect(() => {
    const fetchOverviewAndBases = async () => {
      try {
        const [overviewRes, basesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/admin`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bases`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Debug log
        console.log('Overview API Response:', overviewRes.data);

        const data = overviewRes.data;
        if (data && typeof data === 'object') {
          setOverview({
            totalBases: data.totalBases || 0,
            totalAssets: data.totalAssets || 0,
            totalUsers: data.totalUsers || 0,
          });
        }

        setBases(basesRes.data);
      } catch (err) {
        console.error('Error fetching overview or bases:', err);
      }
    };

    fetchOverviewAndBases();
  }, [token]);

  // Fetch filtered asset stats
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching asset stats:', err);
      }
    };

    fetchAssets();
  }, [filters, token]);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">Total Bases</p>
          <h2 className="text-xl font-bold text-blue-600">{overview.totalBases}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">Total Assets</p>
          <h2 className="text-xl font-bold text-blue-600">{overview.totalAssets}</h2>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-600">Total Users</p>
          <h2 className="text-xl font-bold text-blue-600">{overview.totalUsers}</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Base</label>
          <select
            name="baseId"
            value={filters.baseId}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">All Bases</option>
            {bases.map((base) => (
              <option key={base.id} value={base.id}>
                {base.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Asset Type</label>
          <input
            type="text"
            name="assetType"
            value={filters.assetType}
            onChange={handleChange}
            placeholder="e.g., Weapon, Vehicle"
            className="mt-1 block w-full border rounded-md p-2"
          />
        </div>
      </div>

      {/* Asset Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4">Purchases</th>
              <th className="py-3 px-4">Transfers In</th>
              <th className="py-3 px-4">Transfers Out</th>
              <th className="py-3 px-4">Net Movement</th>
              <th className="py-3 px-4">Assigned</th>
              <th className="py-3 px-4">Expended</th>
              <th className="py-3 px-4">Closing</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((item, index) => (
              <tr key={index} className="text-gray-700 text-sm border-t">
                <td className="py-2 px-4 font-medium">{item.assetName}</td>
                <td className="py-2 px-4 text-center">{item.purchases}</td>
                <td className="py-2 px-4 text-center">{item.transfersIn}</td>
                <td className="py-2 px-4 text-center">{item.transfersOut}</td>
                <td className="py-2 px-4 text-center">{item.netMovement}</td>
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

export default DashboardAdmin;
