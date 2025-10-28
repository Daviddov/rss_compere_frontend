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
  // נתונים לגרף עמודות סטנדרטי
  const barData = sourceData.map(s => ({
    name: s.source,
    'סה"כ כתבות': s.total,
    'נבדקו': s.checked,
    'התאמות': s.matches,
  }));

  // נתונים לגרף אחוזי ראשוניות ואיכות
  const rateData = sourceData.map(s => ({
    name: s.source,
    // מדד: אחוז ראשוניות (מהירות)
    'אחוז ראשוניות (מהירות)': s.matches > 0 
      ? Math.round((s.firstPublishedCount / s.matches) * 100)
      : 0,
    // מדד: אחוז איכות (טובה יותר)
    'אחוז "טובה יותר"': s.matches > 0 
      ? Math.round((s.betterArticleCount / s.matches) * 100)
      : 0,
  }));
  
  // נתונים לגרף איחור חציוני
  const medianDelayData = sourceData.map(s => ({
    name: s.source,
    'איחור חציוני (דקות)': s.medianDelayMinutes,
  }));
  
  // נתונים לגרף אורך כתבה ממוצע (עומק)
  const lengthData = sourceData.map(s => ({
    name: s.source,
    'אורך כתבה ממוצע (מילים)': s.averageContentWords,
  }));

  // נתונים לגרף עוגה
  const pieData = sourceData.map(s => ({
    name: s.source,
    value: s.total,
  }));


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 1. גרף אחוזי ראשוניות ואיכות */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">אחוזי ראשוניות (מהירות) ואיכות לפי מקור</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rateData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" domain={[0, 100]}/>
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="אחוז ראשוניות (מהירות)" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey='אחוז "טובה יותר"' 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* 2. גרף איחור חציוני (דקות) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">איחור חציוני (דקות)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={medianDelayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'דקות', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='איחור חציוני (דקות)' fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. גרף אורך כתבה ממוצע (עומק) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">אורך כתבה ממוצע (מילים)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={lengthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'מילים', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey='אורך כתבה ממוצע (מילים)' fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* 4. גרף עמודות - סטטיסטיקות כלליות */}
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

      {/* 5. גרף עוגה - התפלגות כתבות */}
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
    </div>
  );
}