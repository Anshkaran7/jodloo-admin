import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

type PromoCode = {
  id: number;
  name: string;
  code: string;
  discount: number;
};

type PromoCodeTableProps = {
  promoCodes: PromoCode[];
  searchQuery: string;
};

const PromoCodeTable: React.FC<PromoCodeTableProps> = ({ promoCodes, searchQuery }) => {
  const filteredPromoCodes = promoCodes.filter(
    (promoCode) =>
      (promoCode.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
      (promoCode.code?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPromoCodes.length > 0 ? (
            filteredPromoCodes.map((promoCode) => (
              <TableRow key={promoCode.id}>
                <TableCell>{promoCode.name}</TableCell>
                <TableCell>{promoCode.code}</TableCell>
                <TableCell>{promoCode.discount}%</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromoCodeTable;
