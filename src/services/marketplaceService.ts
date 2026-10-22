import { apiClient } from '../lib/apiClient';

export interface MarketItem {
  id: number;
  userId: string;
  shopId?: string;
  name: string;
  price: number;
  discount?: number;
  description: string;
  category: string;
  location?: string;
  images: string[];
  type: 'product' | 'service';
  currency?: string;
  createdAt?: string;
  shop?: {
    id: string;
    name: string;
    image?: string;
    location?: string;
    phone?: string;
    email?: string;
    currency?: string;
  };
  user?: {
    uid: string;
    name?: string;
    username?: string;
    photoUrl?: string;
    bio?: string;
    isSubscribed?: boolean;
    isRanked?: boolean;
    averageRating?: number;
  };
}

export const marketplaceService = {
  /**
   * Fetch marketplace items (products and services) matching Flutter MarketController
   */
  async getMarketItems(options: {
    category?: string;
    searchQuery?: string;
    location?: string;
  } = {}): Promise<MarketItem[]> {
    try {
      const { category, searchQuery, location } = options;

      let goodsPath = '/goods/search?';
      let servicesPath = '/services/search?';

      const params: string[] = [];
      if (searchQuery && searchQuery.trim()) {
        params.push(`q=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (category && category !== 'All' && category.trim()) {
        params.push(`category=${encodeURIComponent(category.trim())}`);
      }
      if (location && location.trim() && location !== 'All Locations') {
        params.push(`location=${encodeURIComponent(location.trim())}`);
      }

      const queryString = params.join('&');
      goodsPath += queryString;
      servicesPath += queryString;

      const [goodsRes, servicesRes] = await Promise.all([
        apiClient.get(goodsPath).catch(() => ({ data: { data: { rows: [] } } })),
        apiClient.get(servicesPath).catch(() => ({ data: { data: { rows: [] } } })),
      ]);

      const goodsRows: any[] =
        goodsRes.data?.data?.rows || (Array.isArray(goodsRes.data?.data) ? goodsRes.data.data : []);
      const servicesRows: any[] =
        servicesRes.data?.data?.rows || (Array.isArray(servicesRes.data?.data) ? servicesRes.data.data : []);

      const products: MarketItem[] = goodsRows.map((g: any) => ({
        id: g.id,
        userId: g.userId,
        shopId: g.shopId,
        name: g.name || 'Product',
        price: Number(g.price) || 0,
        discount: Number(g.discount) || 0,
        description: g.description || '',
        category: g.category || 'Product',
        location: g.location || g.shop?.location,
        images: Array.isArray(g.images) ? g.images.filter(Boolean) : (g.image ? [g.image] : []),
        type: 'product',
        currency: g.shop?.currency || 'USD',
        createdAt: g.createdAt,
        shop: g.shop,
        user: g.user,
      }));

      const services: MarketItem[] = servicesRows.map((s: any) => ({
        id: s.id,
        userId: s.userId,
        shopId: s.shopId,
        name: s.name || 'Service',
        price: Number(s.price) || 0,
        discount: Number(s.discount) || 0,
        description: s.description || '',
        category: s.category || 'Service',
        location: s.location || s.shop?.location,
        images: Array.isArray(s.images) ? s.images.filter(Boolean) : (s.image ? [s.image] : []),
        type: 'service',
        currency: s.shop?.currency || 'USD',
        createdAt: s.createdAt,
        shop: s.shop,
        user: s.user,
      }));

      const combined = [...products, ...services];
      combined.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      return combined;
    } catch (err) {
      console.warn('Failed to fetch marketplace items', err);
      return [];
    }
  },

  /**
   * Legacy alias for compatibility with FeedFeaturedListingsSection
   */
  async getServices(category = 'All'): Promise<any[]> {
    const items = await this.getMarketItems({ category });
    return items.map((m) => ({
      id: String(m.id),
      title: m.name,
      thumbnailUrl: m.images[0] || '',
      price: m.price > 0 ? `${m.currency || '$'}${m.price.toLocaleString()}` : 'Free Quote',
      rating: m.user?.averageRating || 5.0,
      reviewsCount: 1,
      category: m.category,
      location: m.location,
      seller: {
        name: m.user?.name || m.shop?.name || 'Verified Boss',
        avatarUrl: m.user?.photoUrl || m.shop?.image || '',
        isPro: !!m.user?.isSubscribed,
      },
    }));
  },
};

export default marketplaceService;
