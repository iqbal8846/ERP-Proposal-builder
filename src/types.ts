export type ModuleCategory = 'erp' | 'custom_dev' | 'website' | 'hosting' | 'custom';

export interface ProposalModule {
  id: string;
  title: string;
  description: string;
  priceTaqwa: number;
  priceSunvia: number;
  currentPrice: number;
  category: ModuleCategory;
  checked: boolean;
  isFree?: boolean;
}

export interface ProposalMetadata {
  referenceNo: string;
  date: string;
  preparedFor: string;
  website: string;
  attentionName: string;
  attentionRole: string;
  address: string;
  validity: string;
  preparedBy: string;
  preparedByRole: string;
  currency: string; // e.g. "BDT" or "USD"
  brandPreset: 'easytech' | 'custom';
  customBrandName: string;
  customBrandLogo: string;
  customBrandColor: string;
  customBrandSecondaryColor: string;
  vatRatePercent: number;
}

export interface PaymentTerm {
  percentage: number;
  label: string;
  amount: number;
  milestone: string;
}

export interface TimelinePhase {
  phase: string;
  activity: string;
  timeline: string;
}

export interface SupportWarrantyItem {
  id: string;
  text: string;
}

export interface AssumptionItem {
  id: string;
  text: string;
}
