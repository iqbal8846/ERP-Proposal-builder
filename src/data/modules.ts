import { ProposalModule, ProposalMetadata, TimelinePhase, SupportWarrantyItem, AssumptionItem } from '../types';

export const INITIAL_METADATA: ProposalMetadata = {
  referenceNo: "ETS/TQL-SVP/2026/Q-01",
  date: "2026-07-01",
  preparedFor: "Taqwa Landmark Ltd. & Sunvia Properties Ltd.",
  website: "taqwalankmark.com",
  attentionName: "Mr. Hasan Ahmad",
  attentionRole: "Managing Director",
  address: "Mirpur, DOHS, Dhaka, Bangladesh",
  validity: "15 days from issue",
  preparedBy: "EasyTech Solutions",
  preparedByRole: "Authorized Business Representative",
  currency: "BDT",
  brandPreset: "easytech",
  customBrandName: "EasyTech Solutions",
  customBrandLogo: "",
  customBrandColor: "#1e3a8a", // Royal Blue
  customBrandSecondaryColor: "#7c3aed", // Violet / Purple
  vatRatePercent: 0, // Exclusive of VAT
};

export const DEFAULT_ERP_MODULES: Omit<ProposalModule, 'currentPrice' | 'checked'>[] = [
  {
    id: "erp-sales-lead",
    title: "Sales Dashboard & Lead Management",
    description: "Central sales overview, lead capture, assignment, follow-up tracking (today/upcoming), and onboarding pipeline.",
    priceTaqwa: 55000,
    priceSunvia: 70000,
    category: "erp",
  },
  {
    id: "erp-project-inventory",
    title: "Project & Flat Inventory Management",
    description: "Add/manage projects and flats, with project-wise flat stock and live inventory status.",
    priceTaqwa: 40000,
    priceSunvia: 55000,
    category: "erp",
  },
  {
    id: "erp-sales-performance",
    title: "Sales Executive Team & Performance",
    description: "Sales team setup with individual and team performance tracking, conversion rate and booking summaries.",
    priceTaqwa: 25000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-hr-employee",
    title: "HR Dashboard & Employee Management",
    description: "Employee records, departments, designations, and a real-time HR overview with attendance snapshot.",
    priceTaqwa: 35000,
    priceSunvia: 45000,
    category: "erp",
  },
  {
    id: "erp-attendance-leave",
    title: "Attendance & Leave Management",
    description: "Daily attendance tracking, holiday/day-off calendar, leave types and employee leave requests.",
    priceTaqwa: 25000,
    priceSunvia: 30000,
    category: "erp",
  },
  {
    id: "erp-payroll-payslip",
    title: "Payroll & Payslip Management",
    description: "Monthly salary processing, payslip item configuration and payslip generation per employee.",
    priceTaqwa: 30000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-ced",
    title: "CED — Customer Experience Department",
    description: "Client collection tracking, payment status (on-track/pending/overdue), and onboarded client access.",
    priceTaqwa: 35000,
    priceSunvia: 40000,
    category: "erp",
  },
  {
    id: "erp-accounts-statement",
    title: "Accounts Dashboard & Central Statement",
    description: "Group-wide cash-in/cash-out summary, revenue and expense overview, and a full filterable central statement.",
    priceTaqwa: 50000,
    priceSunvia: 55000,
    category: "erp",
  },
  {
    id: "erp-cash-in-out",
    title: "Cash In / Cash Out Management",
    description: "Client and management cash-in tracking; cashout requests and expense adjustment workflow.",
    priceTaqwa: 25000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-construction-finance",
    title: "Construction Finance",
    description: "Vendor payments, contractor bills, transactions ledger, pending payments and land requisitions.",
    priceTaqwa: 45000,
    priceSunvia: 55000,
    category: "erp",
  },
  {
    id: "erp-construction-project",
    title: "Construction & Project Management Dashboard",
    description: "Live tracking across all active projects — budgets, manpower cost, stock alerts and project progress.",
    priceTaqwa: 50000,
    priceSunvia: 70000,
    category: "erp",
  },
  {
    id: "erp-architecture-eng",
    title: "Architecture & Engineering Dashboard",
    description: "Architecture & engineering record-keeping per project, with completion status and quick-add actions.",
    priceTaqwa: 30000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-procurement-purchase",
    title: "Procurement & Purchase Department Hub",
    description: "End-to-end purchasing loop for bulk raw materials (rod, cement, sand, bricks, tiles, electrical & sanitary). Supports multi-tier site requisitions, vendor quotation collections, automated side-by-side Comparative Statement (CS) matrix generation, Approved Supplier lists, multi-stage Purchase Order (PO) dispatch, and vendor rating analytics.",
    priceTaqwa: 40000,
    priceSunvia: 50000,
    category: "erp",
  },
  {
    id: "erp-qc-audit",
    title: "QC (Quality Control) & Construction Audit Desk",
    description: "Engineering quality assurance & audit logging. Tracks steel tensile strength reviews, concrete cylinder compression test logs (7, 14, 28-day cure results), physical brick/sand/cement compliance reports, site safety audit checklists, and digital material reconciliation (compares BOQ estimates vs. actual site consumption with wastage alerts).",
    priceTaqwa: 35000,
    priceSunvia: 45000,
    category: "erp",
  },
  {
    id: "erp-admin-ops-logistics",
    title: "Admin, Operations & Construction Logistics",
    description: "Tracks site logistics and legal permissions: heavy machinery logs (excavators, concrete mixers, fuel tracking, maintenance), security guard shift schedules, vehicle trip cards, municipal utility setups (electricity, water, gas approval pipelines), and municipal code RAJUK/Municipal compliance rosters.",
    priceTaqwa: 30000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-site-engineer-diary",
    title: "Site Engineer Portal & Daily Site Diary",
    description: "Mobile-friendly logging console for Site Engineers: log daily masonry/RCC work progress, labor attendance (muster-roll), site weather conditions, minor local cash purchase entries, concrete casting schedule planners, site delay/safety issue reports, and daily progress photo uploads.",
    priceTaqwa: 35000,
    priceSunvia: 40000,
    category: "erp",
  },
  {
    id: "erp-land-legal",
    title: "Land Acquisition & Joint-Venture Legal Panel",
    description: "Tracks joint-ventures and landowner particulars: negotiation logs, registered deed archives, Power of Attorney (PoA) validation, mutation status, boundary survey records, joint-venture profit/flat splits, municipal clearance filings (RAJUK/Municipal planning permission), and legal dispute tracking.",
    priceTaqwa: 40000,
    priceSunvia: 45000,
    category: "erp",
  },
  {
    id: "erp-architect-technical",
    title: "Architect & Draftsman Design Hub",
    description: "CAD blueprint & revision workspace for Architects and Draftsmen. Organizes structural sheets, spatial layouts, MEP drawings, and plumbing schematics under strict revision controls (Rev A, B, C) with automatic site engineer alerts upon blueprint changes.",
    priceTaqwa: 30000,
    priceSunvia: 35000,
    category: "erp",
  },
  {
    id: "erp-estimator-boq",
    title: "Estimator Engine & Bill of Quantities (BOQ)",
    description: "Quantity surveying & costestimation workbench for Estimators. Supports digital takeoff formulas (concrete volume cubic factors, steel reinforcing multipliers, brick density rates), customizable rate catalogs, and automated generation of detailed project Bill of Quantities (BOQ).",
    priceTaqwa: 35000,
    priceSunvia: 40000,
    category: "erp",
  },
  {
    id: "erp-role-permission",
    title: "Role & Permission Management",
    description: "User accounts, role-based access and granular permission control across the platform.",
    priceTaqwa: 20000,
    priceSunvia: 25000,
    category: "erp",
  },
  {
    id: "erp-site-blog",
    title: "Site, Blog & Content Management",
    description: "Website slider, site settings, flat purchase rules and blog content management.",
    priceTaqwa: 15000,
    priceSunvia: 15000,
    category: "erp",
  },
  {
    id: "erp-land-sharing",
    title: "Land Sharing / Housing Business Module",
    description: "Dedicated tracking for plot-wise land selling on your own land — plot inventory, buyer records, payments and plot-level profit, kept fully separate from developer-business accounts.",
    priceTaqwa: 45000,
    priceSunvia: 45000,
    category: "erp",
  },
  {
    id: "erp-developer-jv",
    title: "Developer Business Module (Joint-Venture Tracking)",
    description: "Dedicated tracking for landowner joint-venture projects (e.g. a 10-floor, 40-flat building on a partner's land under a 50% share agreement) — per-project expense, income and profit-split tracking, kept fully separate from land sharing accounts.",
    priceTaqwa: 45000,
    priceSunvia: 45000,
    category: "erp",
  },
  {
    id: "erp-master-dashboard",
    title: "Master Dashboard (Group-Wide Progress)",
    description: "A single top-level dashboard consolidating real-time progress, expenses and profit across all three business lines — own land sharing, own plan/construction, and developer joint-ventures.",
    priceTaqwa: 30000,
    priceSunvia: 30000,
    category: "erp",
  }
];

export const DEFAULT_CUSTOM_DEV_MODULES: Omit<ProposalModule, 'currentPrice' | 'checked'>[] = [
  {
    id: "cust-central-dashboard",
    title: "Central Management Dashboard + Investor Portal",
    description: "Single command-center for ownership, with full administrative control over a dedicated, management-curated Investor Portal.",
    priceTaqwa: 60000,
    priceSunvia: 60000,
    category: "custom_dev",
  },
  {
    id: "cust-land-requisition",
    title: "Land & Requisition + Land/Housing Inventory",
    description: "Land acquisition records, requisition approval workflow, and plot/housing inventory linked directly to Sales.",
    priceTaqwa: 0,
    priceSunvia: 0,
    category: "custom_dev",
    isFree: true
  },
  {
    id: "cust-tourism-hotel",
    title: "Tourism & Resort/Hotel Modules (API Integration)",
    description: "Dedicated Tourism and Resort & Hotel modules, API-connected to the Real Estate ERP and tracked from one dashboard.",
    priceTaqwa: 65000,
    priceSunvia: 65000,
    category: "custom_dev",
  },
  {
    id: "cust-commission-engine",
    title: "Group-Wide Multi-Tier Commission Engine",
    description: "Team-wise and designation-ranked commission, cross-company eligibility, freelancer program, and universal selling rights — anyone in the group can sell and earn.",
    priceTaqwa: 85000,
    priceSunvia: 85000,
    category: "custom_dev",
  },
  {
    id: "cust-personal-dashboard",
    title: "Personal Dashboard — Every Employee, Freelancer & Client",
    description: "An individual dashboard for every employee, freelance salesperson and client, showing personal sales, commission and bookings.",
    priceTaqwa: 45000,
    priceSunvia: 45000,
    category: "custom_dev",
  },
  {
    id: "cust-ai-assistant",
    title: "Ai Assistant Integration in Management Dashboard",
    description: "A built-in AI assistant on the Management Dashboard that answers plain-language questions, instantly pulling sales, accounts, construction and HR data into one summary — no need to navigate modules separately.",
    priceTaqwa: 0,
    priceSunvia: 0,
    category: "custom_dev",
    isFree: true
  }
];

export const DEFAULT_WEBSITE_MODULES: Omit<ProposalModule, 'currentPrice' | 'checked'>[] = [
  {
    id: "web-homepage",
    title: "Homepage & Brand Identity Design",
    description: "Custom-designed homepage reflecting Taqwa/Sunvia Landmark's brand, with hero banners and key project highlights.",
    priceTaqwa: 18000,
    priceSunvia: 18000,
    category: "website",
  },
  {
    id: "web-showcase",
    title: "Project & Property Showcase Pages",
    description: "Dedicated pages for each residential/commercial project with details, amenities and specifications.",
    priceTaqwa: 25000,
    priceSunvia: 25000,
    category: "website",
  },
  {
    id: "web-listings",
    title: "Property/Unit Listing with Filters",
    description: "Searchable property/unit listing with filters by location, size, price and availability.",
    priceTaqwa: 15000,
    priceSunvia: 15000,
    category: "website",
  },
  {
    id: "web-gallery",
    title: "Gallery & Media Section",
    description: "Photo and video gallery showcasing completed and ongoing projects.",
    priceTaqwa: 8000,
    priceSunvia: 8000,
    category: "website",
  },
  {
    id: "web-about",
    title: "About, Team & Company Pages",
    description: "Company profile, leadership team and corporate information pages.",
    priceTaqwa: 7000,
    priceSunvia: 7000,
    category: "website",
  },
  {
    id: "web-leads",
    title: "Inquiry & Lead Capture Forms",
    description: "Contact and project-inquiry forms that route leads directly for follow-up.",
    priceTaqwa: 10000,
    priceSunvia: 10000,
    category: "website",
  },
  {
    id: "web-blog",
    title: "Blog / News Management",
    description: "Company blog/news section for updates, announcements and SEO content.",
    priceTaqwa: 7000,
    priceSunvia: 7000,
    category: "website",
  },
  {
    id: "web-admin",
    title: "Admin CMS Panel",
    description: "Content management panel for the team to update projects, pages and blog posts without developer support.",
    priceTaqwa: 10000,
    priceSunvia: 10000,
    category: "website",
  }
];

export const DEFAULT_HOSTING_MODULES: Omit<ProposalModule, 'currentPrice' | 'checked'>[] = [
  {
    id: "host-domain",
    title: "Domain Registration & Renewal (.com)",
    description: "Annual registration/renewal of the company domain name.",
    priceTaqwa: 3000,
    priceSunvia: 3000,
    category: "hosting",
  },
  {
    id: "host-vps",
    title: "VPS Hosting (Website + ERP)",
    description: "Dedicated VPS server resources to run both the website and the ERP platform.",
    priceTaqwa: 30000,
    priceSunvia: 30000,
    category: "hosting",
  },
  {
    id: "host-ssl",
    title: "SSL Certificate & Email Hosting",
    description: "Secure HTTPS certificate plus professional company email hosting.",
    priceTaqwa: 5000,
    priceSunvia: 5000,
    category: "hosting",
  },
  {
    id: "host-maint",
    title: "Annual Maintenance & Technical Support",
    description: "Routine server maintenance, monitoring and technical support across the year.",
    priceTaqwa: 7000,
    priceSunvia: 7000,
    category: "hosting",
  }
];

export const DEFAULT_TIMELINE_PHASES: TimelinePhase[] = [
  { phase: "Phase 1", activity: "Requirement finalization & data-model design", timeline: "Day 1 – 3" },
  { phase: "Phase 2", activity: "ERP development — all selected modules", timeline: "Day 3 – 20" },
  { phase: "Phase 3", activity: "Website design & development", timeline: "Day 3 – 15" },
  { phase: "Phase 4", activity: "Server, domain & hosting setup", timeline: "Day 15 – 18" },
  { phase: "Phase 5", activity: "Integration testing, UAT, deployment, training & handover", timeline: "Day 20 – 25" },
];

export const DEFAULT_SUPPORT_WARRANTY: SupportWarrantyItem[] = [
  { id: "sw-1", text: "90 days of complimentary bug-fix warranty from the go-live date on the ERP and website." },
  { id: "sw-2", text: "Hosting, domain renewal and routine maintenance are covered under the yearly package from Year 1 onward." },
  { id: "sw-3", text: "Additional feature requests beyond this scope will be quoted separately." }
];

export const DEFAULT_ASSUMPTIONS: AssumptionItem[] = [
  { id: "as-1", text: "The Land Sharing / Housing module and the Developer (Joint-Venture) module maintain fully separate expense, income and profit tracking from each other." },
  { id: "as-2", text: "Module and feature prices assume standard configuration as shown in our live demo and reference website." },
  { id: "as-3", text: "Domain name and VPS provider will be selected and provisioned by EasyTech on customer's behalf, with account ownership transferred to the client." },
  { id: "as-4", text: "The yearly hosting package is mandatory from Year 1 to keep both platforms live, secure and maintained, and renews annually." }
];
