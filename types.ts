export enum CourseCategory {
  CRYPTO = 'Crypto',
  FOREX = 'Forex',
  STOCKS = 'Stocks',
  INDICES = 'Indices',
  COMMODITIES = 'Commodities',
  DEFI = 'DeFi',
  NFT_METAVERSE = 'NFT & Metaverse',
  TOKENIZED_ASSETS = 'Tokenized Assets',
  DIGITAL_BUSINESS = 'Digital Business',
  TRADING_PSYCHOLOGY = 'Psychology',
  SPECIAL = 'Special' // Premium, High-Ticket Courses
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number; // In USD equivalent
  category: CourseCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  students: number;
  downloads?: number; // Number of times materials have been downloaded
  image: string;
  tags: string[];
  downloadUrl?: string; // URL for course materials (PDF, ZIP, Video link)
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}