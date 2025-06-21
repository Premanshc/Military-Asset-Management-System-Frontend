import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TransfersPage = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [bases, setBases] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [form, setForm] = useState({ assetId: '', toBaseId: '', quantity: '' });
  const [filters, setFilters] = useState({ assetId: '', fromBaseId: '', toBaseId: '', startDate: '', endDate: '' });

  // Fetch assets and bases
  useEffect(() => {
    const fetchAssetsAndBases = async () => {
      try {
        const [assetsRes, basesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/assets`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bases`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAssets(assetsRes.data);
        setBases(basesRes.data);
      } catch (err) {
        console.error('Error fetching assets/bases:', err);
      }
    };
    fetchAssetsAndBases();
  }, [token]);

  const fetchTransfers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transfers?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransfers(res.data);
    } catch (err) {
      console.error('Error fetching transfers:', err);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [filters, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/transfers`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ assetId: '', toBaseId: '', quantity: '' });
      fetchTransfers();
    } catch (err) {
      console.error('Error creating transfer:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Record Transfer</h1>

      <form onSubmit={handleSubmit} className="mb-10 bg-white p-4 shadow rounded-md grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          name="assetId"
          value={form.assetId}
          onChange={(e) => setForm({ ...form, assetId: e.target.value })}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Asset</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          name="toBaseId"
          value={form.toBaseId}
          onChange={(e) => setForm({ ...form, toBaseId: e.target.value })}
          required
          className="p-2 border rounded"
        >
          <option value="">Select Target Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
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
        <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Transfer</button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Transfer History</h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          name="assetId"
          value={filters.assetId}
          onChange={(e) => setFilters({ ...filters, assetId: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Assets</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <select
          name="fromBaseId"
          value={filters.fromBaseId}
          onChange={(e) => setFilters({ ...filters, fromBaseId: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">From Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          name="toBaseId"
          value={filters.toBaseId}
          onChange={(e) => setFilters({ ...filters, toBaseId: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">To Base</option>
          {bases.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="p-2 border rounded w-1/2"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="p-2 border rounded w-1/2"
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Asset</th>
              <th className="py-3 px-4 text-left">From Base</th>
              <th className="py-3 px-4 text-left">To Base</th>
              <th className="py-3 px-4 text-center">Quantity</th>
              <th className="py-3 px-4 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t, index) => (
              <tr key={index} className="text-gray-700 text-sm border-t">
                <td className="py-2 px-4">{t.asset.name}</td>
                <td className="py-2 px-4">{t.fromBase.name}</td>
                <td className="py-2 px-4">{t.toBase.name}</td>
                <td className="py-2 px-4 text-center">{t.quantity}</td>
                <td className="py-2 px-4 text-center">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransfersPage;
