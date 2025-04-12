export interface LookbookItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const lookbookItems: LookbookItem[] = [
  {
    id: '1',
    title: 'Urban Stealth',
    subtitle: 'Technical outerwear with functional design',
    imageUrl: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4MDI4&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  },
  {
    id: '2',
    title: 'Shadow Tech',
    subtitle: 'Innovative fabrics meet minimalist design',
    imageUrl: 'https://images.unsplash.com/photo-1553143820-c0a71d22e98b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU4MDM5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  },
  {
    id: '3',
    title: 'Utility Core',
    subtitle: 'Function-forward pieces with tactical details',
    imageUrl: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8c3RyZWV0d2VhciBtb2RlbCBwaG90b3N8fHx8fHwxNzQ0MzU4MDUw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  },
  {
    id: '4',
    title: 'Monochrome',
    subtitle: 'Essential pieces in tonal black and gray',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU4MDU5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  },
  {
    id: '5',
    title: 'Urban Ninja',
    subtitle: 'Advanced layering with technical fabrics',
    imageUrl: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8bHV4dXJ5IHN0cmVldHdlYXIgY2xvdGhpbmd8fHx8fHwxNzQ0MzU4MDcw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  },
  {
    id: '6',
    title: 'Midnight Tactical',
    subtitle: 'Combat-inspired designs for urban environment',
    imageUrl: 'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=800&ixid=MnwxfDB8MXxyYW5kb218MHx8ZGFyayBtaW5pbWFsaXN0IGZhc2hpb24gcGhvdG9ncmFwaHl8fHx8fHwxNzQ0MzU4MDgy&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=600'
  }
];

export default lookbookItems;
