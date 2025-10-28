# 📊 Dashboard - מערכת ניתוח כתבות RSS

דשבורד מקצועי ומלא ב-Next.js + TypeScript + React לניהול ומעקב אחר כתבות מרובות מקורות.

![Dashboard Preview](https://via.placeholder.com/800x400?text=RSS+Analyzer+Dashboard)

## ✨ תכונות עיקריות

### 📈 סקירה כללית (Overview)
- **כרטיסי סטטיסטיקה** - 6 כרטיסים עם מידע real-time
- **פעולות מהירות** - כפתורים לפעולות נפוצות
- **רענון אוטומטי** - כל 10 שניות

### 📰 ניהול כתבות (Articles)
- **טבלה מתקדמת** - עם מיון, סינון ובחירה מרובה
- **פילטרים חכמים**:
  - לפי מקור
  - לפי סטטוס (חדש/נבדק/לא נבדק)
  - לפי טווח תאריכים
  - הגבלת תוצאות
- **פעולות קבוצתיות**:
  - סימון כנבדקו
  - מחיקה
  - סימון כחדש
- **תגיות ויזואליות** - חדש, נבדק, מקור

### 🔗 התאמות (Matches)
- **טבלת התאמות** - מציגה קישורים בין כתבות
- **אינדיקטורים**:
  - איזו כתבה טובה יותר (🏆)
  - הפרש זמן בין הפרסומים
  - זמן יצירת ההתאמה
- **קישורים ישירים** - לכל כתבה

### 📊 ניתוח נתונים (Analytics)
- **גרף עמודות** - סטטיסטיקות לפי מקור
- **גרף עוגה** - התפלגות כתבות
- **גרף קווים** - אחוזי בדיקה והתאמות
- **צבעים דינמיים** - לכל מקור

## 🚀 התקנה מהירה

### דרישות מקדימות
- Node.js 18+ 
- npm או yarn
- Backend API רץ על http://localhost:3000

### שלב 1: התקנה

```bash
cd dashboard
npm install
```

### שלב 2: הגדרת סביבה

צור קובץ `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### שלב 3: הרצה

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

הדשבורד יהיה זמין ב: **http://localhost:3001**

## 📁 מבנה הפרויקט

```
dashboard/
├── app/
│   ├── layout.tsx          # Layout ראשי
│   ├── page.tsx            # דף ראשי - Dashboard
│   └── globals.css         # סטיילים גלובליים
├── components/
│   ├── StatsCard.tsx       # כרטיס סטטיסטיקה
│   ├── ArticlesTable.tsx   # טבלת כתבות
│   ├── MatchesTable.tsx    # טבלת התאמות
│   ├── Charts.tsx          # גרפים
│   └── FilterPanel.tsx     # פאנל סינונים
├── lib/
│   └── api.ts              # קריאות API
├── types/
│   └── index.ts            # הגדרות TypeScript
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎨 טכנולוגיות

### Frontend Framework
- **Next.js 14** - React framework עם App Router
- **TypeScript** - type safety
- **React 18** - UI library

### Styling
- **Tailwind CSS** - utility-first CSS
- **Lucide React** - אייקונים מודרניים

### Data Fetching
- **SWR** - React Hooks לטעינת נתונים
- **Axios** - HTTP client

### Charts
- **Recharts** - ספריית גרפים מבוססת React

### Date Handling
- **date-fns** - עבודה עם תאריכים

## 🔌 API Endpoints

הדשבורד מצפה לבאקאנד עם ה-endpoints הבאים:

### Stats
```typescript
GET /api/stats
→ { stats: SystemStats }
```

### Articles
```typescript
GET /api/articles?source=X&onlyNew=true
→ { articles: Article[] }

GET /api/articles/new
→ { articles: Article[] }

POST /api/articles/mark-checked
Body: { articleIds: number[] }

POST /api/articles/mark-old
Body: { articleIds: number[] }

POST /api/articles/mark-all-new

DELETE /api/articles
Body: { articleIds: number[] }
```

### Matches
```typescript
GET /api/matches
→ { matches: Match[] }

DELETE /api/matches
Body: { matchIds: number[] }
```

### Operations
```typescript
POST /api/fetch
→ שליפת כתבות מ-RSS

POST /api/compare
→ השוואה פשוטה

POST /api/compare-new
→ השוואת כתבות חדשות מול כל המאגר

POST /api/compare-advanced
Body: ComparisonJobOptions
```

### Sources
```typescript
GET /api/sources
→ { sources: string[] }
```

## 🎯 תכונות מתקדמות

### 1. רענון אוטומטי
הדשבורד מרענן את הנתונים אוטומטית כל 10 שניות באמצעות SWR:

```typescript
const { data } = useSWR('stats', api.getStats, { 
  refreshInterval: 10000 
});
```

### 2. סינון דינמי
פילטרים משתנים מעדכנים את הטבלה מיידית:

```typescript
const { data: articles } = useSWR(
  ['articles', filters], 
  () => api.getArticles(filters)
);
```

### 3. בחירה מרובה
אפשר לבחור כמה כתבות ולבצע פעולות קבוצתיות:

```typescript
<ArticlesTable 
  articles={articles} 
  selectable
  onSelect={setSelectedArticles}
/>
```

### 4. Loading States
כל פעולה מציגה מצב טעינה:

```typescript
{isLoading && (
  <div className="fixed inset-0 bg-black bg-opacity-50">
    <RefreshCw className="animate-spin" />
  </div>
)}
```

### 5. Responsive Design
הדשבורד מותאם לכל המסכים:
- Mobile: תצוגת טור
- Tablet: 2 עמודות
- Desktop: 3+ עמודות

## 🎨 עיצוב

### צבעים
```css
Primary: #3b82f6 (כחול)
Success: #10b981 (ירוק)
Warning: #f59e0b (כתום)
Error: #ef4444 (אדום)
Info: #8b5cf6 (סגול)
```

### Shadows
```css
Card: shadow-sm hover:shadow-md
Modal: shadow-lg
```

### Animations
```css
Fade In: animate-fadeIn (0.3s)
Spin: animate-spin (1s)
```

## 🔧 התאמה אישית

### שינוי צבעים
ערוך את `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        // ...
      }
    }
  }
}
```

### הוספת שפה
הוסף את ה-locale המתאים ב-`date-fns`:

```typescript
import { he } from 'date-fns/locale';

formatDistanceToNow(date, { locale: he });
```

### שינוי מרווח רענון
ב-`app/page.tsx`:

```typescript
const { data } = useSWR('stats', api.getStats, { 
  refreshInterval: 5000 // 5 שניות במקום 10
});
```

## 📊 דוגמאות שימוש

### הוספת פילטר חדש

1. הוסף ל-`types/index.ts`:
```typescript
export interface FilterOptions {
  // ... existing
  myNewFilter?: string;
}
```

2. הוסף ל-`FilterPanel.tsx`:
```tsx
<div>
  <label>הפילטר החדש שלי</label>
  <input
    value={currentFilters.myNewFilter || ''}
    onChange={(e) => handleFilterChange('myNewFilter', e.target.value)}
  />
</div>
```

3. הוסף ב-Backend את הטיפול בפילטר

### הוספת גרף חדש

1. הוסף ל-`Charts.tsx`:
```tsx
<ResponsiveContainer width="100%" height={300}>
  <AreaChart data={myData}>
    <Area dataKey="value" fill="#3b82f6" />
  </AreaChart>
</ResponsiveContainer>
```

## 🐛 Troubleshooting

### הדשבורד לא מתחבר לבאקאנד

```bash
# בדוק שה-backend רץ
curl http://localhost:3000/api/stats

# בדוק את המשתנה סביבה
echo $NEXT_PUBLIC_API_URL
```

### שגיאות CORS

הוסף ב-backend:
```typescript
app.use(cors({
  origin: 'http://localhost:3001'
}));
```

### נתונים לא מתעדכנים

```bash
# נקה cache
rm -rf .next
npm run dev
```

## 📱 Mobile Support

הדשבורד תומך במובייל עם:
- תפריט המבורגר ל-Tabs
- טבלאות עם גלילה אופקית
- כרטיסים מותאמים
- כפתורים גדולים יותר

## 🚀 Deployment

### Vercel (מומלץ)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Static Export
```bash
npm run build
# העתק את /out לשרת סטטי
```

## 📄 License

MIT

## 🤝 Contributing

Pull requests are welcome!

## 📞 Support

יש בעיה? פתח issue ב-GitHub.

---

**נבנה עם ❤️ באמצעות Next.js + TypeScript + React**
