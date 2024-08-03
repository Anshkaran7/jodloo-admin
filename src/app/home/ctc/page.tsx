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

type Review = {
  id: number;
  customer: string;
  rating: number;
  reviewDate: string;
  segment: string;
  promoCode: string;
};

const initialReviews: Review[] = [
  { id: 1, customer: 'Alice', rating: 5, reviewDate: '2024-01-01', segment: 'VIP', promoCode: 'NEWYEAR' },
  { id: 2, customer: 'Bob', rating: 4, reviewDate: '2024-01-02', segment: 'Regular', promoCode: 'SUMMER' },
  { id: 3, customer: 'Charlie', rating: 5, reviewDate: '2024-01-03', segment: 'VIP', promoCode: 'NEWYEAR' },
  // Add more reviews as needed
];

const columns: ColumnDef<Review>[] = [
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

const CTCPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedSegment, setSelectedSegment] = useState<string>('');
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    data: reviews,
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

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const fiveStarCount = reviews.filter(review => review.rating === 5).length;
  const fiveStarPercentage = (fiveStarCount / reviews.length) * 100;

  const handleFilter = () => {
    setLoading(true);
    setTimeout(() => {
      let filteredReviews = initialReviews;
      if (dateRange[0] && dateRange[1]) {
        filteredReviews = filteredReviews.filter(review =>
          new Date(review.reviewDate) >= dateRange[0]! && new Date(review.reviewDate) <= dateRange[1]!
        );
      }
      if (selectedSegment) {
        filteredReviews = filteredReviews.filter(review => review.segment === selectedSegment);
      }
      if (selectedPromoCode) {
        filteredReviews = filteredReviews.filter(review => review.promoCode === selectedPromoCode);
      }
      setReviews(filteredReviews);
      setLoading(false);
    }, 500); // Simulate a loading time
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Customer', 'Rating', 'Review Date', 'Segment', 'Promo Code']],
      body: reviews.map(review => [review.customer, review.rating, review.reviewDate, review.segment, review.promoCode]),
    });
    doc.save('ctc-data.pdf');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#003654] mb-4">CTC Data</h1>
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
      <div className="mb-8">
  <h2 className="text-xl font-semibold text-[#003654] mb-4">Statistics</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
      <div className="w-16 h-16 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
        <span className="text-2xl font-bold">{averageRating.toFixed(2)}</span>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-[#003654]">Average Rating</p>
        <p className="text-sm text-gray-500">Based on user reviews</p>
      </div>
    </div>
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
      <div className="w-16 h-16 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
        <span className="text-2xl font-bold">{fiveStarCount}</span>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-[#003654]">5-Star Ratings</p>
        <p className="text-sm text-gray-500">Total number of 5-star ratings</p>
      </div>
    </div>
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center">
      <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full">
        <span className="text-2xl font-bold">{fiveStarPercentage.toFixed(2)}%</span>
      </div>
      <div className="ml-4">
        <p className="text-lg font-semibold text-[#003654]">5-Star Percentage</p>
        <p className="text-sm text-gray-500">Percentage of 5-star ratings</p>
      </div>
    </div>
  </div>
</div>

      <div className="mb-4 flex flex-wrap gap-4">
        <CSVLink data={reviews} filename="ctc-data.csv">
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
                  <div className="flex justify-between items-center">
                    <div>
                      Showing {table.getRowModel().rows.length} of {initialReviews.length} results
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

export default CTCPage;
