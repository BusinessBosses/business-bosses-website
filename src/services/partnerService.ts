import { apiClient } from '../lib/apiClient';

export interface PartnerDeal {
  id: number | string;
  companyName: string;
  companyDescription?: string;
  companyUrl?: string;
  companyPhoto?: string | null;
  clicks: number;
  category?: string;
  partnershipType?: string;
  location?: string;
  companyEmail?: string;
  companyPhone?: string;
  createdAt?: string;
}

export const PARTNER_CATEGORIES = [
  'All',
  'Agriculture, Food & Beverage',
  'Business Services & Consulting',
  'Learning & Education',
  'Construction & Real Estate',
  'Fashion & Beauty',
  'Finance & Legal',
  'Healthcare & Wellness',
  'Home, Gardens & Outdoors',
  'Jewellery & Timepieces',
  'Media & Entertainment',
  'Security, Safety & Equipment',
  'Technology, Games & Electronic',
  'Vehicle & Transportation',
] as const;

export const partnerService = {
  /**
   * Fetch all partners/deals
   */
  async getPartners(page = 0, size = 50): Promise<PartnerDeal[]> {
    try {
      const res = await apiClient.get('/partner/all', {
        params: { page, size },
      });
      const rows = res.data?.data?.rows || (Array.isArray(res.data?.data) ? res.data.data : []);
      if (Array.isArray(rows)) {
        return rows.map((item: any) => ({
          id: item.id || item._id,
          companyName: item.companyName || item.name || 'Partner',
          companyDescription: item.companyDescription || item.description || '',
          companyUrl: item.companyUrl || item.website || item.user?.website || '',
          companyPhoto: item.companyPhoto || item.photoUrl || item.user?.photoUrl || null,
          clicks: Number(item.clicks || 0),
          category: item.category || 'Business Services & Consulting',
          partnershipType: item.partnershipType || 'marketplace',
          location: item.location || '',
          companyEmail: item.companyEmail || '',
          companyPhone: item.companyPhone || '',
          createdAt: item.createdAt,
        }));
      }
      return [];
    } catch (err) {
      console.warn('Error fetching partners list', err);
      return [];
    }
  },

  /**
   * Increment clicks for a partner
   */
  async incrementClicks(id: number | string, currentClicks = 0): Promise<void> {
    try {
      await apiClient.put(`/partner/${id}`, {
        clicks: currentClicks + 1,
      });
    } catch (err) {
      // Fire-and-forget
    }
  },

  /**
   * Submit a new partner deal
   */
  async submitPartnerDeal(payload: {
    companyName: string;
    companyDescription: string;
    companyUrl: string;
    category: string;
    companyPhoto?: string;
    companyEmail?: string;
    companyPhone?: string;
    location?: string;
    partnershipType?: string;
  }): Promise<boolean> {
    const res = await apiClient.post('/partner', {
      companyName: payload.companyName,
      companyDescription: payload.companyDescription,
      companyUrl: payload.companyUrl,
      category: payload.category,
      companyPhoto: payload.companyPhoto || undefined,
      companyEmail: payload.companyEmail,
      companyPhone: payload.companyPhone,
      location: payload.location,
      partnershipType: payload.partnershipType || 'marketplace',
    });
    return Boolean(res.data?.success);
  },
};
