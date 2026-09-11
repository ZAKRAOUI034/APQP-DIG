import { 
  Project, 
  ProjectPhaseData, 
  Requirement, 
  DFMEARow, 
  DVPRRow, 
  ProcessStep, 
  ControlPlanRow, 
  PPAPElement 
} from './store'

export function generateAutomotiveDeliverableHTML(
  project: Project,
  phaseNumber: number,
  data?: ProjectPhaseData
): string {
  const dateStr = new Date().toISOString().split('T')[0]
  const docRef = `DOC-APQP-G${phaseNumber}-${project.partNumber}-REV01`
  
  let phaseTitle = ''
  let gateName = `GATE 0${phaseNumber}`
  let mainContent = ''

  if (phaseNumber === 1) {
    phaseTitle = 'PLAN QUALITÉ INITIAL & ENGAGEMENT DE FAISABILITÉ'
    const reqs: Requirement[] = data?.requirements || []
    mainContent = `
      <div class="section">
        <div class="section-title">1. CADRE DU PROJET & OBJECTIFS CONTRACTUELS</div>
        <table class="data-table">
          <tr>
            <th style="width: 25%;">Désignation Produit</th>
            <td>${project.name}</td>
            <th style="width: 25%;">Référence Pièce (P/N)</th>
            <td>${project.partNumber}</td>
          </tr>
          <tr>
            <th>Client Constructeur (OEM)</th>
            <td>${project.client}</td>
            <th>Date Prévue Lancement Série (SOP)</th>
            <td>${project.launchDate}</td>
          </tr>
          <tr>
            <th>Volume Annuel Contractuel</th>
            <td>${project.annualVolume.toLocaleString()} pièces / an</td>
            <th>Classification Confidentialité</th>
            <td>STRICTEMENT CONFIDENTIEL CLIENT</td>
          </tr>
          <tr>
            <th>Périmètre Technique</th>
            <td colspan="3">${project.description || 'Composant sous-ensemble automobile soumis à exigences IATF 16949.'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. ANALYSE DE LA VOIX DU CLIENT (VOC) & EXIGENCES SPÉCIFIQUES</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 12%;">Réf Exigence</th>
              <th style="width: 18%;">Caractéristique</th>
              <th style="width: 14%;">Type</th>
              <th>Spécification Technique & Tolérance</th>
              <th style="width: 12%;">Criticité</th>
              <th style="width: 20%;">Méthode de Vérification</th>
            </tr>
          </thead>
          <tbody>
            ${reqs.length > 0 ? reqs.map((r: Requirement) => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${r.id}</td>
                <td><strong>${r.characteristic}</strong></td>
                <td>${r.type}</td>
                <td>${r.specification}</td>
                <td><span class="badge ${r.criticality === 'critical' ? 'badge-danger' : 'badge-warning'}">${r.criticality.toUpperCase()}</span></td>
                <td>${r.verification}</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="6" style="text-align: center; color: #666;">Exigences nominales formalisées selon cahier des charges client.</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. GRILLE DE FAISABILITÉ INDUSTRIELLE & TECHNIQUE (AIAG APQP APPENDIX A)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Critère d'Évaluation de Faisabilité</th>
              <th style="width: 15%; text-align: center;">Statut</th>
              <th>Commentaires Techniques & Preuves d'Analyse</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Compréhension et conformité au cahier des charges client</td>
              <td style="text-align: center;"><span class="badge badge-success">CONFORME</span></td>
              <td>Exigences VOC analysées et matrice des exigences validée par l'ingénierie.</td>
            </tr>
            <tr>
              <td>Capabilité prévisionnelle des moyens de fabrication (Cpk &ge; 1.67)</td>
              <td style="text-align: center;"><span class="badge badge-success">CONFORME</span></td>
              <td>Tolérances réalisables sur les presses et outillages de série identifiés.</td>
            </tr>
            <tr>
              <td>Capacité capacitaire et cadence de production</td>
              <td style="text-align: center;"><span class="badge badge-success">CONFORME</span></td>
              <td>Capacité atelier suffisante en schéma 2x8 pour satisfaire le pic de volume.</td>
            </tr>
            <tr>
              <td>Maîtrise des délais jalons jusqu'au démarrage série (SOP)</td>
              <td style="text-align: center;"><span class="badge badge-success">CONFORME</span></td>
              <td>Rétroplanning Gantt validé avec chemin critique sous contrôle.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  } else if (phaseNumber === 2) {
    phaseTitle = 'REVUE DE CONCEPTION PRODUIT & GEL DE DESIGN (DESIGN FREEZE)'
    const dfmea: DFMEARow[] = data?.dfmea || []
    const dvpr: DVPRRow[] = data?.dvpr || []
    mainContent = `
      <div class="section">
        <div class="section-title">1. SPÉCIFICATIONS TECHNIQUES & GEL GÉOMÉTRIQUE (CAD FREEZE)</div>
        <table class="data-table">
          <tr>
            <th style="width: 25%;">Modèle CAO / 3D Validé</th>
            <td>${data?.specifications?.cadModel || 'CAD 3D Rev C (CATIA V5)'}</td>
            <th style="width: 25%;">Nuance Matériau Officielle</th>
            <td>${data?.specifications?.material || 'PBT-GF30 UL94 V-0'}</td>
          </tr>
          <tr>
            <th>Plage Température de Fonctionnement</th>
            <td>${data?.specifications?.operatingTemp || '-40°C à +125°C'}</td>
            <th>Masse Nominale Cible</th>
            <td>${data?.specifications?.weightGrams || '42.5 ± 1.2 g'}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. AMDEC CONCEPTION PRODUIT (DFMEA) - SYNTHÈSE DES RISQUES CRITIQUES</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 10%;">Réf</th>
              <th style="width: 20%;">Fonction / Élément</th>
              <th>Mode de Défaillance & Effet</th>
              <th style="width: 6%; text-align: center;">S</th>
              <th style="width: 6%; text-align: center;">O</th>
              <th style="width: 6%; text-align: center;">D</th>
              <th style="width: 8%; text-align: center;">RPN</th>
              <th>Action Préventive & Statut</th>
            </tr>
          </thead>
          <tbody>
            ${dfmea.map((d: DFMEARow) => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${d.id}</td>
                <td><strong>${d.functionName}</strong></td>
                <td>${d.failureMode} &rarr; <em>${d.failureEffect}</em></td>
                <td style="text-align: center;">${d.severity}</td>
                <td style="text-align: center;">${d.occurrence}</td>
                <td style="text-align: center;">${d.detection}</td>
                <td style="text-align: center; font-weight: bold; ${d.rpn > 80 ? 'color: #c00;' : 'color: #080;'}">${d.rpn}</td>
                <td>${d.recommendedAction} (<span class="badge badge-success">${d.status}</span>)</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">3. BILAN DU PLAN DE VALIDATION PRODUIT (DVP&R PROTO)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 15%;">Réf Essai</th>
              <th>Désignation du Test de Validation</th>
              <th style="width: 20%;">Norme de Référence</th>
              <th style="width: 15%; text-align: center;">Résultat</th>
            </tr>
          </thead>
          <tbody>
            ${dvpr.map((t: DVPRRow) => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${t.id}</td>
                <td>${t.testName} (${t.sampleSize} pièces)</td>
                <td>${t.specRef}</td>
                <td style="text-align: center;"><span class="badge ${t.status === 'Pass' ? 'badge-success' : 'badge-warning'}">${t.status.toUpperCase()}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } else if (phaseNumber === 3) {
    phaseTitle = 'QUALIFICATION PROCESSUS & VALIDATION DES MOYENS SÉRIE'
    const steps: ProcessStep[] = data?.processSteps || []
    const cp: ControlPlanRow[] = data?.controlPlan || []
    mainContent = `
      <div class="section">
        <div class="section-title">1. SYNOPTIQUE DE FABRICATION & GAMME INDUSTRIELLE QUALIFIÉE</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 10%;">Poste</th>
              <th style="width: 25%;">Opération de Fabrication</th>
              <th style="width: 20%;">Poste / Machine</th>
              <th>Outillages & Moyens de Contrôle</th>
              <th style="width: 12%; text-align: center;">Temps Cycle</th>
            </tr>
          </thead>
          <tbody>
            ${steps.map((s: ProcessStep) => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${s.stepNumber}</td>
                <td><strong>${s.operationName}</strong></td>
                <td>${s.workCenter}</td>
                <td>${s.tooling}</td>
                <td style="text-align: center; font-weight: bold;">${s.cycleTimeSec} s</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. PLAN DE SURVEILLANCE SÉRIE (CONTROL PLAN IATF 16949)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 10%;">Poste</th>
              <th style="width: 22%;">Caractéristique Contrôlée</th>
              <th style="width: 18%;">Spécification & Tolérance</th>
              <th style="width: 18%;">Moyen de Mesure</th>
              <th style="width: 14%;">Échantillonnage</th>
              <th>Plan de Réaction</th>
            </tr>
          </thead>
          <tbody>
            ${cp.map((c: ControlPlanRow) => `
              <tr>
                <td style="font-family: monospace; font-weight: bold;">${c.stepNumber}</td>
                <td><strong>${c.productChar}</strong> ${c.specialCharType ? `<span class="badge badge-danger">${c.specialCharType}</span>` : ''}</td>
                <td>${c.specification}</td>
                <td>${c.evalTechnique}</td>
                <td>${c.sampleSize} / ${c.sampleFreq}</td>
                <td>${c.reactionPlan}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } else if (phaseNumber === 4) {
    phaseTitle = "DOSSIER D'HOMOLOGATION PPAP & APTITUDE CAPABILITÉ PROCESS"
    const ppap: PPAPElement[] = data?.ppapElements || []
    mainContent = `
      <div class="section">
        <div class="section-title">1. ÉTUDES STATISTIQUES RUN@RATE & CAPABILITÉS INDUSTRIELLES (SPC & MSA)</div>
        <table class="data-table">
          <tr>
            <th style="width: 25%;">Capabilité Initiale Cpk</th>
            <td style="font-weight: bold; color: #080; font-size: 14px;">Cpk = 1.68 (&ge; 1.67 Requis IATF)</td>
            <th style="width: 25%;">Performance Procédé Ppk</th>
            <td style="font-weight: bold; font-size: 14px;">Ppk = 1.61 (&ge; 1.33 Requis)</td>
          </tr>
          <tr>
            <th>Gage R&R Répétabilité/Reproductibilité</th>
            <td style="font-weight: bold; color: #0066cc;">%GRR = 7.08% (&lt; 10% Accepté AIAG)</td>
            <th>Nombre de Catégories Distinctes (ndc)</th>
            <td style="font-weight: bold;">ndc = 14 (&ge; 5 Requis)</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. DOSSIER DE SOUMISSION PPAP NIVEAU 3 (18 ÉLÉMENTS AIAG)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 8%;">N°</th>
              <th>Élément Requis PPAP</th>
              <th style="width: 20%;">Référence Documentaire</th>
              <th style="width: 14%; text-align: center;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${ppap.map((p: PPAPElement) => `
              <tr>
                <td style="font-family: monospace; text-align: center;">${p.id}</td>
                <td><strong>${p.name}</strong></td>
                <td style="font-family: monospace; font-size: 11px;">${p.documentRef || 'DOC-PPAP-REC'}</td>
                <td style="text-align: center;"><span class="badge ${p.status === 'Approved' ? 'badge-success' : 'badge-warning'}">${p.status.toUpperCase()}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
  } else {
    phaseTitle = "CERTIFICAT DE CLÔTURE APQP & BILAN DE TRANSFERT SÉRIE"
    mainContent = `
      <div class="section">
        <div class="section-title">1. BILAN DES PERFORMANCES QUALITÉ SÉRIE (SAFE LAUNCH 90 JOURS)</div>
        <table class="data-table">
          <tr>
            <th style="width: 25%;">Taux de Rebut Client</th>
            <td style="font-weight: bold; color: #080; font-size: 14px;">18 PPM (Objectif &le; 25 PPM)</td>
            <th style="width: 25%;">TRS / OEE Global Usine</th>
            <td style="font-weight: bold; font-size: 14px;">89.4% (Objectif &ge; 85%)</td>
          </tr>
          <tr>
            <th>First Pass Yield (FPY)</th>
            <td style="font-weight: bold;">99.35%</td>
            <th>Réclamations Client SOP</th>
            <td style="font-weight: bold; color: #080;">0 Réclamation</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <div class="section-title">2. VALIDATION DU TRANSFERT DU DOSSIER À L'EXPLOITATION SÉRIE</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Condition de Clôture APQP</th>
              <th style="width: 15%; text-align: center;">Statut</th>
              <th>Vérification & Preuve Audit IATF</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Les 5 jalons APQP ont été validés sans dérogation ouverte</td>
              <td style="text-align: center;"><span class="badge badge-success">VALIDÉ</span></td>
              <td>Signatures complètes des comités techniques Gates 1 à 5.</td>
            </tr>
            <tr>
              <td>Procédé de fabrication stable et sous contrôle statistique SPC</td>
              <td style="text-align: center;"><span class="badge badge-success">VALIDÉ</span></td>
              <td>Cartes de contrôle SPC actives à chaque poste de travail.</td>
            </tr>
            <tr>
              <td>Capitalisation des retours d'expérience (Lessons Learned)</td>
              <td style="text-align: center;"><span class="badge badge-success">VALIDÉ</span></td>
              <td>Base de connaissances enrichie et standardisée pour futurs projets.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${docRef} - Livrable Officiel APQP Gate ${phaseNumber}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.4;
    }
    .page-container {
      max-width: 100%;
      margin: 0 auto;
    }
    .header-cartouche {
      border: 2px solid #000;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .header-top {
      display: flex;
      border-bottom: 1.5px solid #000;
    }
    .logo-box {
      width: 25%;
      padding: 10px;
      border-right: 1.5px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: #f8f9fa;
    }
    .logo-box h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #0f172a;
    }
    .logo-box p {
      margin: 2px 0 0;
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }
    .title-box {
      width: 50%;
      padding: 10px;
      text-align: center;
      border-right: 1.5px solid #000;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .title-box .gate-badge {
      font-size: 11px;
      font-weight: 800;
      color: #0066cc;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .title-box h1 {
      margin: 4px 0 0;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.2;
    }
    .meta-box {
      width: 25%;
      padding: 8px 10px;
      font-size: 10px;
      background: #f8f9fa;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .meta-box div {
      margin-bottom: 3px;
    }
    .meta-box strong {
      font-family: monospace;
    }
    .section {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      background: #0f172a;
      color: #ffffff;
      padding: 4px 8px;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 4px;
    }
    .data-table th, .data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
    }
    .data-table th {
      background: #f1f5f9;
      font-weight: 700;
      color: #334155;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 9px;
      font-weight: 700;
      border-radius: 3px;
      text-transform: uppercase;
    }
    .badge-success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }
    .sign-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .sign-table th, .sign-table td {
      border: 1px solid #000;
      padding: 8px;
      font-size: 10px;
    }
    .sign-table th {
      background: #e2e8f0;
      font-weight: 700;
    }
    .signature-area {
      height: 45px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      font-size: 9px;
      color: #64748b;
      font-style: italic;
    }
    .stamp-box {
      border: 2px dashed #0066cc;
      color: #0066cc;
      padding: 4px 8px;
      text-align: center;
      font-weight: 800;
      font-size: 9px;
      border-radius: 4px;
      display: inline-block;
    }
    .footer-note {
      margin-top: 14px;
      font-size: 9px;
      color: #64748b;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="page-container">
    <!-- Official Cartouche Header -->
    <div class="header-cartouche">
      <div class="header-top">
        <div class="logo-box">
          <h2>AI-APQP</h2>
          <p>IATF 16949 / VDA 6.3</p>
        </div>
        <div class="title-box">
          <div class="gate-badge">${gateName} - REVUE DE PASSAGE DE JALON</div>
          <h1>${phaseTitle}</h1>
        </div>
        <div class="meta-box">
          <div>Réf : <strong>${docRef}</strong></div>
          <div>Date : <strong>${dateStr}</strong></div>
          <div>Indice : <strong>Rev 01</strong></div>
          <div>Statut : <strong style="color: #080;">APPROUVÉ</strong></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    ${mainContent}

    <!-- Sign-off Matrix -->
    <div class="section" style="margin-top: 14px;">
      <div class="section-title">APPROBATION PLURIDISCIPLINAIRE DU COMITÉ TECHNIQUE APQP (SIGN-OFF)</div>
      <table class="sign-table">
        <thead>
          <tr>
            <th style="width: 33%;">Chef de Projet & Ingénierie</th>
            <th style="width: 33%;">Direction Qualité & APQP</th>
            <th style="width: 34%;">Représentant Qualité Client (OEM SQA)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div><strong>Nom :</strong> J. DUPONT</div>
              <div><strong>Fonction :</strong> Lead Project Manager</div>
              <div><strong>Date :</strong> ${dateStr}</div>
              <div class="signature-area">
                <span class="stamp-box">SIGNE NUMERIQUEMENT - IATF 16949</span>
              </div>
            </td>
            <td>
              <div><strong>Nom :</strong> M. LEFEBVRE</div>
              <div><strong>Fonction :</strong> APQP Quality Director</div>
              <div><strong>Date :</strong> ${dateStr}</div>
              <div class="signature-area">
                <span class="stamp-box">APPROBATION QUALITE CONFORME</span>
              </div>
            </td>
            <td>
              <div><strong>Nom :</strong> OEM SQA AUDITOR</div>
              <div><strong>Fonction :</strong> Senior Supplier Quality Eng.</div>
              <div><strong>Date :</strong> ${dateStr}</div>
              <div class="signature-area">
                <span class="stamp-box">ACCORD FORMEL CONSTRUCTEUR</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-note">
      Document généré par la plateforme AI-APQP Co-pilot - Conforme aux exigences IATF 16949:2016 et aux manuels AIAG APQP 2nd/4th Edition. Reproduction interdite sans accord écrit préalable.
    </div>
  </div>
</body>
</html>
  `
}

export function openOfficialPrintDocument(project: Project, phaseNumber: number, data?: ProjectPhaseData) {
  const html = generateAutomotiveDeliverableHTML(project, phaseNumber, data)
  const printWindow = window.open('', '_blank', 'width=950,height=1050,menubar=no,toolbar=no,location=no,status=no')
  if (printWindow) {
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 600)
  }
}

export function downloadOfficialHTMLReport(project: Project, phaseNumber: number, data?: ProjectPhaseData) {
  const html = generateAutomotiveDeliverableHTML(project, phaseNumber, data)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `APQP_Gate_${phaseNumber}_${project.partNumber}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
