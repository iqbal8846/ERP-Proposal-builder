import React, { useState, useEffect } from 'react';
import { 
  FileText, Check, Plus, Trash2, ArrowUp, ArrowDown, Download, RefreshCw, 
  Settings, HelpCircle, LayoutGrid, DollarSign, Calendar, ShieldCheck, 
  ListChecks, Printer, Copy, CheckSquare, Sparkles, BookOpen, ExternalLink, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProposalModule, ProposalMetadata, TimelinePhase, SupportWarrantyItem, AssumptionItem, PaymentTerm } from './types';
import { 
  INITIAL_METADATA, DEFAULT_ERP_MODULES, DEFAULT_CUSTOM_DEV_MODULES, 
  DEFAULT_WEBSITE_MODULES, DEFAULT_HOSTING_MODULES, DEFAULT_TIMELINE_PHASES, 
  DEFAULT_SUPPORT_WARRANTY, DEFAULT_ASSUMPTIONS 
} from './data/modules';
import VercelGuide from './components/VercelGuide';

export default function App() {
  // State initialization with LocalStorage backing
  const [metadata, setMetadata] = useState<ProposalMetadata>(() => {
    const saved = localStorage.getItem('proposal_metadata');
    return saved ? JSON.parse(saved) : INITIAL_METADATA;
  });

  const [modules, setModules] = useState<ProposalModule[]>(() => {
    const saved = localStorage.getItem('proposal_modules');
    if (saved) return JSON.parse(saved);

    // Initial load: compile all modules from data
    const all: ProposalModule[] = [];
    
    // ERP Modules (checked by default except the last 3 housing/dev/master ones to let users customize)
    DEFAULT_ERP_MODULES.forEach((m, idx) => {
      all.push({
        ...m,
        currentPrice: m.priceTaqwa,
        checked: idx < DEFAULT_ERP_MODULES.length - 3, // default check core ERP & engineering modules
      });
    });

    // Custom Dev Modules (unchecked by default)
    DEFAULT_CUSTOM_DEV_MODULES.forEach(m => {
      all.push({
        ...m,
        currentPrice: m.priceTaqwa,
        checked: false,
      });
    });

    // Website Modules (checked by default in Taqwa style)
    DEFAULT_WEBSITE_MODULES.forEach(m => {
      all.push({
        ...m,
        currentPrice: m.priceTaqwa,
        checked: true,
      });
    });

    // Hosting Modules (checked by default)
    DEFAULT_HOSTING_MODULES.forEach(m => {
      all.push({
        ...m,
        currentPrice: m.priceTaqwa,
        checked: true,
      });
    });

    return all;
  });

  const [timeline, setTimeline] = useState<TimelinePhase[]>(() => {
    const saved = localStorage.getItem('proposal_timeline');
    return saved ? JSON.parse(saved) : DEFAULT_TIMELINE_PHASES;
  });

  const [supportWarranty, setSupportWarranty] = useState<SupportWarrantyItem[]>(() => {
    const saved = localStorage.getItem('proposal_support_warranty');
    return saved ? JSON.parse(saved) : DEFAULT_SUPPORT_WARRANTY;
  });

  const [assumptions, setAssumptions] = useState<AssumptionItem[]>(() => {
    const saved = localStorage.getItem('proposal_assumptions');
    return saved ? JSON.parse(saved) : DEFAULT_ASSUMPTIONS;
  });

  const [pricingScale, setPricingScale] = useState<'taqwa' | 'sunvia'>(() => {
    return (localStorage.getItem('proposal_pricing_scale') as 'taqwa' | 'sunvia') || 'taqwa';
  });

  const [activeTab, setActiveTab] = useState<'meta' | 'modules' | 'custom' | 'extra' | 'guide'>('modules');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Custom module creation fields
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customPrice, setCustomPrice] = useState('30000');
  const [customCategory, setCustomCategory] = useState<'erp' | 'custom_dev' | 'website' | 'hosting'>('erp');

  // Sync to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('proposal_metadata', JSON.stringify(metadata));
  }, [metadata]);

  useEffect(() => {
    localStorage.setItem('proposal_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('proposal_timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem('proposal_support_warranty', JSON.stringify(supportWarranty));
  }, [supportWarranty]);

  useEffect(() => {
    localStorage.setItem('proposal_assumptions', JSON.stringify(assumptions));
  }, [assumptions]);

  useEffect(() => {
    localStorage.setItem('proposal_pricing_scale', pricingScale);
  }, [pricingScale]);

  // Handle switching pricing preset scale
  const applyPricingScale = (scale: 'taqwa' | 'sunvia') => {
    setPricingScale(scale);
    setModules(prev => prev.map(m => {
      // Keep custom modules intact, only update system modules
      if (m.category === 'custom') return m;
      const targetPrice = scale === 'taqwa' ? m.priceTaqwa : m.priceSunvia;
      return {
        ...m,
        currentPrice: targetPrice
      };
    }));
  };

  // Toggle checklist checkbox
  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, checked: !m.checked } : m));
  };

  // Update inline price
  const handlePriceChange = (id: string, price: number) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, currentPrice: price } : m));
  };

  // Update inline Title
  const handleTitleChange = (id: string, title: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, title } : m));
  };

  // Update inline Description
  const handleDescriptionChange = (id: string, description: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, description } : m));
  };

  // Custom Item Adding
  const addCustomModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const priceNum = parseFloat(customPrice) || 0;
    const newModule: ProposalModule = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      description: customDesc,
      priceTaqwa: priceNum,
      priceSunvia: priceNum,
      currentPrice: priceNum,
      category: customCategory,
      checked: true
    };

    setModules(prev => [...prev, newModule]);
    setCustomTitle('');
    setCustomDesc('');
    setCustomPrice('30000');
    // Notify user
  };

  // Remove custom or regular module
  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  // Move Module (Up / Down) within its category for custom reordering
  const moveModule = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= modules.length) return;

    const updated = [...modules];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setModules(updated);
  };

  // Calculations
  const activeERP = modules.filter(m => m.checked && m.category === 'erp');
  const activeCustomDev = modules.filter(m => m.checked && m.category === 'custom_dev');
  const activeWebsite = modules.filter(m => m.checked && m.category === 'website');
  const activeHosting = modules.filter(m => m.checked && m.category === 'hosting');
  const activeCustomMisc = modules.filter(m => m.checked && m.category === 'custom');

  const erpSubtotal = activeERP.reduce((sum, m) => sum + m.currentPrice, 0);
  const customDevSubtotal = activeCustomDev.reduce((sum, m) => sum + m.currentPrice, 0);
  const websiteSubtotal = activeWebsite.reduce((sum, m) => sum + m.currentPrice, 0);
  const hostingSubtotal = activeHosting.reduce((sum, m) => sum + m.currentPrice, 0);
  const customMiscSubtotal = activeCustomMisc.reduce((sum, m) => sum + m.currentPrice, 0);

  // Subtotal for one-time development
  const oneTimeDevelopmentTotal = erpSubtotal + customDevSubtotal + websiteSubtotal + customMiscSubtotal;
  
  // Grand Total including Hosting
  const grandTotal = oneTimeDevelopmentTotal + hostingSubtotal;

  // Formatter BDT Taka
  const formatBDT = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Convert numbers to words (Bengali/Indian numbering style e.g. Taka Lakh etc)
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Twelve', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const g = (n: number): string => {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
    };
    
    const clean = (str: string) => str.trim().replace(/\s+/g, ' ');

    let words = '';
    
    // BDT standard Lakhs/Crore
    // Over 1 Crore (10000000)
    if (Math.floor(num / 10000000) > 0) {
      words += numberToWords(Math.floor(num / 10000000)) + ' Crore ';
      num %= 10000000;
    }
    // Lakhs (100000)
    if (Math.floor(num / 100000) > 0) {
      words += g(Math.floor(num / 100000)) + ' Lakh ';
      num %= 100000;
    }
    // Thousands (1000)
    if (Math.floor(num / 1000) > 0) {
      words += g(Math.floor(num / 1000)) + ' Thousand ';
      num %= 1000;
    }
    // Hundreds (100)
    if (Math.floor(num / 100) > 0) {
      words += g(Math.floor(num / 100)) + ' Hundred ';
      num %= 100;
    }
    // Rest
    if (num > 0) {
      words += g(num);
    }
    
    return clean(words) + ' Taka Only';
  };

  // Payment Milestone splits (Default 50%, 30%, 20%)
  const [percentAdvance, setPercentAdvance] = useState(50);
  const [percentUat, setPercentUat] = useState(30);
  const [percentHandover, setPercentHandover] = useState(20);

  const paymentTerms: PaymentTerm[] = [
    {
      percentage: percentAdvance,
      label: "Advance payment on confirmation",
      amount: Math.round((oneTimeDevelopmentTotal * percentAdvance) / 100),
      milestone: "Advance, on confirmation of the work order."
    },
    {
      percentage: percentUat,
      label: "Upon completion of development & successful UAT",
      amount: Math.round((oneTimeDevelopmentTotal * percentUat) / 100),
      milestone: "On completion of development and successful UAT."
    },
    {
      percentage: percentHandover,
      label: "Upon final deployment & project handover",
      amount: Math.round((oneTimeDevelopmentTotal * percentHandover) / 100),
      milestone: "On final deployment, go-live and handover."
    }
  ];

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore original proposal presets? This will reset all current custom modifications.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Trigger print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans no-print selection:bg-purple-600 selection:text-white">
      
      {/* Top Banner & Control Area */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-500/20 text-blue-400 font-semibold px-2 py-0.5 rounded-md border border-blue-500/30">
                PROPOSAL ENGINE v1.2
              </span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Real Estate ERP Proposal & Quotation Builder
            </h1>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex text-xs">
            <button 
              onClick={() => applyPricingScale('taqwa')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${pricingScale === 'taqwa' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Taqwa Landmark Scale
            </button>
            <button 
              onClick={() => applyPricingScale('sunvia')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${pricingScale === 'sunvia' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Sunvia Properties Scale
            </button>
          </div>

          <button 
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/20"
            id="btn-print-proposal"
          >
            <Printer className="w-4 h-4" />
            Print/Export PDF (A4)
          </button>

          <button 
            onClick={handleReset}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-2 border border-slate-700 transition-all"
            title="Reset All Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Controls Panel (Left Pane) */}
        <aside className="w-full md:w-[480px] border-r border-slate-800 bg-slate-950 flex flex-col shrink-0 overflow-y-auto">
          {/* Navigation Controls */}
          <div className="grid grid-cols-5 border-b border-slate-800 text-xs text-center font-medium sticky top-0 bg-slate-950 z-20">
            <button 
              onClick={() => setActiveTab('modules')}
              className={`py-3.5 border-b-2 flex flex-col items-center gap-1 transition-all ${activeTab === 'modules' ? 'border-blue-500 text-blue-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/20'}`}
            >
              <ListChecks className="w-4 h-4" />
              <span>Features</span>
            </button>
            <button 
              onClick={() => setActiveTab('custom')}
              className={`py-3.5 border-b-2 flex flex-col items-center gap-1 transition-all ${activeTab === 'custom' ? 'border-purple-500 text-purple-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/20'}`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom</span>
            </button>
            <button 
              onClick={() => setActiveTab('meta')}
              className={`py-3.5 border-b-2 flex flex-col items-center gap-1 transition-all ${activeTab === 'meta' ? 'border-amber-500 text-amber-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/20'}`}
            >
              <Settings className="w-4 h-4" />
              <span>Client Info</span>
            </button>
            <button 
              onClick={() => setActiveTab('extra')}
              className={`py-3.5 border-b-2 flex flex-col items-center gap-1 transition-all ${activeTab === 'extra' ? 'border-teal-500 text-teal-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/20'}`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Terms/Milestones</span>
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`py-3.5 border-b-2 flex flex-col items-center gap-1 transition-all ${activeTab === 'guide' ? 'border-indigo-500 text-indigo-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900/20'}`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Vercel Deploy</span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div className="p-5 flex-1 space-y-6">
            
            {/* 1. FEATURES LIST TAB */}
            {activeTab === 'modules' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-slate-200">Select Proposal Features</h2>
                  <div className="flex gap-1 text-[10px] bg-slate-800 p-1 rounded">
                    <button 
                      onClick={() => setFilterCategory('all')} 
                      className={`px-2 py-0.5 rounded ${filterCategory === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setFilterCategory('erp')} 
                      className={`px-2 py-0.5 rounded ${filterCategory === 'erp' ? 'bg-blue-600/30 text-blue-300' : 'text-slate-400'}`}
                    >
                      ERP ({activeERP.length})
                    </button>
                    <button 
                      onClick={() => setFilterCategory('website')} 
                      className={`px-2 py-0.5 rounded ${filterCategory === 'website' ? 'bg-amber-600/30 text-amber-300' : 'text-slate-400'}`}
                    >
                      Web ({activeWebsite.length})
                    </button>
                    <button 
                      onClick={() => setFilterCategory('hosting')} 
                      className={`px-2 py-0.5 rounded ${filterCategory === 'hosting' ? 'bg-teal-600/30 text-teal-300' : 'text-slate-400'}`}
                    >
                      Host ({activeHosting.length})
                    </button>
                  </div>
                </div>

                <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-3 text-xs text-blue-300">
                  <p className="font-semibold flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> Toggle &amp; Reorder
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Check modules to include them in the quotation. Adjust prices in real-time. Use the up/down arrows to change the order.
                  </p>
                </div>

                {/* Modules Checklist mapping */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {modules
                    .map((m, index) => ({ m, index }))
                    .filter(({ m }) => filterCategory === 'all' || m.category === filterCategory)
                    .map(({ m, index }) => (
                      <div 
                        key={m.id} 
                        className={`p-3 rounded-lg border text-xs transition-all flex items-start gap-3 ${
                          m.checked 
                            ? 'bg-slate-900/80 border-slate-700 hover:border-slate-600' 
                            : 'bg-slate-950/40 border-slate-900 opacity-60 hover:opacity-80'
                        }`}
                      >
                        {/* Checkbox */}
                        <button 
                          onClick={() => toggleModule(m.id)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            m.checked ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-700 bg-slate-900 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-200 block">{m.title}</span>
                            <span className="text-[10px] uppercase font-semibold text-slate-500 shrink-0">
                              {m.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.description}</p>
                          
                          {/* Price configuration */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
                            <span className="text-[11px] text-slate-500">Price ({metadata.currency}):</span>
                            <input 
                              type="number"
                              value={m.currentPrice}
                              onChange={(e) => handlePriceChange(m.id, parseFloat(e.target.value) || 0)}
                              className="bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white font-semibold w-24 focus:outline-none focus:border-blue-500"
                              disabled={m.isFree}
                            />
                            {m.isFree && <span className="text-emerald-400 font-bold text-[10px]">FREE</span>}
                          </div>
                        </div>

                        {/* Order Operations */}
                        <div className="flex flex-col gap-1 shrink-0">
                          <button 
                            onClick={() => moveModule(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-20 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => moveModule(index, 'down')}
                            disabled={index === modules.length - 1}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-20 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {m.category === 'custom' && (
                            <button 
                              onClick={() => deleteModule(m.id)}
                              className="p-1 hover:bg-red-950/30 text-red-400 hover:text-red-300 rounded transition-all"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* 2. CUSTOM MODULE CREATOR TAB */}
            {activeTab === 'custom' && (
              <form onSubmit={addCustomModule} className="space-y-4">
                <h2 className="font-bold text-sm text-slate-200">Add Custom Title &amp; Pricing</h2>
                <p className="text-xs text-slate-400">
                  Inject tailor-made modules, specific developer requirements, or general commission features directly into the proposal.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Module Category</label>
                    <select 
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="erp">Real Estate ERP Standard Module</option>
                      <option value="custom_dev">Custom Development / Multi-Company Module</option>
                      <option value="website">Corporate Website Feature</option>
                      <option value="hosting">Yearly Domain, Hosting &amp; Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Module Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dynamic SMS & WhatsApp Notification Integration"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">What It Does (Description)</label>
                    <textarea 
                      placeholder="Detail the module functions, API limits, or user workflows clearly..."
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Price (BDT)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="35000"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 pl-12 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-semibold"
                        required
                      />
                      <span className="absolute left-4 top-3 text-xs text-slate-500 font-bold">BDT</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-950/20"
                  >
                    <Plus className="w-4 h-4" />
                    Insert Custom Item
                  </button>
                </div>
              </form>
            )}

            {/* 3. METADATA SETTINGS TAB */}
            {activeTab === 'meta' && (
              <div className="space-y-4">
                <h2 className="font-bold text-sm text-slate-200">Client &amp; Quotation Metadata</h2>
                <p className="text-xs text-slate-400">
                  Update general contract particulars, reference codes, client addresses, and validity terms.
                </p>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Reference No.</label>
                      <input 
                        type="text" 
                        value={metadata.referenceNo} 
                        onChange={(e) => setMetadata({ ...metadata, referenceNo: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Proposal Date</label>
                      <input 
                        type="date" 
                        value={metadata.date} 
                        onChange={(e) => setMetadata({ ...metadata, date: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client Company (Prepared For)</label>
                    <input 
                      type="text" 
                      value={metadata.preparedFor} 
                      onChange={(e) => setMetadata({ ...metadata, preparedFor: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Attention Name</label>
                      <input 
                        type="text" 
                        value={metadata.attentionName} 
                        onChange={(e) => setMetadata({ ...metadata, attentionName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Attention Designation</label>
                      <input 
                        type="text" 
                        value={metadata.attentionRole} 
                        onChange={(e) => setMetadata({ ...metadata, attentionRole: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client Address</label>
                    <input 
                      type="text" 
                      value={metadata.address} 
                      onChange={(e) => setMetadata({ ...metadata, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-xs text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Offer Validity</label>
                      <input 
                        type="text" 
                        value={metadata.validity} 
                        onChange={(e) => setMetadata({ ...metadata, validity: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Client Website</label>
                      <input 
                        type="text" 
                        value={metadata.website} 
                        onChange={(e) => setMetadata({ ...metadata, website: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 mt-4 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">Brand Customization</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setMetadata({ ...metadata, brandPreset: 'easytech', preparedBy: 'EasyTech Solutions' })}
                        className={`py-2 px-3 text-xs font-semibold border rounded ${metadata.brandPreset === 'easytech' ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                      >
                        EasyTech Brand
                      </button>
                      <button 
                        type="button"
                        onClick={() => setMetadata({ ...metadata, brandPreset: 'custom' })}
                        className={`py-2 px-3 text-xs font-semibold border rounded ${metadata.brandPreset === 'custom' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'}`}
                      >
                        Custom Agency
                      </button>
                    </div>

                    {metadata.brandPreset === 'custom' && (
                      <div className="space-y-2 pt-2">
                        <input 
                          type="text" 
                          placeholder="Your Agency Name"
                          value={metadata.preparedBy}
                          onChange={(e) => setMetadata({ ...metadata, preparedBy: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="color" 
                            value={metadata.customBrandColor}
                            onChange={(e) => setMetadata({ ...metadata, customBrandColor: e.target.value })}
                            className="w-full h-8 rounded bg-slate-900 cursor-pointer border border-slate-800"
                            title="Primary Brand Color"
                          />
                          <input 
                            type="color" 
                            value={metadata.customBrandSecondaryColor}
                            onChange={(e) => setMetadata({ ...metadata, customBrandSecondaryColor: e.target.value })}
                            className="w-full h-8 rounded bg-slate-900 cursor-pointer border border-slate-800"
                            title="Secondary Accent Color"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. TERMS AND TIMELINE EXTRA TAB */}
            {activeTab === 'extra' && (
              <div className="space-y-4">
                <h2 className="font-bold text-sm text-slate-200">Milestone Payment splits</h2>
                <p className="text-xs text-slate-400">
                  Configure custom payment percentages. Milestones must sum to 100%. Current sum: <strong className={percentAdvance + percentUat + percentHandover === 100 ? "text-emerald-400" : "text-red-400"}>{percentAdvance + percentUat + percentHandover}%</strong>
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Advance payment (%)</label>
                    <input 
                      type="number" 
                      value={percentAdvance}
                      onChange={(e) => setPercentAdvance(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Development completion &amp; UAT (%)</label>
                    <input 
                      type="number" 
                      value={percentUat}
                      onChange={(e) => setPercentUat(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deployment &amp; Handover (%)</label>
                    <input 
                      type="number" 
                      value={percentHandover}
                      onChange={(e) => setPercentHandover(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-200 font-semibold"
                    />
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-300">Editable Assumptions</h3>
                    {assumptions.map((item, idx) => (
                      <div key={item.id} className="flex gap-1.5 items-start">
                        <textarea 
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...assumptions];
                            updated[idx].text = e.target.value;
                            setAssumptions(updated);
                          }}
                          rows={2}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-slate-300 leading-normal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. VERCEL GUIDE TAB */}
            {activeTab === 'guide' && (
              <VercelGuide />
            )}
            
          </div>
        </aside>

        {/* Live A4 Print Preview Panel (Right Pane) */}
        <main className="flex-1 bg-slate-800 overflow-y-auto p-8 relative flex flex-col items-center">
          
          {/* Zoom & Page indicator alert */}
          <div className="mb-6 w-full max-w-[800px] bg-slate-900/60 backdrop-blur-md p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs text-slate-300 shadow">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span><strong>Interactive Mode:</strong> Switch scales or edit values. Content changes are automatically synchronized.</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handlePrint} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Print/Save PDF
              </button>
            </div>
          </div>

          {/* PRINT VIEW WRAPPER */}
          {/* This specific ID block will be formatted into discrete pages by the print style */}
          <div className="proposal-print-container flex flex-col gap-10 items-center w-full">
            
            {/* PAGE 1: COVER PAGE */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              
              {/* Curve design at the top right */}
              <div className="absolute top-0 right-0 w-[120mm] h-[120mm] bg-gradient-to-bl from-blue-900 via-blue-800 to-transparent opacity-10 pointer-events-none rounded-bl-[100px]" />
              
              {/* Top Banner Row (Logo / Brand details) */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 relative z-10">
                <div className="flex items-center space-x-3">
                  {metadata.brandPreset === 'easytech' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-900 to-purple-800 flex items-center justify-center text-white font-bold text-lg rounded-tl-xl rounded-br-xl shadow-md rotate-12">
                        ET
                      </div>
                      <div>
                        <span className="text-xl font-black text-slate-900 tracking-tighter">easytech<span className="text-blue-600">.</span></span>
                        <span className="text-[10px] block text-slate-400 font-semibold tracking-widest uppercase">solutions</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xl font-bold tracking-tight" style={{ color: metadata.customBrandColor }}>
                        {metadata.preparedBy}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right text-[10px] text-slate-500 font-mono space-y-0.5 leading-snug">
                  <div>+880 1574-801616</div>
                  <div>www.easytechsolutions.xyz</div>
                  <div>23/2, SEL HUQ SKYPARK, Mirpur Rd,</div>
                  <div>Dhaka 1207, Bangladesh</div>
                </div>
              </div>

              {/* Cover Main Content */}
              <div className="my-auto py-12 relative z-10 flex flex-col items-center text-center">
                
                {/* Visual Accent Logo representation */}
                <div className="mb-8 w-36 h-36 border-4 border-slate-100 bg-slate-50 rounded-full flex items-center justify-center p-4 relative shadow-inner">
                  {metadata.brandPreset === 'easytech' ? (
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/10">
                      <FileText className="w-12 h-12" />
                    </div>
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-2xl flex items-center justify-center text-white"
                      style={{ backgroundColor: metadata.customBrandColor }}
                    >
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  {/* Decorative badges */}
                  <div className="absolute -bottom-2 bg-slate-900 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow">
                    ERP SOLUTION
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-[11px] font-bold tracking-[0.3em] text-blue-600 uppercase font-display">
                    PROPOSAL &amp; QUOTATION
                  </h2>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight max-w-[600px] leading-tight font-display">
                    Real Estate ERP &amp; Corporate Website Solution
                  </h3>
                  <p className="text-sm text-slate-500 font-mono">
                    Custom Build &amp; Modular Deployment for <strong>{metadata.preparedFor}</strong>
                  </p>
                </div>
              </div>

              {/* Cover Metadata Reference Table Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative z-10">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Reference No.</span>
                    <span className="font-bold font-mono text-slate-800">{metadata.referenceNo}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold text-slate-800">{metadata.date}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Prepared For</span>
                    <span className="font-bold text-slate-800 text-right">{metadata.preparedFor}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Attention</span>
                    <span className="font-bold text-slate-800 text-right">{metadata.attentionName}, {metadata.attentionRole}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Address</span>
                    <span className="font-bold text-slate-800 text-right truncate max-w-[180px]" title={metadata.address}>
                      {metadata.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="text-slate-500">Validity</span>
                    <span className="font-bold text-slate-800">{metadata.validity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Prepared By</span>
                    <span className="font-bold text-slate-800">{metadata.preparedBy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Website</span>
                    <span className="font-bold text-slate-800 font-mono">{metadata.website}</span>
                  </div>
                </div>
              </div>

              {/* Bottom decorative banner strip */}
              <div className="mt-6 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 1</span>
              </div>

              {/* Dual-tone purple/blue diagonal curves at bottom right */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full opacity-30 blur-xl pointer-events-none" />
            </section>

            {/* PAGE 2: INTRODUCTION & ERP TABLE */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{metadata.preparedBy} ERP Solution</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {metadata.referenceNo}</span>
                </div>

                {/* Section 1: Introduction */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    1. Introduction
                  </h3>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    {metadata.preparedBy} thanks <strong>{metadata.attentionName}</strong> and <strong>{metadata.preparedFor}</strong> for the opportunity to present this proposal. 
                    This submission covers the complete, highly responsive Real Estate ERP platform, custom multi-company plugins, and standard corporate website components. Every module works under one consolidated ecosystem to automate operations, construction finance, and sales workflows.
                  </p>
                </div>

                {/* Section 2: Solution Overview */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    2. Solution Overview
                  </h3>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed">
                    Our proposal includes three robust components: a complete <strong>Real Estate ERP</strong> platform covering core developer modules, 
                    corporate website design, and secure cloud hosting infrastructure required to run both. 
                    Each segment is designed modularly so you can select, disable, or modify individual features based on immediate business priorities.
                  </p>
                </div>

                {/* Section 3: ERP Modules Table */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                      3. Real Estate ERP — Module Quotation
                    </h3>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Category: Core Platforms
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-[11px] leading-normal border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold uppercase text-[9px] tracking-wider">
                          <th className="p-2.5 w-[35%]">Module</th>
                          <th className="p-2.5 w-[50%]">What It Does</th>
                          <th className="p-2.5 w-[15%] text-right">Price (BDT)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeERP.slice(0, 10).map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/40">
                            <td className="p-2.5 font-bold text-slate-800">{m.title}</td>
                            <td className="p-2.5 text-slate-600 leading-snug">{m.description}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              {m.isFree ? <span className="text-emerald-600">Free</span> : formatBDT(m.currentPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {activeERP.length > 10 && (
                    <div className="text-[10px] text-slate-400 text-center italic mt-1">
                      (Remaining ERP modules continued on the next page...)
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 2</span>
              </div>
            </section>

            {/* PAGE 3: ERP CONTINUED & CUSTOM DEV / WEBSITE TABLES */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              <div className="space-y-5">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modular Platform Features</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {metadata.referenceNo}</span>
                </div>

                {/* Continued ERP modules if any */}
                {activeERP.length > 10 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide font-display">3.1 Real Estate ERP (Continued)</h4>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-[11px] leading-normal border-collapse">
                        <tbody className="divide-y divide-slate-100">
                          {activeERP.slice(10).map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/40">
                              <td className="p-2.5 w-[35%] font-bold text-slate-800">{m.title}</td>
                              <td className="p-2.5 w-[50%] text-slate-600 leading-snug">{m.description}</td>
                              <td className="p-2.5 w-[15%] text-right font-mono font-bold text-slate-900">
                                {m.isFree ? <span className="text-emerald-600">Free</span> : formatBDT(m.currentPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Custom Development Section */}
                {activeCustomDev.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                      4. Custom Development — Price Menu
                    </h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-2.5 w-[35%]">Module</th>
                            <th className="p-2.5 w-[50%]">What It Does</th>
                            <th className="p-2.5 w-[15%] text-right">Price (BDT)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeCustomDev.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/40">
                              <td className="p-2.5 font-bold text-slate-800">{m.title}</td>
                              <td className="p-2.5 text-slate-600 leading-snug">{m.description}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                {m.isFree ? <span className="text-emerald-600">Free</span> : formatBDT(m.currentPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 3</span>
              </div>
            </section>

            {/* PAGE 4: WEBSITE & HOSTING MODULES */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website &amp; Infrastructure Specifications</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {metadata.referenceNo}</span>
                </div>

                {/* Website Section */}
                {activeWebsite.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                      5. Corporate Website — Feature Breakdown
                    </h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-2.5 w-[35%]">Module</th>
                            <th className="p-2.5 w-[50%]">What It Does</th>
                            <th className="p-2.5 w-[15%] text-right">Price (BDT)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeWebsite.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/40">
                              <td className="p-2.5 font-bold text-slate-800">{m.title}</td>
                              <td className="p-2.5 text-slate-600 leading-snug">{m.description}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                {m.isFree ? <span className="text-emerald-600">Free</span> : formatBDT(m.currentPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Hosting section */}
                {activeHosting.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                      6. Yearly Domain, Hosting &amp; Maintenance
                    </h3>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-[11px] border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold uppercase text-[9px] tracking-wider">
                            <th className="p-2.5 w-[35%]">Service Module</th>
                            <th className="p-2.5 w-[50%]">What It Covers</th>
                            <th className="p-2.5 w-[15%] text-right">Price (BDT)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeHosting.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/40">
                              <td className="p-2.5 font-bold text-slate-800">{m.title}</td>
                              <td className="p-2.5 text-slate-600 leading-snug">{m.description}</td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                {m.isFree ? <span className="text-emerald-600">Free</span> : formatBDT(m.currentPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 4</span>
              </div>
            </section>

            {/* PAGE 5: COMMERCIAL SUMMARY & PAYMENT TERMS */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commercial Quotation &amp; Summary</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {metadata.referenceNo}</span>
                </div>

                {/* Commercial Quotation Summary block */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    7. Commercial Quotation Summary
                  </h3>
                  
                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 space-y-2 text-xs">
                      {activeERP.length > 0 && (
                        <div className="flex justify-between items-center text-slate-700">
                          <span>Real Estate ERP — Subtotal</span>
                          <span className="font-mono font-semibold">{formatBDT(erpSubtotal)} BDT</span>
                        </div>
                      )}
                      
                      {activeCustomDev.length > 0 && (
                        <div className="flex justify-between items-center text-slate-700">
                          <span>Custom Modules Integration — Subtotal</span>
                          <span className="font-mono font-semibold">{formatBDT(customDevSubtotal)} BDT</span>
                        </div>
                      )}
                      
                      {activeWebsite.length > 0 && (
                        <div className="flex justify-between items-center text-slate-700">
                          <span>Corporate Website — Subtotal</span>
                          <span className="font-mono font-semibold">{formatBDT(websiteSubtotal)} BDT</span>
                        </div>
                      )}

                      {activeCustomMisc.length > 0 && (
                        <div className="flex justify-between items-center text-slate-700">
                          <span>Custom Client Features — Subtotal</span>
                          <span className="font-mono font-semibold">{formatBDT(customMiscSubtotal)} BDT</span>
                        </div>
                      )}

                      <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center text-slate-900 font-bold bg-slate-100 p-2 rounded">
                        <span>ONE-TIME DEVELOPMENT TOTAL</span>
                        <span className="font-mono text-blue-900">{formatBDT(oneTimeDevelopmentTotal)} BDT /-</span>
                      </div>

                      {activeHosting.length > 0 && (
                        <div className="flex justify-between items-center text-slate-700 pt-1">
                          <span>Yearly Hosting, Support &amp; Maintenance (Year 1)</span>
                          <span className="font-mono font-semibold">{formatBDT(hostingSubtotal)} BDT</span>
                        </div>
                      )}

                      <div className="border-t-2 border-slate-300 pt-3 flex justify-between items-center font-black text-sm bg-blue-900 text-white p-3 rounded-lg shadow">
                        <span>GRAND TOTAL (Including Hosting Year 1)</span>
                        <span className="font-mono text-amber-300">{formatBDT(grandTotal)} BDT /-</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic leading-normal">
                    <strong>In Words:</strong> {numberToWords(grandTotal)}. BDT pricing excludes applicable Government VAT and Tax (if any), which are charged as per prevailing Bangladesh business laws.
                  </p>
                </div>

                {/* Section 8: Payment Terms */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    8. Payment Terms
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {paymentTerms.map((term, index) => (
                      <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            {term.percentage}% Milestone
                          </span>
                          <p className="text-[10.5px] font-semibold text-slate-800 mt-2 leading-tight">
                            {term.label}
                          </p>
                        </div>
                        <div className="border-t border-slate-200 pt-2 mt-2">
                          <span className="text-[10px] text-slate-400 block">Amount ({metadata.currency}):</span>
                          <span className="font-mono font-bold text-slate-900 text-xs">
                            {formatBDT(term.amount)} BDT
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 5</span>
              </div>
            </section>

            {/* PAGE 5: TIMELINE, WARRANTY & SIGNATURES */}
            <section className="print-page relative bg-white text-slate-950 w-[210mm] min-h-[297mm] shadow-2xl rounded p-[15mm] flex flex-col justify-between overflow-hidden">
              <div className="space-y-5">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Timeline &amp; Support</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {metadata.referenceNo}</span>
                </div>

                {/* Section 9: Timeline */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    9. Project Delivery Timeline
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold text-[9px] uppercase tracking-wider">
                          <th className="p-2.5 w-[20%]">Phase</th>
                          <th className="p-2.5 w-[60%]">Activities Included</th>
                          <th className="p-2.5 w-[20%] text-right">Target Timeline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {timeline.map((t, idx) => (
                          <tr key={idx} className="odd:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                            <td className="p-2.5 font-bold text-blue-900">{t.phase}</td>
                            <td className="p-2.5 text-slate-700 leading-snug">{t.activity}</td>
                            <td className="p-2.5 text-right font-semibold text-slate-900 font-mono">{t.timeline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-slate-500 italic leading-snug">
                    * Estimated delivery: approximately 25 working days from work order, subject to timely client feedback and credentials access. ERP and Website modules run in parallel.
                  </p>
                </div>

                {/* Section 10: Support & Warranty */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    10. Support &amp; Warranty Terms
                  </h3>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4 leading-relaxed">
                    {supportWarranty.map((item) => (
                      <li key={item.id}>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section 11: Assumptions */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-blue-900 border-l-4 border-blue-600 pl-3 uppercase font-display tracking-tight">
                    11. Assumptions &amp; Notes
                  </h3>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc pl-4 leading-relaxed">
                    {assumptions.map((item) => (
                      <li key={item.id}>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Signatures Area */}
                <div className="pt-10">
                  <div className="grid grid-cols-2 gap-10 text-xs">
                    
                    {/* Prepared By Signature */}
                    <div className="space-y-6">
                      <p className="font-bold text-slate-800">For {metadata.preparedBy}</p>
                      <div className="border-b border-slate-300 w-full h-8 flex items-end">
                        {/* Interactive Digital Autopen representation */}
                        <span className="font-mono italic text-[11px] text-slate-400 pl-2">Authorized Signatory</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        <p className="font-bold text-slate-700">{metadata.preparedBy}</p>
                        <p>{metadata.preparedByRole}</p>
                      </div>
                    </div>

                    {/* Accepted By Signature */}
                    <div className="space-y-6">
                      <p className="font-bold text-slate-800">Accepted by {metadata.preparedFor}</p>
                      <div className="border-b border-slate-300 w-full h-8 flex items-end">
                        <span className="font-mono italic text-[11px] text-slate-300">Company Seal &amp; Signature</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        <p className="font-bold text-slate-700">{metadata.attentionName}</p>
                        <p>{metadata.attentionRole} / {metadata.preparedFor}</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom footer */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
                <span>{metadata.preparedBy} | Proposal &amp; Quotation</span>
                <span>Page 6</span>
              </div>
            </section>

          </div>
        </main>
      </div>

    </div>
  );
}
