'use client'

import React, { useState } from 'react';
import { ColumnDef, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, SortingState, ColumnFiltersState, VisibilityState, flexRender } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type NPSRating = {
  id: number;
  customer: string;
  rating: number;
  reviewDate: string;
  segment: string;
  promoCode: string;
};

const initialNPSRatings: NPSRating[] = [
  { id: 1, customer: 'Alice', rating: 9, reviewDate: '2024-01-01', segment: 'VIP', promoCode: 'NEWYEAR' },
  { id: 2, customer: 'Bob', rating: 6, reviewDate: '2024-01-02', segment: 'Regular', promoCode: 'SUMMER' },
  { id: 3, customer: 'Charlie', rating: 3, reviewDate: '2024-01-03', segment: 'VIP', promoCode: 'NEWYEAR' },
  // Add more ratings as needed
];

const columns: ColumnDef<NPSRating>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Rating
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'reviewDate',
    header: 'Review Date',
    cell: ({ getValue }) => format(parseISO(getValue<string>()), 'yyyy-MM-dd'),
  },
  {
    accessorKey: 'segment',
    header: 'Segment',
  },
  {
    accessorKey: 'promoCode',
    header: 'Promo Code',
  },
];

const calculateNPS = (ratings: NPSRating[]) => {
  const promoters = ratings.filter(rating => rating.rating >= 9).length;
  const passives = ratings.filter(rating => rating.rating >= 7 && rating.rating <= 8).length;
  const detractors = ratings.filter(rating => rating.rating <= 6).length;
  const total = ratings.length;

  const npsScore = ((promoters - detractors) / total) * 100;

  return {
    npsScore: npsScore.toFixed(2),
    promoters,
    passives,
    detractors,
    promoterPercentage: ((promoters / total) * 100).toFixed(2),
    passivePercentage: ((passives / total) * 100).toFixed(2),
    detractorPercentage: ((detractors / total) * 100).toFixed(2),
  };
};

const NPSPage: React.FC = () => {
  const [ratings, setRatings] = useState<NPSRating[]>(initialNPSRatings);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    data: ratings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const npsMetrics = calculateNPS(ratings);

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      let filteredRatings = initialNPSRatings;
      if (dateRange[0] && dateRange[1]) {
        filteredRatings = filteredRatings.filter(rating =>
          new Date(rating.reviewDate) >= dateRange[0]! && new Date(rating.reviewDate) <= dateRange[1]!
        );
      }
      if (selectedSegment) {
        filteredRatings = filteredRatings.filter(rating => rating.segment === selectedSegment);
      }
      if (selectedPromoCode) {
        filteredRatings = filteredRatings.filter(rating => rating.promoCode === selectedPromoCode);
      }
      setRatings(filteredRatings);
      setLoading(false);
    }, 500); // Simulate a loading time
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Customer', 'Rating', 'Review Date', 'Segment', 'Promo Code']],
      body: ratings.map(rating => [rating.customer, rating.rating, rating.reviewDate, rating.segment, rating.promoCode]),
    });
    doc.save('nps-data.pdf');
  };

  const npsDataForChart = ratings.map(rating => ({
    date: rating.reviewDate,
    rating: rating.rating,
  }));

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#003654] mb-4">NPS Data</h1>
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col w-full md:w-auto">
            <label className="mb-1">Date Range:</label>
            <DatePicker
              selectsRange
              startDate={dateRange[0] || undefined}
              endDate={dateRange[1] || undefined}
              onChange={(update: [Date | null, Date | null]) => {
                setDateRange(update);
              }}
              isClearable
              placeholderText="Select a date range"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col w-full md:w-auto">
            <label className="mb-1">Segment:</label>
            <Input
              placeholder="Enter segment"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="flex flex-col w-full md:w-auto">
            <label className="mb-1">Promo Code:</label>
            <Input
              placeholder="Enter promo code"
              value={selectedPromoCode}
              onChange={(e) => setSelectedPromoCode(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        <Button onClick={handleFilter} className="mt-4">Filter</Button>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap gap-4">
          <div>Net Promoter Score (NPS): {npsMetrics.npsScore}</div>
          <div>Promoters: {npsMetrics.promoters} ({npsMetrics.promoterPercentage}%)</div>
          <div>Passives: {npsMetrics.passives} ({npsMetrics.passivePercentage}%)</div>
          <div>Detractors: {npsMetrics.detractors} ({npsMetrics.detractorPercentage}%)</div>
        </div>
      </div>
      <div className="mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={npsDataForChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <CSVLink data={ratings} filename="nps-data.csv">
          <Button variant="outline">Export CSV</Button>
        </CSVLink>
        <Button onClick={exportPDF} variant="outline">Export PDF</Button>
      </div>
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-2 md:mb-0">
                      Showing {table.getRowModel().rows.length} of {initialNPSRatings.length} results
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Next
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </>
        )}
      </div>
    </div>
  );
};

export default NPSPage;
