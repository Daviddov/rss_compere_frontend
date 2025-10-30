// components/ReportGenerator.tsx
'use client';

import React, { useState } from 'react';
import { FileText, Mail } from 'lucide-react';

export default function ReportGenerator({ stats, sourceData, matches, articles }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">יצירת דוח</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {isOpen ? 'סגור' : 'פתח'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            הדוח יכלול: סטטיסטיקות, ניתוח מקורות, התאמות אחרונות
          </p>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <FileText className="w-5 h-5" />
            יצירת דוח מלא
          </button>
        </div>
      )}
    </div>
  );
}