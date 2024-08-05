'use client'

import { useState, useEffect } from 'react';
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast, Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const initialUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', isPremium: false, subscriptionDate: '2024-01-01', premiumDaysLeft: 0 },
  { id: 2, name: 'Bob', email: 'bob@example.com', isPremium: true, subscriptionDate: '2024-01-10', premiumDaysLeft: 15 },
  // Add more user data as needed
]

export type User = {
  id: number
  name: string
  email: string
  isPremium: boolean
  subscriptionDate: string
  premiumDaysLeft: number
}

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "isPremium",
    header: "Premium Status",
    cell: ({ row }) => {
      const isPremium = row.getValue("isPremium")
      return (
        <span className={`px-2 py-1 rounded-full text-white ${isPremium ? 'bg-green-500' : 'bg-gray-500'}`}>
          {isPremium ? 'Premium' : 'Standard'}
        </span>
      )
    },
  },
  {
    accessorKey: "subscriptionDate",
    header: "Subscription Date",
    cell: ({ row }) => (
      <div>{row.getValue("subscriptionDate")}</div>
    ),
  },
  {
    accessorKey: "premiumDaysLeft",
    header: "Premium Days Left",
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("premiumDaysLeft")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id.toString())}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function SubscriptionManagementPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    users.forEach(user => {
      if (user.isPremium && user.premiumDaysLeft <= 7) {
        toast(`Reminder: ${user.name}'s premium subscription is about to expire in ${user.premiumDaysLeft} days.`)
      }
      if (!user.isPremium) {
        toast(`Hey ${user.name}, consider upgrading to a premium subscription!`)
      }
    })
  }, [users])

  const table = useReactTable({
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
  })

  const togglePremiumStatus = (id: number) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isPremium: !user.isPremium } : user
    ))
  }

  const setSubscription = (id: number, days: number) => {
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + days)
    setUsers(users.map(user =>
      user.id === id ? { ...user, subscriptionDate: newDate.toISOString().split('T')[0], premiumDaysLeft: days } : user
    ))
  }

  const grantPremiumToNewUsers = (days: number) => {
    setUsers(users.map(user =>
      !user.isPremium ? { ...user, isPremium: true, subscriptionDate: new Date().toISOString().split('T')[0], premiumDaysLeft: days } : user
    ))
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPremiumUsers = users.filter(user => user.isPremium).length
  const totalFreeUsers = users.filter(user => !user.isPremium).length

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen w-full">
      <Toaster position="bottom-right" />
      <h1 className="text-2xl sm:text-3xl font-bold text-[#003654] mb-4 sm:mb-6">Subscription Management</h1>
      
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <Input
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow sm:mr-4 p-2 border border-gray-300 rounded-lg shadow-sm"
        />
        <Button onClick={() => grantPremiumToNewUsers(30)} className="bg-blue-600 text-white 
        whitespace-normal w-full sm:w-auto
        px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">
          Grant 30 Days Premium to New Users
        </Button>
      </div>

      <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-full">
            <FontAwesomeIcon icon={faUserShield} className="text-2xl" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{totalPremiumUsers}</div>
            <div className="text-sm font-medium text-gray-500">Total Premium Users</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gray-100 text-gray-600 rounded-full">
            <FontAwesomeIcon icon={faUser} className="text-2xl" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-gray-800">{totalFreeUsers}</div>
            <div className="text-sm font-medium text-gray-500">Total Free Users</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg overflow-x-auto">
        <Table className="min-w-full">
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
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="space-y-2 w-[10%]">
                    <button
                      className={`px-4 py-2 rounded-lg w-full text-white ${row.original.isPremium ? 'bg-red-500' : 'bg-green-500'} hover:${row.original.isPremium ? 'bg-red-600' : 'bg-green-600'}`}
                      onClick={() => togglePremiumStatus(row.original.id)}
                    >
                      {row.original.isPremium ? 'Deactivate Premium' : 'Activate Premium'}
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                          Set Subscription Days
                          <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {[7, 15, 30, 60, 90].map(days => (
                          <DropdownMenuItem key={days} onClick={() => setSubscription(row.original.id, days)}>
                            {days} days
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
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
  )
}
