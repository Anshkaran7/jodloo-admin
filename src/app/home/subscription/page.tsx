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
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser } from '@fortawesome/free-solid-svg-icons';
const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', isPremium: false, subscriptionDate: '2024-01-01', premiumDaysLeft: 0 },
  { id: 2, name: 'Bob', email: 'bob@example.com', isPremium: true, subscriptionDate: '2024-01-10', premiumDaysLeft: 15 },
];

const SubscriptionManagementPage: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    users.forEach(user => {
      if (user.isPremium && user.premiumDaysLeft <= 7) {
        toast(`Reminder: ${user.name}'s premium subscription is about to expire in ${user.premiumDaysLeft} days.`);
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
      user.id === id ? { ...user, subscriptionDate: newDate.toISOString().split('T')[0], premiumDaysLeft: days } : user
    ));
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grantPremiumToNewUsers = (days: number) => {
    setUsers(users.map(user =>
      !user.isPremium ? { ...user, isPremium: true, subscriptionDate: new Date().toISOString().split('T')[0], premiumDaysLeft: days } : user
    ));
  };

  const totalPremiumUsers = users.filter(user => user.isPremium).length;
  const totalFreeUsers = users.filter(user => !user.isPremium).length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold text-[#003654] mb-6">Subscription Management</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow mr-4 p-2 border border-gray-300 rounded-lg shadow-sm"
        />
        <Button onClick={() => grantPremiumToNewUsers(30)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
          Grant 30 Days Premium to New Users
        </Button>
      </div>

      <div className="mb-6 p-6 bg-white rounded-lg shadow-lg flex justify-between items-center">
  <div className="flex items-center space-x-4">
    <div className="p-4 bg-green-100 text-green-600 rounded-full">
      <FontAwesomeIcon icon={faUserShield} className="text-2xl" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{totalPremiumUsers}</div>
      <div className="text-sm font-medium text-gray-500">Total Premium Users</div>
    </div>
  </div>
  <div className="flex items-center space-x-4">
    <div className="p-4 bg-gray-100 text-gray-600 rounded-full">
      <FontAwesomeIcon icon={faUser} className="text-2xl" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{totalFreeUsers}</div>
      <div className="text-sm font-medium text-gray-500">Total Free Users</div>
    </div>
  </div>
</div>
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Premium Status</TableHead>
              <TableHead>Subscription Date</TableHead>
              <TableHead>Premium Days Left</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => (
              <TableRow key={user.id} className="text-center">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-white ${user.isPremium ? 'bg-green-500' : 'bg-gray-500'}`}>
                    {user.isPremium ? 'Premium' : 'Standard'}
                  </span>
                </TableCell>
                <TableCell>{user.subscriptionDate}</TableCell>
                <TableCell>{user.premiumDaysLeft}</TableCell>
                <TableCell className="space-y-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${user.isPremium ? 'bg-red-500' : 'bg-green-500'} hover:${user.isPremium ? 'bg-red-600' : 'bg-green-600'}`}
                    onClick={() => togglePremiumStatus(user.id)}
                  >
                    {user.isPremium ? 'Deactivate Premium' : 'Activate Premium'}
                  </button>
                  <div className="flex space-x-2 justify-center">
                    {[7, 15, 30, 60, 90].map(days => (
                      <button
                        key={days}
                        className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
