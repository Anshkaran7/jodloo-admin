'use client'

import { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { toast, Toaster } from 'react-hot-toast';

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', isPremium: false, subscriptionDate: '2024-01-01' },
  { id: 2, name: 'Bob', email: 'bob@example.com', isPremium: true, subscriptionDate: '2024-01-10' },
];

const SubscriptionManagementPage: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    users.forEach(user => {
      const today = new Date();
      const subscriptionDate = new Date(user.subscriptionDate);
      const diffTime = Math.abs(subscriptionDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (user.isPremium && diffDays <= 7) {
        toast(`Reminder: ${user.name}'s premium subscription is about to expire in ${diffDays} days.`);
      }
      if (!user.isPremium) {
        toast(`Hey ${user.name}, consider upgrading to a premium subscription!`);
      }
    });
  }, [users]);

  const togglePremiumStatus = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isPremium: !user.isPremium } : user
    ));
  };

  const setSubscription = (id: number, days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    setUsers(users.map(user =>
      user.id === id ? { ...user, subscriptionDate: newDate.toISOString().split('T')[0] } : user
    ));
  };

  return (
    <div className="p-4">
      <Toaster />
      <h1 className="text-2xl font-bold text-[#003654] mb-4">Subscription Management</h1>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Premium Status</TableHead>
              <TableHead>Subscription Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id} className="text-center">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isPremium ? 'Premium' : 'Standard'}</TableCell>
                <TableCell>{user.subscriptionDate}</TableCell>
                <TableCell className="space-y-2">
                  <button
                    className={`px-2 py-1 rounded ${user.isPremium ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    onClick={() => togglePremiumStatus(user.id)}
                  >
                    {user.isPremium ? 'Deactivate Premium' : 'Activate Premium'}
                  </button>
                  <div className="flex space-x-2 justify-center">
                    {[7, 15, 30, 90].map(days => (
                      <button
                        key={days}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                        onClick={() => setSubscription(user.id, days)}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
