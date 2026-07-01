import React from 'react';
import { Cloud, CheckCircle, ArrowRight, FileText, Smartphone, Laptop, Sparkles, Terminal, Globe, Github } from 'lucide-react';

export default function VercelGuide() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-slate-800 space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Cloud className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900">Vercel & Usage Guide</h3>
          <p className="text-xs text-slate-500">Deploy, manage, and print your client proposals</p>
        </div>
      </div>

      {/* Interactive Usage Info */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" /> Quick Proposal Tips
        </h4>
        <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
          <li><strong>Tick & Unmark:</strong> Use the checklists in the sidebar or directly toggle the checkbox on the live table row to instantly add/remove any feature.</li>
          <li><strong>Inline Edit:</strong> You can click and type directly on any table cell, title, or reference detail in the A4 live preview.</li>
          <li><strong>Drag & Reorder:</strong> Click the Up/Down arrows beside any item in the active list to easily move items to different positions.</li>
          <li><strong>PDF Print Settings:</strong> Clicking &quot;Print/Export to PDF&quot; triggers the browser print dialog. Set Destination to <strong>Save as PDF</strong>, Layout to <strong>Portrait</strong>, Paper size to <strong>A4</strong>, and check <strong>Background graphics</strong> to preserve the colors.</li>
        </ul>
      </div>

      {/* Step-by-Step Vercel Upload */}
      <div className="space-y-4 border-t border-slate-200 pt-4">
        <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600" /> How to Deploy to Vercel
        </h4>

        <div className="relative border-l border-blue-100 ml-3.5 pl-6 space-y-6 text-xs">
          {/* Step 1 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
              1
            </span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900 flex items-center gap-1">
                Download Code or Connect GitHub <span className="text-[10px] text-slate-400 font-normal">(Recommended)</span>
              </h5>
              <p className="text-slate-600">
                You can push this project directory directly to your own GitHub repository. Vercel automatically deploys every commit.
              </p>
              <div className="bg-slate-800 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] mt-1.5 flex items-center justify-between">
                <span>git init && git add . && git commit -m &quot;init&quot;</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
              2
            </span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900">Sign Up / Login on Vercel</h5>
              <p className="text-slate-600">
                Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">vercel.com</a> and sign in with your GitHub account.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
              3
            </span>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-900">Import Project</h5>
              <p className="text-slate-600">
                Click <strong>&quot;Add New&quot; &gt; &quot;Project&quot;</strong>, choose your imported GitHub repository, and click <strong>&quot;Deploy&quot;</strong>.
              </p>
              <p className="text-slate-500 italic mt-1">
                Vercel automatically detects React & Vite settings and deploys in less than 30 seconds!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <span className="absolute -left-[31px] top-0.5 bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
              ✓
            </span>
            <div className="space-y-1">
              <h5 className="font-bold text-emerald-800">Alternative: Direct Drag & Drop</h5>
              <p className="text-slate-600">
                If you prefer not to use Git, build the project locally using:
              </p>
              <div className="bg-slate-800 text-slate-200 p-2 font-mono text-[11px] rounded-lg mt-1">
                npm run build
              </div>
              <p className="text-slate-600 mt-1">
                Then drag the generated <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">dist</code> folder directly into Vercel&apos;s manual deployment area at <a href="https://vercel.com/import/deploy" target="_blank" rel="noreferrer" className="text-blue-600 underline">vercel.com/import/deploy</a>!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2">
        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Completely Client-Side:</strong> Since this app requires no databases, it operates completely in local storage. All changes, presets, and customized prices you type are preserved even if you reload the page!
        </div>
      </div>
    </div>
  );
}
