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
        // Apelăm Supabase pentru a lua toate vizitele
        // Recomandat: creează un API route /api/admin/analytics pentru securitate sporită pe viitor
        // Aici folosim fetch către un API pe care îl vom crea rapid
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
    <div className="flex flex-col items-center justify-center p-20 text-[#706760]">
      <Loader2 className="animate-spin mb-4" size={40} />
      <p className="italic font-medium">Se calculează traficul live din Supabase...</p>
    </div>
  )

  return (
    <div className="animate-in fade-in duration-500 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#706760] flex items-center gap-3">
            <BarChart3 className="text-[#EAA093]" size={32} /> 
            Statistici Trafic
          </h1>
          <p className="text-[#706760]/60 italic uppercase text-[10px] tracking-widest mt-1 font-bold">
            Date 100% Reale din propria bază de date
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#BFC08E]/20 text-[#706760] px-4 py-2 rounded-full text-sm font-bold">
          <div className="w-2 h-2 rounded-full bg-[#BFC08E] animate-pulse" />
          Live DB
        </div>
      </div>

      {/* CARDURI STATISTICI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard 
          title="Vizitatori (Astăzi)" 
          value={stats.todayViews.toString()} 
          icon={<Users size={24} className="text-[#EAA093]" />} 
        />
        <StatCard 
          title="Afișări Totale (All Time)" 
          value={stats.totalViews.toString()} 
          icon={<Eye size={24} className="text-[#BFC08E]" />} 
        />
      </div>

      {/* Pagini Populare */}
      <div className="bg-white rounded-3xl p-6 border border-[#706760]/10 shadow-sm">
        <h3 className="text-lg font-bold text-[#706760] mb-6">Cele mai vizitate pagini</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[#706760]/50 text-xs uppercase tracking-wider font-bold border-b border-gray-100">
              <th className="pb-3">Pagină URL</th>
              <th className="pb-3 text-right">Număr Accesări</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium text-[#706760]">
            {stats.topPages.map((page, index) => (
              <tr key={index}>
                <td className="py-4 font-mono text-xs">{page.path}</td>
                <td className="py-4 text-right font-black">{page.count}</td>
              </tr>
            ))}
            {stats.topPages.length === 0 && (
              <tr><td colSpan={2} className="py-4 text-center italic opacity-50">Nu există date încă. Intră pe site ca să generezi trafic!</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#706760]/10 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-gray-50 shadow-sm">{icon}</div>
      </div>
      <div>
        <h4 className="text-[#706760]/60 font-medium text-sm mb-1">{title}</h4>
        <span className="text-3xl font-black text-[#706760]">{value}</span>
      </div>
    </div>
  )
}