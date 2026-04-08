
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  subscription: 'starter' | 'pro' | 'enterprise';
  storageUsed: number; // in MB
  storageLimit: number; // in MB
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Pin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  category: string;
  createdAt: string;
  type: 'image' | 'video';
  comments?: Comment[];
}

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin',
    email: 'admin@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
    subscription: 'pro',
    storageUsed: 450,
    storageLimit: 1024,
  },
  {
    id: 'u2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'user',
    subscription: 'starter',
    storageUsed: 80,
    storageLimit: 250,
  }
];

export const MOCK_PINS: Pin[] = [
  {
    id: 'p1',
    title: 'Minimalist Interior Design',
    description: 'Clean lines and neutral colors for a modern home.',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=600&q=80',
    authorId: 'u1',
    authorName: 'Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    likes: 124,
    category: 'Interior',
    createdAt: '2024-03-20',
    type: 'image',
  },
  {
    id: 'p2',
    title: 'Mountain Sunset',
    description: 'Breathtaking view of the Alps during golden hour.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&h=400&q=80',
    authorId: 'u2',
    authorName: 'Jane Doe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    likes: 342,
    category: 'Nature',
    createdAt: '2024-03-21',
    type: 'image',
  },
  {
    id: 'p3',
    title: 'Digital Art Experiment',
    description: 'Abstract shapes and vibrant neon colors.',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&h=800&q=80',
    authorId: 'u1',
    authorName: 'Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    likes: 89,
    category: 'Art',
    createdAt: '2024-03-22',
    type: 'image',
  },
  {
    id: 'p4',
    title: 'Cyberpunk Cityscape',
    description: 'Futuristic city with towering neon skyscrapers.',
    imageUrl: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=400&h=500&q=80',
    authorId: 'u2',
    authorName: 'Jane Doe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    likes: 567,
    category: 'Sci-Fi',
    createdAt: '2024-03-23',
    type: 'image',
  },
  {
    id: 'p5',
    title: 'Cozy Reading Nook',
    description: 'Perfect spot for a rainy afternoon.',
    imageUrl: 'https://images.unsplash.com/photo-1516101922849-2bf0be616449?auto=format&fit=crop&w=400&h=700&q=80',
    authorId: 'u1',
    authorName: 'Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    likes: 213,
    category: 'Lifestyle',
    createdAt: '2024-03-24',
    type: 'image',
  },
  {
    id: 'p6',
    title: 'Ocean Breeze',
    description: 'Serene coastline with crystal clear water.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=450&q=80',
    authorId: 'u1',
    authorName: 'Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    likes: 456,
    category: 'Nature',
    createdAt: '2024-03-25',
    type: 'image',
  },
  {
    id: 'p7',
    title: 'Gourmet Pasta',
    description: 'Freshly made tagliatelle with pesto and pine nuts.',
    imageUrl: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=400&h=650&q=80',
    authorId: 'u2',
    authorName: 'Jane Doe',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    likes: 120,
    category: 'Food',
    createdAt: '2024-03-26',
    type: 'image',
  },
  {
    id: 'p8',
    title: 'Vintage Camera',
    description: 'Classic Leica M3 on a wooden desk.',
    imageUrl: 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e?auto=format&fit=crop&w=400&h=300&q=80',
    authorId: 'u1',
    authorName: 'Admin',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    likes: 78,
    category: 'Photography',
    createdAt: '2024-03-27',
    type: 'image',
  }
];

export const MOCK_STATS = [
  { name: 'Jan', views: 4000, uploads: 240 },
  { name: 'Feb', views: 3000, uploads: 198 },
  { name: 'Mar', views: 2000, uploads: 980 },
  { name: 'Apr', views: 2780, uploads: 390 },
  { name: 'May', views: 1890, uploads: 480 },
  { name: 'Jun', views: 2390, uploads: 380 },
  { name: 'Jul', views: 3490, uploads: 430 },
];
