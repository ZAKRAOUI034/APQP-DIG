import { TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck, Activity, Gauge, Flame } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface KPIsDashboardProps {
  projectId: number
}

export default function KPIsDashboard({ projectId }: KPIsDashboardProps) {
  const { projectData } = useAPQPStore()
  const kpis = projectData[projectId]?.kpis || {
    ppm: 18,
    oee: 89.4,
    scrapRate: 0.65,
    firstPassYield: 99.35,
    customerComplaints: 0
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Tableau de Bord des Performances Série (KPIs Qualité & TRS)</h3>
        <p className="text-sm text-muted-foreground">
          Surveillance en temps réel des indicateurs IATF 16949 en phase de production série
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase">Taux Rebut PPM</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 font-mono">{kpis.ppm}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Objectif client : &lt; 25 PPM</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase">TRS / OEE Usine</span>
            <Gauge className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-black text-primary font-mono">{kpis.oee}%</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Disponibilité, Performance & Qualité</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase">Taux de Rebut</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-black text-amber-600 font-mono">{kpis.scrapRate}%</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Cible atelier : &lt; 1.0%</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase">First Pass Yield</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-foreground font-mono">{kpis.firstPassYield}%</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Bonnes du 1er coup sans retouche</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-xs font-semibold uppercase">Réclamations Client</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600 font-mono">{kpis.customerComplaints}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">0 défaut chez le constructeur</span>
        </div>
      </div>

      {/* Production Trends & Stability Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Évolution Mensuelle du Taux de Rebut (PPM)
          </h4>
          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-border">
            {[
              { month: 'Mois 1 (Pilote)', ppm: 45 },
              { month: 'Mois 2 (Montée)', ppm: 32 },
              { month: 'Mois 3 (Série)', ppm: 24 },
              { month: 'Mois 4 (Optimisé)', ppm: 18 },
              { month: 'Mois 5 (Actuel)', ppm: 14 }
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[11px] font-mono font-bold text-foreground">{d.ppm}</span>
                <div
                  className="w-full bg-emerald-500/80 hover:bg-emerald-600 rounded-t transition-all"
                  style={{ height: `${(d.ppm / 50) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{d.month}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Tendance favorable : réduction continue des pertes de production grâce aux actions de TPM niveau 2.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Rendement Synthétique des Lignes de Production (OEE)
          </h4>
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground font-medium">Taux de Disponibilité Opérationnelle</span>
                <span className="font-mono font-bold text-foreground">94.5%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground font-medium">Taux de Performance Vitesse / Cadence</span>
                <span className="font-mono font-bold text-foreground">95.2%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '95.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground font-medium">Taux de Qualité Réelle (Bonnes / Total)</span>
                <span className="font-mono font-bold text-foreground">99.35%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.35%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded border border-border text-xs text-muted-foreground">
            TRS Global calculé : <strong className="text-foreground">89.4%</strong> ($94.5\% \times 95.2\% \times 99.35\%$) - Performance World Class Automotive.
          </div>
        </div>
      </div>
    </div>
  )
}
