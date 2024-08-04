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
import { Toaster } from 'react-hot-toast';

type Subscriber = {
  id: number;
  name: string;
  date: string;
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
      { id: 1, name: 'John Doe', date: '2024-01-01' },
      { id: 2, name: 'Jane Smith', date: '2024-01-02' },
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
      { id: 3, name: 'Michael Brown', date: '2024-02-01' },
    ],
  },
];

const InfluencerDataPage: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>(initialInfluencers);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const filteredInfluencers = initialInfluencers.filter(influencer =>
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.promoCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setInfluencers(filteredInfluencers);
  }, [searchQuery]);

  return (
    <div className="p-4">
      <Toaster position='bottom-right'/>
      <h1 className="text-3xl font-bold text-[#003654] mb-8">Influencer Data</h1>
      
      <div className="mb-4">
        <Input
          placeholder="Search by name or promo code"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {influencers.map((influencer) => (
          <Card key={influencer.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-[#003654] text-white p-4">
              <CardTitle className="text-xl font-semibold">{influencer.name}</CardTitle>
              <CardDescription className="text-sm">Promo Code: {influencer.promoCode}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="text-sm font-medium">Total Users</div>
                <div className="text-lg font-semibold">{influencer.totalUsers}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Total Paid Subscribers</div>
                <div className="text-lg font-semibold">{influencer.totalPaidSubscribers}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Paid Subscribers This Month</div>
                <div className="text-lg font-semibold">{influencer.paidSubscribersThisMonth}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Promo Code Validity</div>
                <div className={`text-lg font-semibold ${influencer.promoCodeValidity > new Date() ? 'text-green-500' : 'text-red-500'}`}>
                  {influencer.promoCodeValidity > new Date() ? 'Valid' : 'Expired'}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Days Left for Promo Code</div>
                <div className="text-lg font-semibold">{differenceInDays(influencer.promoCodeValidity, new Date())}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Total Paid</div>
                <div className="text-lg font-semibold">${influencer.paymentDetails.totalPaid}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm font-medium">Pending Payment</div>
                <div className="text-lg font-semibold">${influencer.paymentDetails.pendingPayment}</div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-100 p-4">
              <div className="text-sm text-gray-600">Last updated: {format(new Date(), 'yyyy-MM-dd')}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-[#003654] mb-4">Subscribers Details</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subscriber Name</TableHead>
            <TableHead>Date Subscribed</TableHead>
            <TableHead>Influencer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencers.flatMap((influencer) =>
            influencer.subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.name}</TableCell>
                <TableCell>{format(new Date(subscriber.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell>{influencer.name}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfluencerDataPage;
