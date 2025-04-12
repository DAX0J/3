export interface ShippingProvince {
  name: string;
  homeDeliveryPrice: number; // سعر التوصيل للمنزل (باللون الأخضر)
  officeDeliveryPrice: number; // سعر التوصيل للمكتب (باللون الأزرق)
}

export enum DeliveryType {
  HOME = 'home',
  OFFICE = 'office'
}

// قائمة ولايات الجزائر مع أسعار التوصيل
export const shippingProvinces: ShippingProvince[] = [
  {
    name: 'Adrar',
    homeDeliveryPrice: 1400,
    officeDeliveryPrice: 900
  },
  {
    name: 'Chlef',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Laghouat',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Oum El Bouaghi',
    homeDeliveryPrice: 700,
    officeDeliveryPrice: 450
  },
  {
    name: 'Batna',
    homeDeliveryPrice: 500,
    officeDeliveryPrice: 300
  },
  {
    name: 'Bejaia',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Biskra',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 500
  },
  {
    name: 'Bechar',
    homeDeliveryPrice: 1100,
    officeDeliveryPrice: 650
  },
  {
    name: 'Blida',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Bouira',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Tamanrasset',
    homeDeliveryPrice: 1600,
    officeDeliveryPrice: 1050
  },
  {
    name: 'Tebessa',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Tlemcen',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 550
  },
  {
    name: 'Tiaret',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Tizi Ouzou',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Alger',
    homeDeliveryPrice: 600,
    officeDeliveryPrice: 450
  },
  {
    name: 'Djelfa',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Jijel',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Setif',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Saida',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 0
  },
  {
    name: 'Skikda',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Sidi Bel Abbes',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Annaba',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Guelma',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Constantine',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Medea',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Mostaganem',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'M\'Sila',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 500
  },
  {
    name: 'Mascara',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Ouargla',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Oran',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'El Bayadh',
    homeDeliveryPrice: 1100,
    officeDeliveryPrice: 600
  },
  {
    name: 'Illizi',
    homeDeliveryPrice: 0,
    officeDeliveryPrice: 0
  },
  {
    name: 'Bordj Bou Arreridj',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Boumerdes',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'El Tarf',
    homeDeliveryPrice: 750,
    officeDeliveryPrice: 450
  },
  {
    name: 'Tindouf',
    homeDeliveryPrice: 0,
    officeDeliveryPrice: 0
  },
  {
    name: 'Tissemsilt',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 520
  },
  {
    name: 'El Oued',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Khenchela',
    homeDeliveryPrice: 600,
    officeDeliveryPrice: 0
  },
  {
    name: 'Souk Ahras',
    homeDeliveryPrice: 700,
    officeDeliveryPrice: 450
  },
  {
    name: 'Tipaza',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Mila',
    homeDeliveryPrice: 700,
    officeDeliveryPrice: 450
  },
  {
    name: 'Ain Defla',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Naama',
    homeDeliveryPrice: 1100,
    officeDeliveryPrice: 600
  },
  {
    name: 'Ain Temouchent',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Ghardaia',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Relizane',
    homeDeliveryPrice: 800,
    officeDeliveryPrice: 450
  },
  {
    name: 'Timimoun',
    homeDeliveryPrice: 1400,
    officeDeliveryPrice: 0
  },
  {
    name: 'Bordj Badji Mokhtar',
    homeDeliveryPrice: 0,
    officeDeliveryPrice: 0
  },
  {
    name: 'Ouled Djellal',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 550
  },
  {
    name: 'Beni Abbes',
    homeDeliveryPrice: 1000,
    officeDeliveryPrice: 0
  },
  {
    name: 'In Salah',
    homeDeliveryPrice: 1600,
    officeDeliveryPrice: 0
  },
  {
    name: 'In Guezzam',
    homeDeliveryPrice: 1600,
    officeDeliveryPrice: 0
  },
  {
    name: 'Touggourt',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 600
  },
  {
    name: 'Djanet',
    homeDeliveryPrice: 0,
    officeDeliveryPrice: 0
  },
  {
    name: 'M\'Ghair',
    homeDeliveryPrice: 950,
    officeDeliveryPrice: 0
  },
  {
    name: 'Meniaa',
    homeDeliveryPrice: 1000,
    officeDeliveryPrice: 0
  }
];

/**
 * الحصول على سعر التوصيل لولاية وطريقة توصيل محددة
 * @param province اسم الولاية
 * @param deliveryType نوع التوصيل (للمنزل أو للمكتب)
 * @returns سعر التوصيل
 */
export function getShippingPrice(province: string, deliveryType: DeliveryType): number {
  const provinceData = shippingProvinces.find(p => p.name === province);
  if (!provinceData) return 0;
  
  return deliveryType === DeliveryType.HOME
    ? provinceData.homeDeliveryPrice
    : provinceData.officeDeliveryPrice;
}

/**
 * التحقق مما إذا كانت طريقة التوصيل متوفرة لولاية معينة
 * @param province اسم الولاية
 * @param deliveryType نوع التوصيل (للمنزل أو للمكتب)
 * @returns ما إذا كانت طريقة التوصيل متوفرة
 */
export function isDeliveryTypeAvailable(province: string, deliveryType: DeliveryType): boolean {
  const provinceData = shippingProvinces.find(p => p.name === province);
  if (!provinceData) return false;
  
  return deliveryType === DeliveryType.HOME
    ? provinceData.homeDeliveryPrice > 0
    : provinceData.officeDeliveryPrice > 0;
}