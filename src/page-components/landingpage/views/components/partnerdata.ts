// partnerdata.ts

export interface Partner {
    id: number;
    companyPhoto: string;
    companyName: string;
    companyDescription: string;
    companyUrl: string;
  }
  
  export interface PartnerData {
    rows: Partner[];
  }
  