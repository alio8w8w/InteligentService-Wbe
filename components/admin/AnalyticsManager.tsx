"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Eye, BarChart3, Loader2 } from "lucide-react"

type Stats = {
  totalViews: number;
  todayViews: number;
  topPages: { path: string; count: number }[];
}

export default function AnalyticsManager() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        if (!res.ok) throw new Error("Eroare extragere date");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return (
    <div className="flex flex-col items-center justify-center p-20 text-[#283618]">
      <Loader2 className="animate-spin mb-4 text-[#DDA15E]" size={40} />
      <p className="italic font-medium">Se calculează traficul live din Supabase...</p>
    </div>
  )

  // Ne asigurăm că topPages este un array valid, chiar dacă API-ul nu îl trimite
  const safeTopPages = stats.topPages || [];

  return (
    <div className="animate-in fade-in duration-500 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#283618] flex items-center gap-3">
            <BarChart3 className="text-[#DDA15E]" size={32} /> 
            Statistici Trafic
          </h1>
          <p className="text-[#606C38] italic uppercase text-[10px] tracking-widest mt-1 font-bold">
            Date 100% Reale din propria bază de date
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#283618]/10 text-[#283618] px-4 py-2 rounded-full text-sm font-bold border border-[#283618]/20">
          <div className="w-2 h-2 rounded-full bg-[#606C38] animate-pulse" />
          Live DB
        </div>
      </div>

      {/* CARDURI STATISTICI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard 
          title="Vizitatori (Astăzi)" 
          value={(stats.todayViews || 0).toString()} 
          icon={<Users size={24} className="text-[#DDA15E]" />} 
        />
        <StatCard 
          title="Afișări Totale (All Time)" 
          value={(stats.totalViews || 0).toString()} 
          icon={<Eye size={24} className="text-[#606C38]" />} 
        />
      </div>

      {/* Pagini Populare */}
      <div className="bg-white rounded-3xl p-6 border border-[#283618]/10 shadow-sm">
        <h3 className="text-lg font-bold text-[#283618] mb-6">Cele mai vizitate pagini</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#606C38]/50 text-xs uppercase tracking-wider font-bold border-b border-[#FEFAE0]">
              <th className="pb-3 text-[#606C38]">Pagină URL</th>
              <th className="pb-3 text-right text-[#606C38]">Număr Accesări</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FEFAE0] text-sm font-medium text-[#283618]">
            {safeTopPages.map((page, index) => (
              <tr key={index} className="hover:bg-[#FEFAE0]/30 transition-colors">
                <td className="py-4 font-mono text-xs text-[#606C38]">{page.path}</td>
                <td className="py-4 text-right font-black text-[#283618]">{page.count}</td>
              </tr>
            ))}
            {safeTopPages.length === 0 && (
              <tr><td colSpan={2} className="py-4 text-center italic opacity-50 text-[#606C38]">Nu există date încă. Intră pe site ca să generezi trafic!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#283618]/10 shadow-sm flex flex-col gap-4 hover:border-[#DDA15E]/50 transition-all">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-[#FEFAE0] shadow-sm border border-[#283618]/5">{icon}</div>
      </div>
      <div>
        <h4 className="text-[#606C38] font-medium text-sm mb-1">{title}</h4>
        <span className="text-3xl font-black text-[#283618]">{value}</span>
      </div>
    </div>
  )
}