// pages/influencer-data.tsx

'use client'

import { useState, useEffect } from 'react';
import { format, differenceInDays } from 'date-fns';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'react-hot-toast';

type Subscriber = {
  id: number;
  name: string;
  date: string;
  coupon: string;
};

type Influencer = {
  id: number;
  name: string;
  promoCode: string;
  promoCodeValidity: Date;
  totalUsers: number;
  totalPaidSubscribers: number;
  paidSubscribersThisMonth: number;
  paymentDetails: {
    totalPaid: number;
    pendingPayment: number;
  };
  subscribers: Subscriber[];
};

const initialInfluencers: Influencer[] = [
  {
    id: 1,
    name: 'Alice',
    promoCode: 'NEWYEAR',
    promoCodeValidity: new Date('2024-12-31'),
    totalUsers: 1000,
    totalPaidSubscribers: 200,
    paidSubscribersThisMonth: 10,
    paymentDetails: {
      totalPaid: 5000,
      pendingPayment: 1000,
    },
    subscribers: [
      { id: 1, name: 'John Doe', date: '2024-01-01', coupon: 'NEWYEAR' },
      { id: 2, name: 'Jane Smith', date: '2024-01-02', coupon: 'NEWYEAR' },
    ],
  },
  {
    id: 2,
    name: 'Bob',
    promoCode: 'SUMMER',
    promoCodeValidity: new Date('2024-08-31'),
    totalUsers: 1500,
    totalPaidSubscribers: 300,
    paidSubscribersThisMonth: 15,
    paymentDetails: {
      totalPaid: 7000,
      pendingPayment: 1500,
    },
    subscribers: [
      { id: 3, name: 'Michael Brown', date: '2024-02-01', coupon: 'NEWYEAR' },
    ],
  },
];

const InfluencerDataPage: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingInfluencerId, setEditingInfluencerId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ totalPaid: number; pendingPayment: number }>({ totalPaid: 0, pendingPayment: 0 });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const startEditing = (influencer: Influencer) => {
    setEditingInfluencerId(influencer.id);
    setEditValues({
      totalPaid: influencer.paymentDetails.totalPaid,
      pendingPayment: influencer.paymentDetails.pendingPayment,
    });
  };

  const cancelEditing = () => {
    setEditingInfluencerId(null);
    setEditValues({ totalPaid: 0, pendingPayment: 0 });
  };

  const saveChanges = (id: number) => {
    const updatedInfluencers = influencers.map((influencer) =>
      influencer.id === id
        ? {
            ...influencer,
            paymentDetails: {
              ...influencer.paymentDetails,
              ...editValues,
            },
          }
        : influencer
    );
    setInfluencers(updatedInfluencers);
    setEditingInfluencerId(null);
    toast.success('Payment details updated successfully!');
  };

  useEffect(() => {
    const filteredInfluencers = initialInfluencers.filter((influencer) =>
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.promoCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setInfluencers(filteredInfluencers);
  }, [searchQuery]);

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <Toaster position='bottom-right'/>
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#003654] mb-6">Influencer Data</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search by name or promo code"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded-lg shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {influencers.map((influencer) => (
          <Card key={influencer.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="bg-[#003654] text-white p-4">
              <CardTitle className="text-lg md:text-xl font-semibold">{influencer.name}</CardTitle>
              <CardDescription className="text-sm">Promo Code: {influencer.promoCode}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm">Total Users</div>
                <div className="text-lg font-semibold">{influencer.totalUsers}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Total Paid Subscribers</div>
                <div className="text-lg font-semibold">{influencer.totalPaidSubscribers}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Paid Subscribers This Month</div>
                <div className="text-lg font-semibold">{influencer.paidSubscribersThisMonth}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Promo Code Validity</div>
                <div className={`text-lg font-semibold ${influencer.promoCodeValidity > new Date() ? 'text-green-500' : 'text-red-500'}`}>
                  {influencer.promoCodeValidity > new Date() ? 'Valid' : 'Expired'}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">Days Left for Promo Code</div>
                <div className="text-lg font-semibold">{differenceInDays(influencer.promoCodeValidity, new Date())}</div>
              </div>
              {editingInfluencerId === influencer.id ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Total Paid</div>
                    <Input
                      type="number"
                      value={editValues.totalPaid}
                      onChange={(e) => setEditValues({ ...editValues, totalPaid: parseFloat(e.target.value) })}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Pending Payment</div>
                    <Input
                      type="number"
                      value={editValues.pendingPayment}
                      onChange={(e) => setEditValues({ ...editValues, pendingPayment: parseFloat(e.target.value) })}
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => saveChanges(influencer.id)} className="bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-300">Save</Button>
                    <Button onClick={cancelEditing} className="bg-gray-300 text-black hover:bg-gray-400 transition-colors duration-300">Cancel</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Total Paid</div>
                    <div className="text-lg font-semibold">${influencer.paymentDetails.totalPaid}</div>
                    <Button className="text-sm bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-300" onClick={() => startEditing(influencer)}>Edit</Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">Pending Payment</div>
                    <div className="text-lg font-semibold">${influencer.paymentDetails.pendingPayment}</div>
                    <Button className="text-sm bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-300" onClick={() => startEditing(influencer)}>Edit</Button>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="bg-gray-100 p-4">
              <div className="text-sm text-gray-600">Last updated: {format(new Date(), 'yyyy-MM-dd')}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#003654] mb-4">Subscribers Details</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber Name</TableHead>
              <TableHead>Date Subscribed</TableHead>
              <TableHead>Influencer</TableHead>
              <TableHead>Coupon Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers.flatMap((influencer) =>
              influencer.subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell>{subscriber.name}</TableCell>
                  <TableCell>{format(new Date(subscriber.date), 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{influencer.name}</TableCell>
                  <TableCell>{subscriber.coupon}</TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InfluencerDataPage;
