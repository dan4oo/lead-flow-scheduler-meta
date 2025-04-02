
import { FacebookAdStats } from "@/types/crm";

// Mock Facebook Ads data - in a real app, this would come from the Facebook Marketing API
const mockFacebookAdsStats: Record<string, FacebookAdStats> = {
  "fb-camp-1": {
    campaignId: "fb-camp-1",
    impressions: 15420,
    clicks: 843,
    ctr: 5.47,
    leads: 32,
    calls: 18,
    cpc: 1.23,
    spend: 1037.29,
    lastUpdated: new Date("2023-11-10")
  },
  "fb-camp-2": {
    campaignId: "fb-camp-2",
    impressions: 8765,
    clicks: 412,
    ctr: 4.7,
    leads: 15,
    calls: 8,
    cpc: 1.56,
    spend: 642.72,
    lastUpdated: new Date("2023-11-12")
  },
  "fb-camp-3": {
    campaignId: "fb-camp-3",
    impressions: 21450,
    clicks: 1102,
    ctr: 5.14,
    leads: 41,
    calls: 22,
    cpc: 1.35,
    spend: 1487.7,
    lastUpdated: new Date("2023-11-15")
  }
};

export const getFacebookAdStats = (campaignId: string): Promise<FacebookAdStats | null> => {
  // Simulate API call latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFacebookAdsStats[campaignId] || null);
    }, 500);
  });
};

export const getAllFacebookAdStats = (): Promise<FacebookAdStats[]> => {
  // Simulate API call latency
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(mockFacebookAdsStats));
    }, 500);
  });
};
