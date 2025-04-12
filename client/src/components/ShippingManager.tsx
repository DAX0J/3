import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/contexts/SiteSettingsContext';
import { ShippingProvince } from '@/data/shippingProvinces';

const ShippingManager: React.FC = () => {
  const { shippingSettings, updateShippingSettings } = useSiteSettings();
  const [provinces, setProvinces] = useState<ShippingProvince[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProvince, setNewProvince] = useState({
    name: '',
    homeDeliveryPrice: 0,
    officeDeliveryPrice: 0
  });
  const [editingProvinceIndex, setEditingProvinceIndex] = useState<number | null>(null);
  const [filterText, setFilterText] = useState('');
  const [showAllProvinces, setShowAllProvinces] = useState(false);
  const MAX_VISIBLE_PROVINCES = 10; // Show only 10 provinces by default

  // Initialize provinces from context
  useEffect(() => {
    if (shippingSettings && shippingSettings.provinces) {
      setProvinces([...shippingSettings.provinces]);
    }
  }, [shippingSettings]);

  // Filter provinces based on search text
  const filteredProvinces = provinces.filter(province => 
    province.name.toLowerCase().includes(filterText.toLowerCase())
  );

  // Sort provinces alphabetically
  const sortedProvinces = [...filteredProvinces].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Apply pagination to provinces when not searching
  const visibleProvinces = filterText
    ? sortedProvinces // Show all filtered results when searching
    : showAllProvinces 
      ? sortedProvinces // Show all when toggle is on
      : sortedProvinces.slice(0, MAX_VISIBLE_PROVINCES); // Show limited number

  const handleSaveChanges = async () => {
    setLoading(true);
    
    try {
      await updateShippingSettings({
        provinces: [...provinces]
      });
      
      toast({
        title: 'تم الحفظ بنجاح',
        description: 'تم تحديث أسعار التوصيل بنجاح',
      });
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ التغييرات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProvince = (index: number) => {
    setEditingProvinceIndex(index);
  };

  const handleUpdateProvince = (index: number, field: keyof ShippingProvince, value: string | number) => {
    const updatedProvinces = [...provinces];
    
    if (field === 'name') {
      updatedProvinces[index].name = value as string;
    } else {
      // Parse value as number for price fields
      const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
      
      if (field === 'homeDeliveryPrice') {
        updatedProvinces[index].homeDeliveryPrice = numValue;
      } else if (field === 'officeDeliveryPrice') {
        updatedProvinces[index].officeDeliveryPrice = numValue;
      }
    }
    
    setProvinces(updatedProvinces);
  };

  const handleAddProvince = () => {
    if (!newProvince.name.trim()) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال اسم المقاطعة',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if province already exists
    const exists = provinces.some(p => 
      p.name.toLowerCase() === newProvince.name.toLowerCase()
    );
    
    if (exists) {
      toast({
        title: 'خطأ',
        description: 'المقاطعة موجودة بالفعل',
        variant: 'destructive',
      });
      return;
    }
    
    // Add new province
    setProvinces([...provinces, { ...newProvince }]);
    
    // Reset form
    setNewProvince({
      name: '',
      homeDeliveryPrice: 0,
      officeDeliveryPrice: 0
    });
    
    toast({
      title: 'تمت الإضافة',
      description: 'تمت إضافة المقاطعة بنجاح',
    });
  };

  const handleRemoveProvince = (index: number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه المقاطعة؟')) {
      const updatedProvinces = [...provinces];
      updatedProvinces.splice(index, 1);
      setProvinces(updatedProvinces);
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف المقاطعة بنجاح',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة أسعار التوصيل</CardTitle>
          <CardDescription>
            قم بتعديل أسعار التوصيل لكل ولاية. الأسعار باللون الأخضر للتوصيل للمنزل والأزرق للتوصيل للمكتب.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-4">
              <div className="w-full sm:w-64">
                <Label htmlFor="search">البحث عن ولاية</Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="ابحث عن اسم الولاية..."
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="bg-black border-gray-800"
                  />
                  {!filterText && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAllProvinces(!showAllProvinces)}
                      className="whitespace-nowrap"
                    >
                      {showAllProvinces ? 'عرض أقل' : 'عرض الكل'}
                    </Button>
                  )}
                </div>
              </div>
              
              <Button
                onClick={handleSaveChanges}
                disabled={loading}
                className="bg-[#00BFFF] text-black hover:bg-[#33ccff]"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
            
            <div className="border border-gray-800 rounded-md overflow-hidden">
              <Table>
                <TableCaption>قائمة الولايات وأسعار التوصيل</TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead>الولاية</TableHead>
                    <TableHead className="text-center text-emerald-600">سعر التوصيل للمنزل</TableHead>
                    <TableHead className="text-center text-indigo-600">سعر التوصيل للمكتب</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleProvinces.map((province, index) => {
                    const provinceIndex = provinces.findIndex(p => p.name === province.name);
                    const isEditing = editingProvinceIndex === provinceIndex;
                    
                    return (
                      <TableRow key={province.name} className="hover:bg-gray-900">
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={province.name}
                              onChange={(e) => handleUpdateProvince(provinceIndex, 'name', e.target.value)}
                              className="bg-black border-gray-800"
                            />
                          ) : (
                            province.name
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={province.homeDeliveryPrice}
                              onChange={(e) => handleUpdateProvince(provinceIndex, 'homeDeliveryPrice', e.target.value)}
                              className="bg-black border-gray-800 w-24 mx-auto"
                            />
                          ) : (
                            <span className={`${province.homeDeliveryPrice > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {province.homeDeliveryPrice || 'غير متاح'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isEditing ? (
                            <Input
                              type="number"
                              value={province.officeDeliveryPrice}
                              onChange={(e) => handleUpdateProvince(provinceIndex, 'officeDeliveryPrice', e.target.value)}
                              className="bg-black border-gray-800 w-24 mx-auto"
                            />
                          ) : (
                            <span className={`${province.officeDeliveryPrice > 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                              {province.officeDeliveryPrice || 'غير متاح'}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {isEditing ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProvinceIndex(null)}
                                className="text-indigo-600 border-indigo-600"
                              >
                                تم
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProvince(provinceIndex)}
                                className="text-emerald-600 border-emerald-600"
                              >
                                تعديل
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveProvince(provinceIndex)}
                              className="text-red-500 border-red-500"
                            >
                              حذف
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Card className="border border-gray-800">
            <CardHeader>
              <CardTitle>إضافة ولاية جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="provinceName">اسم الولاية</Label>
                  <Input
                    id="provinceName"
                    value={newProvince.name}
                    onChange={(e) => setNewProvince({ ...newProvince, name: e.target.value })}
                    className="bg-black border-gray-800"
                    placeholder="أدخل اسم الولاية"
                  />
                </div>
                <div>
                  <Label htmlFor="homeDelivery" className="text-emerald-600">سعر التوصيل للمنزل</Label>
                  <Input
                    id="homeDelivery"
                    type="number"
                    value={newProvince.homeDeliveryPrice}
                    onChange={(e) => setNewProvince({ 
                      ...newProvince, 
                      homeDeliveryPrice: parseInt(e.target.value) || 0 
                    })}
                    className="bg-black border-gray-800"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="officeDelivery" className="text-indigo-600">سعر التوصيل للمكتب</Label>
                  <Input
                    id="officeDelivery"
                    type="number"
                    value={newProvince.officeDeliveryPrice}
                    onChange={(e) => setNewProvince({ 
                      ...newProvince, 
                      officeDeliveryPrice: parseInt(e.target.value) || 0 
                    })}
                    className="bg-black border-gray-800"
                    placeholder="0"
                  />
                </div>
                <div className="sm:col-span-4 flex justify-end mt-4">
                  <Button 
                    onClick={handleAddProvince} 
                    className="bg-gradient-to-r from-emerald-700 to-indigo-700 text-white hover:from-emerald-600 hover:to-indigo-600"
                  >
                    إضافة ولاية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingManager;