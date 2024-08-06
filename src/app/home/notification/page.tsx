'use client'

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowsUpDown, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '@headlessui/react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast, Toaster } from 'react-hot-toast';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@/components/ui/Modal';

type User = {
  id: number;
  name: string;
  email: string;
};

const initialUsers: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  // Add more users as needed
];

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
        <FontAwesomeIcon icon={
          column.getIsSorted() === 'asc' ? faArrowsUpDown : faChevronDown
        } className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
];

const NotificationsPage: React.FC = () => {
  const [users] = useState<User[]>(initialUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState<Date | null>(null);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(['Goals', 'Investments', 'Budget', 'Udhaar', 'Transactions']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interval, setInterval] = useState('');

  const table = useReactTable<User>({
    data: users,
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

  const handleSendNotification = () => {
    const selectedUsers = table.getSelectedRowModel().rows.map((row) => row.original);
    if (selectedUsers.length === 0 || message.trim() === '' || category === '') {
      toast.error('Please select users, enter a message, and choose a category.');
      return;
    }

    // Implement the logic to send notification here
    // For now, we'll just show a success message
    toast.success('Notification sent successfully.');

    // Reset form
    setRowSelection({});
    setMessage('');
    setScheduleDate(null);
    setInterval('');
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      toast.success('Category added successfully.');
      setIsModalOpen(false);
    } else {
      toast.error('Please enter a valid category name.');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    if (!['Goals', 'Investments', 'Budget', 'Udhaar', 'Transactions'].includes(cat)) {
      setCategories(categories.filter(category => category !== cat));
      toast.success('Category deleted successfully.');
    } else {
      toast.error('Default categories cannot be deleted.');
    }
  };

  return (
    <div className="p-4">
      <Toaster position='bottom-right'/>
      <Tab.Group>
        <Tab.List className="flex space-x-1 bg-blue-900/90 p-1 rounded-lg">
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white shadow text-blue-700 py-2.5 px-4 text-sm font-medium rounded-lg'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white py-2.5 px-4 text-sm font-medium rounded-lg'
            }
          >
            Send Notifications
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white shadow text-blue-700 py-2.5 px-4 text-sm font-medium rounded-lg'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white py-2.5 px-4 text-sm font-medium rounded-lg'
            }
          >
            Manage Categories
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <h1 className="text-2xl font-bold text-[#003654] mb-4">Send Notifications</h1>
            <div className="mb-4 flex space-x-4">
              <Button
                className="bg-blue-500 text-white hover:bg-blue-700"
                onClick={() => setMessage('Daily Progress Notification')}
              >
                Daily Progress Notification
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-700"
                onClick={() => setMessage('')}
              >
                Custom Text Notification
              </Button>
            </div>
            {message === 'Daily Progress Notification' && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Control Settings:</h2>
                <div className="mb-4">
                  <label className="block mb-2">Set or adjust timing for daily progress notifications:</label>
                  <DatePicker
                    selected={scheduleDate}
                    onChange={(date: Date | null) => setScheduleDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Schedule Notification"
                    className="p-2 border rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Define intervals:</label>
                  <select
                  title='Select Interval'
                    className="p-2 border rounded-lg w-full"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  >
                    <option value="">Select Interval</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            )}
            {message === '' && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Compose Notification:</h2>
                <div className="mb-4">
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    rows={5}
                    placeholder="Enter your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Set delivery time:</label>
                  <DatePicker
                    selected={scheduleDate}
                    onChange={(date: Date | null) => setScheduleDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    placeholderText="Schedule Notification"
                    className="p-2 border rounded-lg w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Define intervals:</label>
                  <select
                  title='Select Interval'
                    className="p-2 border rounded-lg w-full"
                    value={interval}
                    onChange={(e) => setInterval(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            )}
            <div className="mb-4">
              <select
                title='Select Category'
                className="p-2 border rounded-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <Button onClick={handleSendNotification} className="bg-[#003654] text-white w-full sm:w-auto">Send Notification</Button>
            </div>
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center py-4 flex-wrap gap-2">
                <Input
                  placeholder="Filter emails..."
                  value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('email')?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <FontAwesomeIcon icon={faChevronDown} className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                      >
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
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <h2 className="text-2xl font-bold text-[#003654] my-6">Manage Categories</h2>
            <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat, index) => (
                    <TableRow key={index}>
                      <TableCell>{cat}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCategory(cat)}
                          disabled={['Goals', 'Investments', 'Budget', 'Udhaar', 'Transactions'].includes(cat)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <button
              title="Add Category"
              className="fixed bottom-20 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold text-[#003654] mb-4">Add New Category</h2>
        <div className="mb-4">
          <Input
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full"
          />
        </div>
        <Button onClick={handleAddCategory} className="bg-[#003654] text-white">Add Category</Button>
      </Modal>
    </div>
  );
};

export default NotificationsPage;
