import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DashboardCommander = () => {
  const { token, user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/assets/base/${user.baseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssets(res.data);
      } catch (err) {
        console.error('Failed to fetch assets:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.baseId) fetchAssets();
  }, [token, user]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Commander Dashboard</h1>

      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.assetName} className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{asset.assetName}</h2>
              <p className="text-sm text-gray-600">Type: {asset.assetType}</p>
              <div className="mt-3 text-sm space-y-1">
                <p>Purchased: {asset.purchases}</p>
                <p>Transfers In: {asset.transfersIn}</p>
                <p>Transfers Out: {asset.transfersOut}</p>
                <p>Assigned: {asset.assigned}</p>
                <p>Expended: {asset.expended}</p>
                <p className="font-bold">Closing Balance: {asset.closingBalance}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardCommander;
