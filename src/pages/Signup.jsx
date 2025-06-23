import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    baseId: '',
    role: 'COMMANDER',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      baseId: Number(form.baseId), // convert to number
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, payload);
    navigate('/');
  } catch (err) {
    setError('Registration failed. Please check your info.');
    console.error('Signup error:', err.response?.data || err.message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="number"
          name="baseId"
          placeholder="Base ID"
          value={form.baseId}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="COMMANDER">Commander</option>
          <option value="LOGISTICS">Logistics Officer</option>
          <option value="ADMIN">Admin</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
