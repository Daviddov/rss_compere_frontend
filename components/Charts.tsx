// components/Charts.tsx
'use client';

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SourceComparison } from '@/types';

interface ChartsProps {
  sourceData: SourceComparison[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function Charts({ sourceData }: ChartsProps) {
  // נתונים לגרף עמודות
  const barData = sourceData.map(s => ({
    name: s.source,
    'סה"כ כתבות': s.total,
    'נבדקו': s.checked,
    'התאמות': s.matches,
  }));

  // נתונים לגרף עוגה
  const pieData = sourceData.map(s => ({
    name: s.source,
    value: s.total,
  }));

  // נתונים לגרף קווים
  const lineData = sourceData.map(s => ({
    name: s.source,
    'אחוז בדיקה': s.total > 0 ? Math.round((s.checked / s.total) * 100) : 0,
    'אחוז התאמות': s.checked > 0 ? Math.round((s.matches / s.checked) * 100) : 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* גרף עמודות - סטטיסטיקות לפי מקור */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">סטטיסטיקות לפי מקור</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='סה"כ כתבות' fill="#3b82f6" />
            <Bar dataKey="נבדקו" fill="#10b981" />
            <Bar dataKey="התאמות" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* גרף עוגה - התפלגות כתבות */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">התפלגות כתבות לפי מקור</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* גרף קווים - אחוזים */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">אחוזי בדיקה והתאמות</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="אחוז בדיקה" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="אחוז התאמות" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
