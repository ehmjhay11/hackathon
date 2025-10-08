import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface ReportSectionProps {
  onBack: () => void;
}

export function ReportSection({ onBack }: ReportSectionProps) {
  const weeklyData = [
    { date: "2025-10-01", item: "Lego Education WeDo", quantity: "1", amount: "₱2,200", status: "Delivered" },
    { date: "2025-10-02", item: "Filament (PLA+)", quantity: "5", amount: "₱1,750", status: "In Transit" },
    { date: "2025-10-03", item: "Arduino", quantity: "10", amount: "₱2,500", status: "Pending" },
    { date: "2025-10-04", item: "Office Supplies", quantity: "20", amount: "₱300", status: "Delivered" },
    { date: "2025-10-05", item: "Training Materials", quantity: "15", amount: "₱450", status: "Delivered" },
  ];

  const donationData = [
    { date: "2025-10-01", donor: "Alice", amount: "₱500", method: "Credit Card" },
    { date: "2025-10-02", donor: "Bob", amount: "₱300", method: "PayPal" },
    { date: "2025-10-03", donor: "Charlie", amount: "₱700", method: "Bank Transfer" },
    { date: "2025-10-04", donor: "Diana", amount: "₱200", method: "Credit Card" },
    { date: "2025-10-05", donor: "Ethan", amount: "₱150", method: "Cash" },
    { date: "2025-10-06", donor: "Fiona", amount: "₱400", method: "PayPal" },
    { date: "2025-10-07", donor: "George", item: "Chairs", quantity: "10" },
  ];

  const COLORS = ["#ff8c00", "#4a5568", "#3182ce", "#38a169", "#e53e3e"];
  const [period, setPeriod] = useState<"thisMonth" | "all">("thisMonth");
  const [donationView, setDonationView] = useState<"money" | "items">("money");

  // Separate money vs. item donations
  const moneyDonations = donationData.filter((d) => d.amount);
  const itemDonations = donationData.filter((d) => d.item);

  // Pie chart data
  const pieData = useMemo(() => {
    const serviceUsageRecords = [
      { service: "3D Printer", date: "2025-10-02" },
      { service: "3D Printer", date: "2025-10-05" },
      { service: "Printer", date: "2025-10-01" },
      { service: "Printer", date: "2025-09-15" },
      { service: "Soldering", date: "2025-09-10" },
      { service: "Tools", date: "2025-08-20" },
      { service: "Components", date: "2025-10-03" },
      { service: "Components", date: "2025-09-30" },
      { service: "Components", date: "2025-10-04" },
      { service: "Printer", date: "2025-10-06" },
    ];

    const now = new Date();
    const filtered = serviceUsageRecords.filter((r) => {
      if (period === "all") return true;
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {/* Back Button */}
            <Button
              onClick={onBack}
              className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2 px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex items-center">
              <Image
                src="/img/logo.png"
                alt="Sorsogon Community Innovation Labs"
                width={32}
                height={32}
                className="w-8 h-8 mr-3"
              />
              <div className="text-left">
                <div className="text-white text-sm">SORSOGON COMMUNITY INNOVATIONS LABS</div>
              </div>
            </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#4a5568] rounded-lg p-6 mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl mb-2">Service Usage</h2>
              <p className="text-gray-300 text-sm">Most frequently used services</p>
            </div>
            <div className="space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  period === "thisMonth" ? "bg-orange-600 text-white" : "bg-gray-600 text-white"
                }`}
                onClick={() => setPeriod("thisMonth")}
              >
                This Month
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  period === "all" ? "bg-orange-600 text-white" : "bg-gray-600 text-white"
                }`}
                onClick={() => setPeriod("all")}
              >
                All Time
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center items-center" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
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

        {/* Donation Report */}
        <div className="bg-[#4a5568] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-white text-xl mb-2">Donations</h2>
              <p className="text-gray-300 text-sm">Thank you for your Donations!</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={donationView === "money" ? "default" : "outline"}
                onClick={() => setDonationView("money")}
              >
                Money
              </Button>
              <Button
                variant={donationView === "items" ? "default" : "outline"}
                onClick={() => setDonationView("items")}
              >
                Items
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden">
            {donationView === "money" ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-medium">Date</TableHead>
                    <TableHead className="text-gray-700 font-medium">Donor</TableHead>
                    <TableHead className="text-gray-700 font-medium">Amount</TableHead>
                    <TableHead className="text-gray-700 font-medium">Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moneyDonations.map((row, index) => (
                    <TableRow key={index} className="border-b border-gray-200">
                      <TableCell className="text-gray-800">{row.date}</TableCell>
                      <TableCell className="text-gray-800">{row.donor}</TableCell>
                      <TableCell className="text-gray-800">{row.amount}</TableCell>
                      <TableCell className="text-gray-800">{row.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-medium">Date</TableHead>
                    <TableHead className="text-gray-700 font-medium">Donor</TableHead>
                    <TableHead className="text-gray-700 font-medium">Item</TableHead>
                    <TableHead className="text-gray-700 font-medium">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemDonations.map((row, index) => (
                    <TableRow key={index} className="border-b border-gray-200">
                      <TableCell className="text-gray-800">{row.date}</TableCell>
                      <TableCell className="text-gray-800">{row.donor}</TableCell>
                      <TableCell className="text-gray-800">{row.item}</TableCell>
                      <TableCell className="text-gray-800">{row.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-white text-sm">
              Total: ₱2,250 | Donations: {donationView === "money" ? moneyDonations.length : itemDonations.length}
            </div>
            <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6">
              Export Report
            </Button>
          </div>
        </div>

        {/* Weekly Report */}
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          row.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : row.status === "In Transit"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-white text-sm">Total: ₱7,500 | Items: 51</div>
            <Button className="bg-[#ff8c00] hover:bg-[#e67e00] text-white rounded-md px-6">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
