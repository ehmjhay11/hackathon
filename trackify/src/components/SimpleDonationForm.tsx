"use client";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { ArrowLeft, Heart, DollarSign, Package, Plus, Minus } from 'lucide-react';
import Image from "next/image";

interface SimpleDonationFormProps {
  onBack: () => void;
}

interface ItemDonation {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

export function SimpleDonationForm({ onBack }: SimpleDonationFormProps) {
  const [donationType, setDonationType] = useState<'monetary' | 'item' | null>(null);
  const [formData, setFormData] = useState({
    donorName: '',
    amount: ''
  });
  
  const [itemDonations, setItemDonations] = useState<ItemDonation[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    description: ''
  });

  const [showThankYou, setShowThankYou] = useState(false);

  const addItem = () => {
    if (newItem.name.trim()) {
      const item: ItemDonation = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        quantity: newItem.quantity,
        description: newItem.description.trim()
      };
      setItemDonations([...itemDonations, item]);
      setNewItem({ name: '', quantity: 1, description: '' });
    }
  };

  const removeItem = (id: string) => {
    setItemDonations(itemDonations.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, change: number) => {
    setItemDonations(itemDonations.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let donationData;
      
      if (donationType === 'monetary') {
        donationData = {
          donorName: formData.donorName,
          type: 'monetary' as const,
          amount: parseFloat(formData.amount)
        };
      } else {
        const itemDescription = itemDonations.map(item => 
          `${item.name} (${item.quantity}x)${item.description ? ` - ${item.description}` : ''}`
        ).join(', ');
        
        donationData = {
          donorName: formData.donorName,
          type: 'item' as const,
          itemDescription: itemDescription
        };
      }

      // Submit to API (you can implement this)
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        setShowThankYou(true);
        // Reset form
        setFormData({ donorName: '', amount: '' });
        setItemDonations([]);
        setDonationType(null);

        // Auto-redirect after 3 seconds
        setTimeout(() => {
          setShowThankYou(false);
          onBack();
        }, 3000);
      }
    } catch (error) {
      console.error('Donation submission failed:', error);
      // Handle error (you can add error state here)
    }
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2d3748] transition-opacity duration-500">
        <div className="bg-[#4a5568] text-center p-10 rounded-2xl shadow-lg max-w-md">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-[#ff8c00] animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-gray-200">
            Your generous donation means a lot to us.  
            We truly appreciate your support 💖
          </p>
          <p className="text-gray-400 text-sm mt-4">Redirecting you back to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d3748]">
      {/* Header */}
      <div className="flex p-6 mb-6">
        <Image
          src="/img/logo.svg"
          alt="Sorsogon Community Innovation Labs"
          width={32}
          height={32}
          className="w-16 h-16 mr-3"
        />
        <div className="text-left">
          <div className="text-white text-2xl font-bold">SORSOGON COMMUNITY</div>
          <div className="text-[#ff8c00] text-2xl font-bold">INNOVATION LABS</div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-6 mb-8">
        <Button
          onClick={onBack}
          className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Selection
        </Button>
      </div>

      {/* Donation Form */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#4a5568] rounded-lg p-8 border border-gray-600">
          {/* Service Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">Support Our Cause</h2>
              <p className="text-gray-300 text-sm">Your donation helps sustain and expand our community programs</p>
            </div>
          </div>

          <div className="p-4 mb-6">
            <p className="text-gray-100 text-center">
              Your generous donations help us sustain and expand our initiatives. Every contribution, big or small, 
              makes a meaningful impact by supporting our ongoing projects and community programs.
            </p>
          </div>

          {!donationType ? (
            /* Donation Type Selection */
            <div className="space-y-6">
              <h3 className="text-white text-lg font-semibold text-center mb-6">
                How would you like to contribute?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monetary Donation */}
                <Card 
                  className="bg-[#2d3748] border-gray-600 cursor-pointer hover:bg-[#3a4553] transition-all transform hover:scale-105"
                  onClick={() => setDonationType('monetary')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Monetary Donation</h3>
                    <p className="text-gray-300 text-sm">
                      Contribute funds to support our operations, equipment purchases, and program development.
                    </p>
                  </CardContent>
                </Card>

                {/* Item Donation */}
                <Card 
                  className="bg-[#2d3748] border-gray-600 cursor-pointer hover:bg-[#3a4553] transition-all transform hover:scale-105"
                  onClick={() => setDonationType('item')}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white text-lg font-semibold mb-2">Item Donation</h3>
                    <p className="text-gray-300 text-sm">
                      Donate equipment, tools, electronic components, or other materials to enhance our facilities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back to Selection */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  type="button"
                  onClick={() => setDonationType(null)}
                  className="bg-transparent hover:bg-[#5a6578] text-white border border-gray-600 rounded-md flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Options
                </Button>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${donationType === 'monetary' ? 'bg-green-600' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
                    {donationType === 'monetary' ? 
                      <DollarSign className="w-4 h-4 text-white" /> : 
                      <Package className="w-4 h-4 text-white" />
                    }
                  </div>
                  <span className="text-white font-medium">
                    {donationType === 'monetary' ? 'Monetary Donation' : 'Item Donation'}
                  </span>
                </div>
              </div>

              {/* Donor Name */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.donorName}
                  onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  required
                  className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
                />
              </div>

              {donationType === 'monetary' ? (
                /* Monetary Donation Form */
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Donation Amount <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount (₱)"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    min="1"
                    className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Any amount helps us continue our mission to serve the community.
                  </p>
                </div>
              ) : (
                /* Item Donation Form */
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-4">Items to Donate</h4>
                    
                    {/* Add New Item */}
                    <Card className="bg-[#2d3748] border-gray-600 mb-4">
                      <CardContent className="p-4">
                        <h5 className="text-white font-medium mb-3">Add New Item</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input
                            type="text"
                            placeholder="Item name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="bg-[#1a202c] border-gray-600 text-white focus:border-[#ff8c00]"
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              onClick={() => setNewItem({ ...newItem, quantity: Math.max(1, newItem.quantity - 1) })}
                              className="bg-[#4a5568] hover:bg-[#5a6578] text-white px-3 py-2"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={newItem.quantity}
                              onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                              className="bg-[#1a202c] border-gray-600 text-white text-center focus:border-[#ff8c00]"
                              min="1"
                            />
                            <Button
                              type="button"
                              onClick={() => setNewItem({ ...newItem, quantity: newItem.quantity + 1 })}
                              className="bg-[#4a5568] hover:bg-[#5a6578] text-white px-3 py-2"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            type="button"
                            onClick={addItem}
                            disabled={!newItem.name.trim()}
                            className="bg-[#ff8c00] hover:bg-[#e67e00] text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        <Input
                          type="text"
                          placeholder="Description (optional)"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          className="bg-[#1a202c] border-gray-600 text-white focus:border-[#ff8c00] mt-3"
                        />
                      </CardContent>
                    </Card>

                    {/* Items List */}
                    {itemDonations.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-white font-medium">Donation Items ({itemDonations.length})</h5>
                        {itemDonations.map((item) => (
                          <Card key={item.id} className="bg-[#2d3748] border-gray-600">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h6 className="text-white font-medium">{item.name}</h6>
                                  {item.description && (
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      type="button"
                                      onClick={() => updateItemQuantity(item.id, -1)}
                                      className="bg-[#4a5568] hover:bg-[#5a6578] text-white px-2 py-1 text-sm"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-white font-medium min-w-[2rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      type="button"
                                      onClick={() => updateItemQuantity(item.id, 1)}
                                      className="bg-[#4a5568] hover:bg-[#5a6578] text-white px-2 py-1 text-sm"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {itemDonations.length === 0 && (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No items added yet. Add items using the form above.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={donationType === 'monetary' ? !formData.amount : itemDonations.length === 0}
                  className="bg-[#ff8c00] hover:bg-[#e67e00] text-white font-semibold py-3 rounded-md px-8"
                >
                  {donationType === 'monetary' 
                    ? `Donate ₱${formData.amount || '0'}` 
                    : `Donate ${itemDonations.length} Item${itemDonations.length !== 1 ? 's' : ''}`
                  }
                </Button>
                <Button 
                  type="button" 
                  onClick={onBack}
                  className="bg-transparent hover:bg-[#5a6578] text-white border border-gray-600 rounded-md px-8"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}