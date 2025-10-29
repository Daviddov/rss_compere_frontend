// components/ReportGenerator.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Mail, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import type { SourceComparison, SystemStats, Match, Article } from '@/types';

interface ReportGeneratorProps {
  stats: SystemStats;
  sourceData: SourceComparison[];
  matches: Match[];
  articles: Article[];
}

export default function ReportGenerator({ stats, sourceData, matches, articles }: ReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'analytics'>('summary');
  const [isSending, setIsSending] = useState(false);

  const generateHTMLReport = () => {
    const now = new Date();
    const reportDate = format(now, 'dd/MM/yyyy HH:mm', { locale: he });

    let html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>דוח ניתוח כתבות RSS - ${reportDate}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      direction: rtl;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h1 {
      color: #1e40af;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .report-info {
      color: #6b7280;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card.blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
    .stat-card.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .stat-card.yellow { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
    .stat-card.purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
    .stat-value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }
    .section {
      margin: 40px 0;
    }
    .section-title {
      font-size: 24px;
      color: #1e40af;
      margin-bottom: 20px;
      border-right: 4px solid #3b82f6;
      padding-right: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #f3f4f6;
      padding: 12px;
      text-align: right;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    .source-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .source-badge.kikar { background: #dbeafe; color: #1e40af; }
    .source-badge.bhol { background: #ede9fe; color: #6b21a8; }
    .source-badge.jdn { background: #d1fae5; color: #065f46; }
    .match-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
    }
    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .winner-badge {
      background: #fef3c7;
      color: #92400e;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 דוח ניתוח כתבות RSS</h1>
      <div class="report-info">
        נוצר בתאריך: ${reportDate} | סוג דוח: ${reportType === 'summary' ? 'מסכם' : reportType === 'detailed' ? 'מפורט' : 'אנליטי'}
      </div>
    </div>`;

    // סטטיסטיקות כלליות
    html += `
    <div class="section">
      <h2 class="section-title">סטטיסטיקות כלליות</h2>
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-value">${stats.totalArticles.toLocaleString()}</div>
          <div class="stat-label">סה"כ כתבות</div>
        </div>
        <div class="stat-card green">
          <div class="stat-value">${stats.checkedArticles.toLocaleString()}</div>
          <div class="stat-label">כתבות נבדקו</div>
        </div>
        <div class="stat-card yellow">
          <div class="stat-value">${stats.newArticles.toLocaleString()}</div>
          <div class="stat-label">כתבות חדשות</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-value">${stats.totalMatches.toLocaleString()}</div>
          <div class="stat-label">התאמות</div>
        </div>
      </div>
    </div>`;

    // נתונים לפי מקור
    if (sourceData.length > 0) {
      html += `
    <div class="section">
      <h2 class="section-title">ניתוח לפי מקור</h2>
      <table>
        <thead>
          <tr>
            <th>מקור</th>
            <th>סה"כ כתבות</th>
            <th>נבדקו</th>
            <th>התאמות</th>
            <th>% ראשוניות</th>
            <th>% איכות</th>
            <th>איחור חציוני (דק')</th>
            <th>אורך ממוצע (מילים)</th>
          </tr>
        </thead>
        <tbody>`;
      
      sourceData.forEach(source => {
        const firstRate = source.matches > 0 ? Math.round((source.firstPublishedCount / source.matches) * 100) : 0;
        const qualityRate = source.matches > 0 ? Math.round((source.betterArticleCount / source.matches) * 100) : 0;
        
        html += `
          <tr>
            <td><span class="source-badge ${source.source.toLowerCase()}">${source.source}</span></td>
            <td>${source.total}</td>
            <td>${source.checked}</td>
            <td>${source.matches}</td>
            <td>${firstRate}%</td>
            <td>${qualityRate}%</td>
            <td>${source.medianDelayMinutes}</td>
            <td>${source.averageContentWords}</td>
          </tr>`;
      });
      
      html += `
        </tbody>
      </table>
    </div>`;
    }

    // התאמות (אם זה דוח מפורט)
    if (reportType === 'detailed' && matches.length > 0) {
      html += `
    <div class="section">
      <h2 class="section-title">התאמות אחרונות (${Math.min(10, matches.length)} מתוך ${matches.length})</h2>`;
      
      matches.slice(0, 10).forEach(match => {
        const timeDiff = match.publishedDiffSeconds 
          ? `${Math.floor(match.publishedDiffSeconds / 60)} דקות`
          : '-';
        
        html += `
      <div class="match-card">
        <div class="match-header">
          <span class="source-badge ${match.article1Source.toLowerCase()}">${match.article1Source}</span>
          <span style="color: #6b7280;">⟷</span>
          <span class="source-badge ${match.article2Source.toLowerCase()}">${match.article2Source}</span>
          <span class="winner-badge">🏆 ${match.betterArticleSource}</span>
        </div>
        <div style="font-size: 14px; color: #374151; margin-bottom: 8px;">
          <strong>${match.article1Title}</strong>
        </div>
        <div style="font-size: 14px; color: #374151; margin-bottom: 12px;">
          <strong>${match.article2Title}</strong>
        </div>
        <div style="font-size: 12px; color: #6b7280;">
          הפרש זמן: ${timeDiff}
          ${match.reason ? ` | סיבה: ${match.reason}` : ''}
        </div>
      </div>`;
      });
      
      html += `
    </div>`;
    }

    html += `
    <div class="footer">
      <p>דוח זה נוצר אוטומטית על ידי מערכת ניתוח כתבות RSS</p>
      <p>כל הזכויות שמורות © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>`;

    return html;
  };

  const handleDownloadReport = () => {
    const html = generateHTMLReport();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `דוח-RSS-${format(new Date(), 'yyyy-MM-dd-HHmm')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    const html = generateHTMLReport();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert('❌ יש להזין כתובת מייל');
      return;
    }

    setIsSending(true);
    try {
      const html = generateHTMLReport();
      
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          html,
          reportType,
        }),
      });

      if (response.ok) {
        alert('✅ הדוח נשלח בהצלחה למייל');
        setEmail('');
      } else {
        alert('❌ שגיאה בשליחת המייל');
      }
    } catch (error) {
      console.error(error);
      alert('❌ שגיאה בשליחת המייל');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">יצירת דוחות</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isOpen ? 'סגור' : 'פתח'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {/* בחירת סוג דוח */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סוג דוח
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">דוח מסכם</option>
              <option value="detailed">דוח מפורט</option>
              <option value="analytics">דוח אנליטי</option>
            </select>
          </div>

          {/* כפתורי פעולה */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              הורד דוח HTML
            </button>
            
            <button
              onClick={handlePrintReport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              הדפס דוח
            </button>
          </div>

          {/* שליחה למייל */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שליחת דוח למייל
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendEmail}
                disabled={isSending || !email}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                {isSending ? 'שולח...' : 'שלח'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
