export interface Drop {
  id: string;
  title: string;
  date: string;
  time: string;
  imageUrl: string;
  limited?: boolean;
  limitedTime?: string;
}

const drops: Drop[] = [
  {
    id: '1',
    title: 'Tactical Capsule',
    date: '10.15.23',
    time: '11:00 EST',
    limitedTime: '48 Hour Access',
    imageUrl: 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU4MDk0&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=700'
  },
  {
    id: '2',
    title: 'Stealth Accessories',
    date: '10.22.23',
    time: '09:00 EST',
    limited: true,
    imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU4MTA1&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=700'
  }
];

export default drops;
