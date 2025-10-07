import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft } from 'lucide-react';
import Image from "next/image";


interface ReportsSectionProps {
  onBack: () => void;
}

export function ReportsSection({ onBack }: ReportsSectionProps) {
  const weeklyData = [
    { item: 'Laptop', quantity: '5', amount: '$5,000', status: 'Delivered' },
    { item: 'Projector', quantity: '2', amount: '$1,200', status: 'In Transit' },
    { item: 'Software License', quantity: '10', amount: '$2,500', status: 'Pending' },
    { item: 'Office Supplies', quantity: '20', amount: '$300', status: 'Delivered' },
    { item: 'Training Materials', quantity: '15', amount: '$450', status: 'Delivered' }
  ];

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
                src="/img/logo.svg"
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
                  <TableHead className="text-gray-700 font-medium">Item</TableHead>
                  <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                  <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-700 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeklyData.map((row, index) => (
                  <TableRow key={index} className="border-b border-gray-200">
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