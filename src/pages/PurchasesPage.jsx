import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PurchasesPage = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [form, setForm] = useState({ assetId: '', quantity: '' });
  const [filters, setFilters] = useState({ assetId: '', startDate: '', endDate: '' });

  // Fetch assets for dropdown
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/assets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets(res.data);
      } catch (err) {
        console.error('Error fetching assets:', err);
      }
    };
    fetchAssets();
  }, [token]);

  // Fetch purchases with optional filters
  const fetchPurchases = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/purchases?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchases(res.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [filters, token]);

  // Create purchase
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/purchases`,
        {
          assetId: parseInt(form.assetId),
          quantity: parseInt(form.quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ assetId: '', quantity: '' });
      fetchPurchases();
    } catch (err) {
      console.error('Error creating purchase:', err);
      alert('Failed to record purchase');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Record Purchase</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white p-4 shadow rounded-md grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <select
          name="assetId"
          value={form.assetId}
          onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          placeholder="Quantity"
          className="p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">
          Add Purchase
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Purchase History</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          name="assetId"
          value={filters.assetId}
          onChange={(e) => setFilters({ ...filters, assetId: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Assets</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4 text-left">Base</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p, index) => (
              <tr key={index} className="text-gray-700 text-sm border-t">
                <td className="py-2 px-4">{p.asset.name}</td>
                <td className="py-2 px-4">{p.base.name}</td>
                <td className="py-2 px-4 text-center">{p.quantity}</td>
                <td className="py-2 px-4 text-center">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasesPage;
