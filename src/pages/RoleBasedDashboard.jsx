import React from 'react';
import DashboardCommander from './DashboardCommander';
import DashboardLogistics from './DashboardLogistics';
import DashboardAdmin from './DashboardAdmin';
import { useAuth } from '../context/AuthContext';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'COMMANDER':
      return <DashboardCommander />;
    case 'LOGISTICS':
      return <DashboardLogistics />;
    case 'ADMIN':
      return <DashboardAdmin />;
    default:
      return <div className="p-6 text-center">Unauthorized</div>;
  }
};

export default RoleBasedDashboard;
