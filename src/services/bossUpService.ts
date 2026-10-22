import { apiClient } from '../lib/apiClient';

export interface BossUpCategory {
  industryId: string;
  categoryId?: string;
  industry: string;
  photo?: string;
  description?: string;
  award?: string;
  startAt?: string | null;
  endedAt?: string | null;
  criteria?: string;
  joinedUsersCount?: number;
}

export const bossUpService = {
  async getCategories(): Promise<BossUpCategory[]> {
    try {
      const res = await apiClient.get('/industry/user-count');
      const data = res.data?.data || res.data?.message || [];
      const rows: any[] = Array.isArray(data) ? data : (data.rows || []);

      const filtered = rows
        .map((cat: any) => ({
          industryId: String(cat.industryId || cat.id || cat._id),
          categoryId: cat.categoryId,
          industry: cat.industry || cat.name || '',
          photo: cat.photo || '',
          description: cat.description || '',
          award: cat.award || 'Win',
          startAt: cat.startAt || null,
          endedAt: cat.endedAt || null,
          criteria: cat.criteria || '',
          joinedUsersCount: Number(cat.joinedUsersCount || cat.userCount || 0),
        }))
        .filter((cat: BossUpCategory) => {
          const isTargetCategory = cat.categoryId === '-Mos1VMlx3oxZFRaw_BH';
          const isMainBossUp = cat.industryId === '-MsUOGcOT9oRXGakCcJv';
          const notEnded = !cat.endedAt || new Date(cat.endedAt).getTime() >= Date.now();
          return (isTargetCategory && notEnded) || isMainBossUp;
        });

      filtered.sort((a, b) => {
        if (a.industryId === '-MsUOGcOT9oRXGakCcJv') return -1;
        if (b.industryId === '-MsUOGcOT9oRXGakCcJv') return 1;
        return a.industry.localeCompare(b.industry);
      });

      return filtered;
    } catch (e) {
      console.error('Failed to load boss up categories', e);
      return [];
    }
  },
};
