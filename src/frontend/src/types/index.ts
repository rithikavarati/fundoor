export interface Activity {
  id: bigint;
  name: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  tags: string[];
  imageUrl: string;
  websiteUrl: string;
  eventDate?: string;
  eventDateEnd?: string;
}

export interface SearchCache {
  results: Activity[];
  timestamp: number;
}
