$routes = @(
    "executive",
    "executive/revenue",
    "executive/operations",
    "executive/clinical",
    "executive/population-health",
    "executive/capacity",
    "executive/benchmarking",
    "analytics-studio",
    "analytics-studio/reports",
    "analytics-studio/dashboards",
    "analytics-studio/exports",
    "observability/analytics",
    "observability/analytics/queries",
    "observability/analytics/metrics"
)

foreach ($route in $routes) {
    $dir = "c:\node-projects\opd-system\frontend\app\$route"
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    
    $content = @"
import React from 'react';

export default function Page() {
  return (
    <div className=`"min-h-screen bg-slate-950 text-slate-100 p-8`">
      <div className=`"max-w-7xl mx-auto space-y-8`">
        <header className=`"flex justify-between items-end`">
          <div>
            <h1 className=`"text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400`">
              ${route.Replace('/', ' ').ToUpper()}
            </h1>
            <p className=`"text-slate-400 mt-2`">Phase 27 Executive Intelligence Module</p>
          </div>
        </header>

        <div className=`"grid grid-cols-1 md:grid-cols-3 gap-6`">
           <div className=`"p-6 bg-slate-900 border border-slate-800 rounded-2xl`">
             <h3 className=`"text-sm font-semibold text-slate-400 uppercase tracking-widest`">Insights</h3>
             <div className=`"mt-4 text-2xl font-bold`">No Data</div>
           </div>
           <div className=`"p-6 bg-slate-900 border border-slate-800 rounded-2xl`">
             <h3 className=`"text-sm font-semibold text-slate-400 uppercase tracking-widest`">Metrics</h3>
             <div className=`"mt-4 text-2xl font-bold`">Loading...</div>
           </div>
           <div className=`"p-6 bg-slate-900 border border-slate-800 rounded-2xl`">
             <h3 className=`"text-sm font-semibold text-slate-400 uppercase tracking-widest`">Live Status</h3>
             <div className=`"mt-4 text-2xl font-bold text-emerald-500`">Connected</div>
           </div>
        </div>
      </div>
    </div>
  );
}
"@

    Set-Content -Path "$dir\page.tsx" -Value $content
}
