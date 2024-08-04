'use client'

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active' },
  { id: 2, name: 'Bob', email: 'bob@example.com', status: 'inactive' },
];

const initialLogs = [
  { id: 1, user: 'Alice', activity: 'Logged in', timestamp: '2024-01-01 10:00:00' },
  { id: 2, user: 'Bob', activity: 'Logged out', timestamp: '2024-01-01 11:00:00' },
];

const initialPerformance = [
  { id: 1, promoCode: 'NEWYEAR', influencer: 'Alice', subscribers: [
    { id: 1, name: 'John Doe', date: '2024-01-01' },
    { id: 2, name: 'Jane Smith', date: '2024-01-02' },
  ]},
  { id: 2, promoCode: 'SUMMER', influencer: 'Bob', subscribers: [
    { id: 3, name: 'Michael Brown', date: '2024-02-01' },
  ]},
];

const ManagementPage: React.FC = () => {
  const [users, setUsers] = useState(initialUsers);
  const [logs] = useState(initialLogs);
  const [performanceData] = useState(initialPerformance);

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
  };

  const chartData = performanceData.map(performance => ({
    promoCode: performance.promoCode,
    influencer: performance.influencer,
    subscribers: performance.subscribers.length,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#003654] mb-4 md:mb-6 lg:mb-8">Management Dashboard</h1>
      <Tab.Group>
        <Tab.List className="flex flex-wrap space-x-1 bg-blue-900/90 p-1 rounded-lg">
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white text-blue-700 py-2 px-4 text-sm font-medium leading-5 rounded-lg'
                : 'text-white hover:bg-white/[0.12] hover:text-white py-2 px-4 text-sm font-medium leading-5 rounded-lg'
            }
          >
            User Accounts
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white text-blue-700 py-2 px-4 text-sm font-medium leading-5 rounded-lg'
                : 'text-white hover:bg-white/[0.12] hover:text-white py-2 px-4 text-sm font-medium leading-5 rounded-lg'
            }
          >
            User Logs
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white text-blue-700 py-2 px-4 text-sm font-medium leading-5 rounded-lg'
                : 'text-white hover:bg-white/[0.12] hover:text-white py-2 px-4 text-sm font-medium leading-5 rounded-lg'
            }
          >
            Performance
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 md:mt-4 lg:mt-6">
          <Tab.Panel className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <button
                        className={`px-2 py-1 rounded ${user.status === 'active' ? 'bg-red-500' : 'bg-green-500'} text-white`}
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab.Panel>
          <Tab.Panel className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.activity}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab.Panel>
          <Tab.Panel className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>Influencer</TableHead>
                  <TableHead>Subscribers Brought In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map(performance => (
                  <TableRow key={performance.id}>
                    <TableCell>{performance.promoCode}</TableCell>
                    <TableCell>{performance.influencer}</TableCell>
                    <TableCell>{performance.subscribers.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#003654] mt-4 md:mt-6 lg:mt-8">Subscriber Details</h2>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead>Subscriber Name</TableHead>
                  <TableHead>Date Subscribed</TableHead>
                  <TableHead>Influencer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.flatMap((performance) =>
                  performance.subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.name}</TableCell>
                      <TableCell>{subscriber.date}</TableCell>
                      <TableCell>{performance.influencer}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="mt-4 md:mt-6 lg:mt-8 w-full">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="promoCode" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="subscribers" fill="#0080C7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ManagementPage;
