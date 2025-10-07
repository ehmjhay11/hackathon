import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Wrench, Microchip, Search, ShoppingCart } from 'lucide-react';
import Image from "next/image";
import { ToolComponentSelection, ToolsComponentsPaymentData, ITool, IComponent } from '@/types';

interface ToolsComponentsPaymentFormProps {
  serviceType: 'tools' | 'components';
  onBack: () => void;
  onComplete: () => void;
}

export function ToolsComponentsPaymentForm({ serviceType, onBack, onComplete }: ToolsComponentsPaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [availableItems, setAvailableItems] = useState<(ITool | IComponent)[]>([]);
  const [selectedItems, setSelectedItems] = useState<ToolComponentSelection[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | ''>('');

  const [calculations, setCalculations] = useState<ToolsComponentsPaymentData>({
    selectedItems: [],
    totalCost: 0
  });

  // Fetch available items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const endpoint = serviceType === 'tools' ? '/api/tools' : '/api/components';
        
        const response = await fetch(endpoint);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || `Failed to fetch ${serviceType}`);
        }

        setAvailableItems(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load ${serviceType}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [serviceType]);

  // Calculate total cost whenever selected items change
  useEffect(() => {
    const totalCost = selectedItems.reduce((sum, item) => sum + item.totalCost, 0);
    setCalculations({
      selectedItems: selectedItems,
      totalCost: totalCost
    });
  }, [selectedItems]);

  const getItemCost = (item: ITool | IComponent): number => {
    if (serviceType === 'tools') {
      return (item as ITool).cost || 0;
    } else {
      return (item as IComponent).costPerUnit || 0;
    }
  };

  const getItemName = (item: ITool | IComponent): string => {
    return item.name || 'Unknown Item';
  };

  const getItemId = (item: ITool | IComponent): string => {
    if (serviceType === 'tools') {
      return (item as ITool).tool_id || item._id || '';
    } else {
      return (item as IComponent).component_id || item._id || '';
    }
  };

  const filteredItems = availableItems.filter(item =>
    getItemName(item).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemSelect = (item: ITool | IComponent, quantity: number) => {
    const itemId = getItemId(item);
    const itemName = getItemName(item);
    const costPerUnit = getItemCost(item);
    
    if (quantity <= 0) {
      // Remove item if quantity is 0
      setSelectedItems(prev => prev.filter(selected => selected.id !== itemId));
    } else {
      // Add or update item
      const selection: ToolComponentSelection = {
        id: itemId,
        name: itemName,
        costPerUnit: costPerUnit,
        quantity: quantity,
        totalCost: costPerUnit * quantity
      };

      setSelectedItems(prev => {
        const existingIndex = prev.findIndex(selected => selected.id === itemId);
        if (existingIndex >= 0) {
          // Update existing item
          const updated = [...prev];
          updated[existingIndex] = selection;
          return updated;
        } else {
          // Add new item
          return [...prev, selection];
        }
      });
    }
  };

  const getSelectedQuantity = (itemId: string): number => {
    const selected = selectedItems.find(item => item.id === itemId);
    return selected ? selected.quantity : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (selectedItems.length === 0) {
        throw new Error(`Please select at least one ${serviceType.slice(0, -1)}`);
      }
      if (!paymentMethod) {
        throw new Error('Please select a payment method');
      }

      // Submit payment
      const itemDescriptions = selectedItems.map(item => 
        `${item.name} (${item.quantity}x ₱${item.costPerUnit})`
      ).join(', ');

      const paymentData = {
        userId: 'current-user', // This should come from auth context
        serviceName: serviceType,
        description: `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}: ${itemDescriptions}`,
        amount: calculations.totalCost,
        paymentMethod: paymentMethod,
        serviceDetails: calculations
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Payment submission failed');
      }

      // Success
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceConfig = {
    tools: {
      title: 'Tools Payment',
      icon: Wrench,
      color: 'bg-green-600',
      description: 'Select from available tools and equipment'
    },
    components: {
      title: 'Components Payment',
      icon: Microchip,
      color: 'bg-purple-600',
      description: 'Select electronic components and parts'
    }
  };

  const config = serviceConfig[serviceType];
  const IconComponent = config.icon;

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
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <Button
          onClick={onBack}
          className="bg-transparent hover:bg-[#4a5568] text-white border border-gray-600 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Selection
        </Button>
      </div>

      {/* Payment Form */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#4a5568] rounded-lg p-8 border border-gray-600">
          {/* Service Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{config.title}</h2>
              <p className="text-gray-300 text-sm">{config.description}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Search {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#2d3748] border-gray-600 text-white pl-10 focus:border-[#ff8c00]"
                  placeholder={`Search for ${serviceType}...`}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Available Items */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                Available {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
              </h3>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-300">Loading {serviceType}...</div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-300">No {serviceType} found</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredItems.map((item) => {
                    const itemId = getItemId(item);
                    const itemName = getItemName(item);
                    const itemCost = getItemCost(item);
                    const selectedQuantity = getSelectedQuantity(itemId);
                    
                    return (
                      <Card key={itemId} className="bg-[#2d3748] border-gray-600">
                        <CardContent className="p-4">
                          <h4 className="text-white font-semibold text-sm mb-2 truncate">
                            {itemName}
                          </h4>
                          <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[#ff8c00] font-semibold">
                              ₱{itemCost.toFixed(2)}
                            </span>
                            {serviceType === 'components' && (
                              <span className="text-gray-400 text-xs">
                                Stock: {(item as IComponent).quantity}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              value={selectedQuantity}
                              onChange={(e) => handleItemSelect(item, parseInt(e.target.value) || 0)}
                              className="bg-[#4a5568] border-gray-600 text-white text-sm"
                              placeholder="Qty"
                              disabled={isSubmitting}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Items & Cost Summary */}
            {selectedItems.length > 0 && (
              <Card className="bg-[#2d3748] border-gray-600">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart className="w-5 h-5 text-[#ff8c00]" />
                    <h3 className="text-white font-semibold">Selected Items</h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">
                          {item.name} (x{item.quantity})
                        </span>
                        <span className="text-white">₱{item.totalCost.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total Cost:</span>
                      <span className="text-[#ff8c00]">₱{calculations.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Payment Method
              </label>
              <Select 
                value={paymentMethod} 
                onValueChange={(value: 'cash' | 'card' | 'bank_transfer') => setPaymentMethod(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="bg-[#2d3748] border-gray-600 text-white focus:border-[#ff8c00]">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d3748] border-gray-600">
                  <SelectItem value="cash" className="text-white focus:bg-[#4a5568]">Cash</SelectItem>
                  <SelectItem value="card" className="text-white focus:bg-[#4a5568]">Card</SelectItem>
                  <SelectItem value="bank_transfer" className="text-white focus:bg-[#4a5568]">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || selectedItems.length === 0}
              className="w-full bg-[#ff8c00] hover:bg-[#e67e00] text-white font-semibold py-3 rounded-md transition-colors"
            >
              {isSubmitting ? 'Processing Payment...' : `Pay ₱${calculations.totalCost.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}