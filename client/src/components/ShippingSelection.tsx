import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeliveryType, ShippingProvince, shippingProvinces } from '@/data/shippingProvinces';

interface ShippingSelectionProps {
  onShippingChange: (data: {
    province: string;
    municipality: string;
    deliveryType: DeliveryType;
    shippingPrice: number;
  }) => void;
  shippingProvinces: ShippingProvince[];
}

const ShippingSelection: React.FC<ShippingSelectionProps> = ({
  onShippingChange,
  shippingProvinces
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType | ''>('');
  const [municipality, setMunicipality] = useState<string>('');
  const [shippingPrice, setShippingPrice] = useState<number>(0);
  
  // Sort provinces alphabetically
  const sortedProvinces = [...shippingProvinces].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // When province or delivery type changes, update shipping price
  useEffect(() => {
    if (selectedProvince && selectedDeliveryType) {
      const province = shippingProvinces.find(p => p.name === selectedProvince);
      if (province) {
        const price = selectedDeliveryType === DeliveryType.HOME 
          ? province.homeDeliveryPrice 
          : province.officeDeliveryPrice;
          
        setShippingPrice(price);
        
        // Pass the updated shipping data to parent component
        onShippingChange({
          province: selectedProvince,
          municipality,
          deliveryType: selectedDeliveryType as DeliveryType,
          shippingPrice: price
        });
      }
    }
  }, [selectedProvince, selectedDeliveryType, municipality, onShippingChange, shippingProvinces]);
  
  // Check if home delivery is available for selected province
  const isHomeDeliveryAvailable = selectedProvince 
    ? (shippingProvinces.find(p => p.name === selectedProvince)?.homeDeliveryPrice || 0) > 0 
    : false;
    
  // Check if office delivery is available for selected province
  const isOfficeDeliveryAvailable = selectedProvince 
    ? (shippingProvinces.find(p => p.name === selectedProvince)?.officeDeliveryPrice || 0) > 0 
    : false;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">خيارات التوصيل</h3>
      
      <div className="space-y-2">
        <Label htmlFor="province">الولاية *</Label>
        <Select
          value={selectedProvince}
          onValueChange={(value) => {
            setSelectedProvince(value);
            // Reset delivery type when province changes
            setSelectedDeliveryType('');
          }}
        >
          <SelectTrigger className="bg-black border-gray-800">
            <SelectValue placeholder="اختر الولاية" />
          </SelectTrigger>
          <SelectContent>
            {sortedProvinces.map(province => (
              <SelectItem key={province.name} value={province.name}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="municipality">البلدية *</Label>
        <Input
          id="municipality"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
          className="bg-black border-gray-800"
          placeholder="أدخل اسم البلدية"
        />
      </div>
      
      {selectedProvince && (
        <div className="space-y-2">
          <Label>طريقة التوصيل *</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant={selectedDeliveryType === DeliveryType.HOME ? "default" : "outline"}
              onClick={() => setSelectedDeliveryType(DeliveryType.HOME)}
              disabled={!isHomeDeliveryAvailable}
              className={`flex-1 ${
                selectedDeliveryType === DeliveryType.HOME 
                  ? 'bg-emerald-700 hover:bg-emerald-600'
                  : 'border-gray-800'
              } ${!isHomeDeliveryAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">توصيل للمنزل</span>
                {isHomeDeliveryAvailable && (
                  <span className={`text-sm font-bold ${
                    selectedDeliveryType === DeliveryType.HOME 
                      ? 'text-white'
                      : 'text-emerald-400'
                  }`}>
                    {shippingProvinces.find(p => p.name === selectedProvince)?.homeDeliveryPrice || 0} DZD
                  </span>
                )}
                {!isHomeDeliveryAvailable && (
                  <span className="text-sm text-red-400">غير متوفر</span>
                )}
              </div>
            </Button>
            
            <Button
              type="button"
              variant={selectedDeliveryType === DeliveryType.OFFICE ? "default" : "outline"}
              onClick={() => setSelectedDeliveryType(DeliveryType.OFFICE)}
              disabled={!isOfficeDeliveryAvailable}
              className={`flex-1 ${
                selectedDeliveryType === DeliveryType.OFFICE 
                  ? 'bg-indigo-700 hover:bg-indigo-600'
                  : 'border-gray-800'
              } ${!isOfficeDeliveryAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">توصيل للمكتب</span>
                {isOfficeDeliveryAvailable && (
                  <span className={`text-sm font-bold ${
                    selectedDeliveryType === DeliveryType.OFFICE
                      ? 'text-white'
                      : 'text-indigo-400'
                  }`}>
                    {shippingProvinces.find(p => p.name === selectedProvince)?.officeDeliveryPrice || 0} DZD
                  </span>
                )}
                {!isOfficeDeliveryAvailable && (
                  <span className="text-sm text-red-400">غير متوفر</span>
                )}
              </div>
            </Button>
          </div>
        </div>
      )}
      
      {selectedDeliveryType && (
        <div className="pt-2 border-t border-gray-800 mt-4">
          <div className="flex justify-between">
            <span>تكلفة التوصيل:</span>
            <span className="font-medium">{shippingPrice} DZD</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingSelection;