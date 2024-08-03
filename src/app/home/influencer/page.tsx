'use client'

import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const initialInfluencerData = [
  {
    influencer: 'Alice',
    promoCode: 'NEWYEAR',
    subscribers: [
      { id: 1, name: 'John Doe', date: '2024-01-01' },
      { id: 2, name: 'Jane Smith', date: '2024-01-02' },
    ],
  },
  {
    influencer: 'Bob',
    promoCode: 'SUMMER',
    subscribers: [
      { id: 3, name: 'Michael Brown', date: '2024-02-01' },
    ],
  },
];

const InfluencerDataPage: React.FC = () => {
  const [influencerData] = useState(initialInfluencerData);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#003654] mb-4">Influencer Data</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Influencer</TableHead>
              <TableHead>Promo Code</TableHead>
              <TableHead>Subscribers Brought In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencerData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.influencer}</TableCell>
                <TableCell>{data.promoCode}</TableCell>
                <TableCell>{data.subscribers.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <h2 className="text-xl font-bold text-[#003654] mt-4">Subscriber Details</h2>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>
            <TableHead>Subscriber Name</TableHead>
            <TableHead>Date Subscribed</TableHead>
            <TableHead>Influencer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {influencerData.flatMap((data) =>
            data.subscribers.map((subscriber) => (
              <TableRow key={subscriber.id}>
                <TableCell>{subscriber.name}</TableCell>
                <TableCell>{subscriber.date}</TableCell>
                <TableCell>{data.influencer}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InfluencerDataPage;
