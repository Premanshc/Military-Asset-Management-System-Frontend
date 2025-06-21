import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AssignmentsPage = () => {
  const { token } = useAuth();
  const [assets, setAssets] = useState([]);
  const [view, setView] = useState('assign'); // 'assign' or 'expend'
  const [assignForm, setAssignForm] = useState({ assetId: '', assignedTo: '', quantity: '' });
  const [expendForm, setExpendForm] = useState({ assetId: '', reason: '', quantity: '' });

  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  // Fetch assets
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

  // Fetch assignment & expenditure data
  const fetchAllData = async () => {
    try {
      const [assignRes, expendRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/assignments/assign`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/assignments/expend`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAssignments(assignRes.data);
      setExpenditures(expendRes.data);
    } catch (err) {
      console.error('Error fetching assignment or expenditure data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Handle Assignment Submit
  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/assignments/assign`, assignForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignForm({ assetId: '', assignedTo: '', quantity: '' });
      fetchAllData();
    } catch (err) {
      console.error('Error assigning asset:', err);
    }
  };

  // Handle Expenditure Submit
  const handleExpend = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/assignments/expend`, expendForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpendForm({ assetId: '', reason: '', quantity: '' });
      fetchAllData();
    } catch (err) {
      console.error('Error expending asset:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Assignments & Expenditures</h1>

      {/* Toggle */}
      <div className="flex mb-6">
        <button
          onClick={() => setView('assign')}
          className={`px-4 py-2 rounded-l ${view === 'assign' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          Assign
        </button>
        <button
          onClick={() => setView('expend')}
          className={`px-4 py-2 rounded-r ${view === 'expend' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
        >
          Expend
        </button>
      </div>

      {/* Assign Form */}
      {view === 'assign' && (
        <form onSubmit={handleAssign} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 shadow rounded-md">
          <select
            required
            value={assignForm.assetId}
            onChange={(e) => setAssignForm({ ...assignForm, assetId: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input
            required
            type="text"
            placeholder="Assigned To"
            value={assignForm.assignedTo}
            onChange={(e) => setAssignForm({ ...assignForm, assignedTo: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            required
            type="number"
            placeholder="Quantity"
            value={assignForm.quantity}
            onChange={(e) => setAssignForm({ ...assignForm, quantity: e.target.value })}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Assign</button>
        </form>
      )}

      {/* Expend Form */}
      {view === 'expend' && (
        <form onSubmit={handleExpend} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 shadow rounded-md">
          <select
            required
            value={expendForm.assetId}
            onChange={(e) => setExpendForm({ ...expendForm, assetId: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Select Asset</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <input
            required
            type="text"
            placeholder="Reason"
            value={expendForm.reason}
            onChange={(e) => setExpendForm({ ...expendForm, reason: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            required
            type="number"
            placeholder="Quantity"
            value={expendForm.quantity}
            onChange={(e) => setExpendForm({ ...expendForm, quantity: e.target.value })}
            className="p-2 border rounded"
          />
          <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2">Expend</button>
        </form>
      )}

      {/* History Tables */}
      <h2 className="text-xl font-semibold mb-2">Assignment History</h2>
      <div className="mb-8 overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Base</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, idx) => (
              <tr key={idx} className="text-sm text-gray-700 border-t">
                <td className="py-2 px-4">{a.asset.name}</td>
                <td className="py-2 px-4">{a.assignedTo}</td>
                <td className="py-2 px-4">{a.base.name}</td>
                <td className="py-2 px-4 text-center">{a.quantity}</td>
                <td className="py-2 px-4 text-center">{new Date(a.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold mb-2">Expenditure History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Base</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenditures.map((e, idx) => (
              <tr key={idx} className="text-sm text-gray-700 border-t">
                <td className="py-2 px-4">{e.asset.name}</td>
                <td className="py-2 px-4">{e.reason}</td>
                <td className="py-2 px-4">{e.base.name}</td>
                <td className="py-2 px-4 text-center">{e.quantity}</td>
                <td className="py-2 px-4 text-center">{new Date(e.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentsPage;
