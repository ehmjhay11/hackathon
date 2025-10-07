import React, { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";


interface ReportSectionProps {
  onBack: () => void;
}

export function ReportSection({ onBack }: ReportSectionProps) {
  const weeklyData = [
    { item: 'Laptop', quantity: '5', amount: '$5,000', status: 'Delivered', date: '2025-10-01' },
    { item: 'Projector', quantity: '2', amount: '$1,200', status: 'In Transit', date: '2025-10-03' },
    { item: 'Software License', quantity: '10', amount: '$2,500', status: 'Pending', date: '2025-09-28' },
    { item: 'Office Supplies', quantity: '20', amount: '$300', status: 'Delivered', date: '2025-09-25' },
    { item: 'Training Materials', quantity: '15', amount: '$450', status: 'Delivered', date: '2025-08-15' }
  ];

  // Example service usage records (each entry represents one use) with dates
  const serviceUsageRecords = [
    { service: '3D Printer', date: '2025-10-02' },
    { service: '3D Printer', date: '2025-10-05' },
    { service: 'Printer', date: '2025-10-01' },
    { service: 'Printer', date: '2025-09-15' },
    { service: 'Soldering', date: '2025-09-10' },
    { service: 'Tools', date: '2025-08-20' },
    { service: 'Components', date: '2025-10-03' },
    { service: 'Components', date: '2025-09-30' },
    { service: 'Components', date: '2025-10-04' },
    { service: 'Printer', date: '2025-10-06' },
  ];
  const COLORS = ['#ff8c00', '#4a5568', '#3182ce', '#38a169', '#e53e3e'];

  const [period, setPeriod] = useState<'thisMonth' | 'all'>('thisMonth');

  // Compute aggregation based on selected period
  const pieData = useMemo(() => {
    const now = new Date();
    const filtered = serviceUsageRecords.filter((r) => {
      if (period === 'all') return true;
      const d = new Date(r.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });

    const counts: Record<string, number> = {};
    filtered.forEach((r) => {
      counts[r.service] = (counts[r.service] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [period]);

  return (
    <div className="min-h-screen bg-[#2d3748]">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mr-4 text-white hover:text-[#ff8c00] hover:bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <Image
                src="/img/logo.png"
                alt="Sorsogon Community Innovation Labs"
                width={32}
                height={32}
                className="w-8 h-8 mr-3"
                />
              <div className="text-left">
                <div className="text-white text-sm">SORSOGON COMMUNITY LABS</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#4a5568] px-4 py-2 rounded">
            <span className="text-white text-sm">Reports Section</span>
          </div>
        </div>

        {/* Pie Chart for Service Usage */}
        <div className="bg-[#4a5568] rounded-lg p-6 mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl mb-2">Service Usage</h2>
              <p className="text-gray-300 text-sm">Most frequently used services</p>
            </div>
            <div className="space-x-2">
              <button
                className={`px-3 py-1 rounded ${period === 'thisMonth' ? 'bg-orange-600 text-white' : 'bg-gray-600 text-white'}`}
                onClick={() => setPeriod('thisMonth')}
              >
                This Month
              </button>
              <button
                className={`px-3 py-1 rounded ${period === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-600 text-white'}`}
                onClick={() => setPeriod('all')}
              >
                All Time
              </button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData as { name: string; value: number }[]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Report Table */}
        <div className="bg-[#4a5568] rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-white text-xl mb-2">Weekly Report</h2>
            <p className="text-gray-300 text-sm">Summary of weekly activities and transactions</p>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                  <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700 font-medium">Date</TableHead>
                  <TableHead className="text-gray-700 font-medium">Item</TableHead>
                  <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                  <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-700 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map((row, index) => (
                  <TableRow key={index} className="border-b border-gray-200">
                    <TableCell className="text-gray-800">{row.date}</TableCell>
                    <TableCell className="text-gray-800">{row.item}</TableCell>
                    <TableCell className="text-gray-800">{row.quantity}</TableCell>
                    <TableCell className="text-gray-800">{row.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        row.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-white text-sm">
              Total: $9,450 | Items: 52
            </div>
            <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}