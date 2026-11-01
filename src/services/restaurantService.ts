import { apiClient, ApiResponse } from './apiClient';
import { Restaurant, FoodItem } from '../types';
import { MOCK_RESTAURANTS } from '../data/mockData';

export interface RestaurantFilterParams {
  category?: string;
  query?: string;
  isNearby?: boolean;
  minRating?: number;
  hasFreeShip?: boolean;
  hasPromo?: boolean;
  sortBy?: 'recommended' | 'distance' | 'rating' | 'price_asc';
  page?: number;
  pageSize?: number;
}

export const restaurantService = {
  async getRestaurants(params: RestaurantFilterParams = {}): Promise<{
    items: Restaurant[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const page = params.page || 1;
    const pageSize = params.pageSize || 6;

    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.set('category', params.category);
      if (params.query) queryParams.set('q', params.query);
      if (params.sortBy) queryParams.set('sort', params.sortBy);
      queryParams.set('page', page.toString());
      queryParams.set('pageSize', pageSize.toString());

      const res = await apiClient.get<Restaurant[]>(`/restaurants?${queryParams.toString()}`);
      return {
        items: res.data,
        total: res.total || res.data.length,
        page,
        pageSize,
        totalPages: Math.ceil((res.total || res.data.length) / pageSize),
      };
    } catch {
      // Robust simulated fallback using local in-memory dataset
      let filtered = [...MOCK_RESTAURANTS];

      if (params.query?.trim()) {
        const q = params.query.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.address.toLowerCase().includes(q) ||
            r.tagline.toLowerCase().includes(q) ||
            r.categories.some((c) => c.toLowerCase().includes(q)) ||
            r.menu.some((f) => f.name.toLowerCase().includes(q))
        );
      }

      if (params.category && params.category !== 'cat-all') {
        filtered = filtered.filter((r) => r.categories.includes(params.category!));
      }

      if (params.isNearby) {
        filtered = filtered.filter((r) => r.distanceKm <= 1.2);
      }

      if (params.minRating) {
        filtered = filtered.filter((r) => r.rating >= params.minRating!);
      }

      if (params.hasFreeShip) {
        filtered = filtered.filter((r) => r.hasFreeShip);
      }

      if (params.hasPromo) {
        filtered = filtered.filter((r) => !!r.featuredPromo);
      }

      if (params.sortBy === 'distance') {
        filtered.sort((a, b) => a.distanceKm - b.distanceKm);
      } else if (params.sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      const total = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const items = filtered.slice(startIndex, startIndex + pageSize);

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      };
    }
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const res = await apiClient.get<Restaurant>(`/restaurants/${id}`);
      return res.data;
    } catch {
      return MOCK_RESTAURANTS.find((r) => r.id === id) || null;
    }
  },
};

