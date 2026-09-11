import { useState } from 'react'
import { AlertTriangle, ShieldAlert, CheckCircle2, BellRing, Check, Plus, X } from 'lucide-react'
import { useAPQPStore } from '@/lib/store'

interface ProcessDriftAlertsProps {
  projectId: number
}

export default function ProcessDriftAlerts({ projectId }: ProcessDriftAlertsProps) {
  const { projectData, resolveDriftAlert } = useAPQPStore()
  const alerts = projectData[projectId]?.driftAlerts || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Centre d'Alertes Dérive Process & Règles de Contrôle SPC</h3>
          <p className="text-sm text-muted-foreground">
            Détection automatique en temps réel des signaux hors-contrôle selon les règles Nelson & Western Electric
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full font-bold text-xs">
          {alerts.filter((a) => !a.resolved).length} Alerte(s) Active(s)
        </span>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">Aucune dérive process signalée</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Tous les procédés de fabrication fonctionnent sous contrôle statistique strict.
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition-all ${
                alert.resolved
                  ? 'bg-muted/20 border-border opacity-70'
                  : alert.severity === 'critical'
                  ? 'bg-red-50/70 dark:bg-red-950/30 border-red-300 dark:border-red-900/50'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    alert.resolved
                      ? 'bg-muted text-muted-foreground'
                      : alert.severity === 'critical'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-amber-100 text-amber-600'
                  }`}>
                    {alert.resolved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm">{alert.title}</h4>
                      <span className="text-[11px] font-mono text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs font-semibold text-primary mt-1">{alert.ruleTriggered}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Action requise : Vérifier immédiatement le réglage machine, la température de moule et prélever 5 pièces de contrôle.
                    </p>
                  </div>
                </div>

                <div>
                  {alert.resolved ? (
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Traité & Clôturé
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveDriftAlert(projectId, alert.id)}
                      className="px-3.5 py-1.5 bg-primary text-primary-foreground font-semibold rounded text-xs hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Acquitter & Déclencher Confinement
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rules Reference Table */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
        <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
          Règles de Détection Nelson intégrées au Système APQP
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 bg-muted/30 rounded border border-border">
            <span className="font-bold text-red-600 block">Règle Nelson 1</span>
            <span className="text-muted-foreground">1 point au-delà de 3 écarts-types (Limite $3\sigma$)</span>
          </div>
          <div className="p-2.5 bg-muted/30 rounded border border-border">
            <span className="font-bold text-amber-600 block">Règle Nelson 2</span>
            <span className="text-muted-foreground">9 points consécutifs situés du même côté de la ligne centrale</span>
          </div>
          <div className="p-2.5 bg-muted/30 rounded border border-border">
            <span className="font-bold text-blue-600 block">Règle Nelson 3</span>
            <span className="text-muted-foreground">6 points consécutifs continuellement croissants ou décroissants</span>
          </div>
          <div className="p-2.5 bg-muted/30 rounded border border-border">
            <span className="font-bold text-purple-600 block">Règle Nelson 4</span>
            <span className="text-muted-foreground">14 points consécutifs alternant alternativement en hausse et en baisse</span>
          </div>
        </div>
      </div>
    </div>
  )
}
