export interface AffiliateStore {
  name: string;
  address: string;
  location: {
    lat: number;
    lon: number;
  };
}

export interface Affiliate {
  id?: string;
  name: string;
  email: string;
  stores?: AffiliateStore[];
}
