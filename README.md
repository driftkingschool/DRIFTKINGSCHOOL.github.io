# Drift King School — GitHub Pages Microsite

**Live:** https://driftkingschool.github.io/
**Main site:** https://driftkingschool.com (not replaced by this)
**Owner:** Drift King School — לביא אוחיון
**Contact:** +972-53-775-7323

---

## About

עמוד ייעודי (microsite) להצגת 8 חבילות חוויית הדריפט של Drift King School.
סטטי, vanilla HTML/CSS/JS, ללא build step, פריסה אוטומטית דרך GitHub Pages.

## Stack

- **HTML/CSS/JS vanilla** (ללא framework)
- **Lucide SVG icons** — inline ב-`<defs>` בראש ה-HTML
- **Google Fonts Heebo** — עברית
- **GitHub Pages** — deploy אוטומטי על `main` (~1-2 דקות לאחר push)

## Files

```
├── index.html          עמוד יחיד
├── style.css           טמה לבנה-יוקרתית (BMW-inspired)
├── script.js           חלקיקים, scroll, mobile menu
├── hero-bg.mp4         סרטון רקע ל-hero (45MB — לדחוס בעתיד)
├── logo.png
└── *.jpg               תמונות רקע לכרטיסי יתרונות
```

## Editing

```bash
cd "C:/Users/sokol/OneDrive/Desktop/dks-repo"
# ערוך index.html / style.css / script.js
git add -A
git commit -m "תיאור קצר של השינוי"
git push
```

Deploy אוטומטי — האתר החי מתעדכן תוך 1-2 דקות.

## Brand

- **Colors:** לבן `#fff` | אדום `#e30613` | כחול `#1c69d4`
- **Gold accents:** `#ffd700` (חבילות פרימיום, hero trophies)
- **Motto:** בלי גבולות, רק עשן
- **Tone:** מקצועי + חברותי + קורט הומור

## Packages (8)

| # | Name | Subtitle | Price |
|---|---|---|---|
| 1 | Taste Of Drift | טעימת דריפט | 1,799 ₪ |
| 2 | Drift Advanced | דריפט מתקדם | 2,199 ₪ |
| 3 | Drift PRO | דריפט מקצועי | 3,399 ₪ |
| 4 | Drift + Track | דריפט ומסלול | 2,199 ₪ |
| 5 | Drift + Track Premium | דריפט ומסלול פרימיום | 2,699 ₪ |
| 6 | Drift + Track VIP | דריפט ומסלול VIP | 4,499 ₪ |
| 7 | Drift King (MASTER) | מלך הדריפט | 6,499 ₪ |
| 8 | Your Own Car | על הרכב שלך | 1,299 ₪ |

## Known Tech Debt

- `hero-bg.mp4` — 45MB, כבד למובייל. דחיסה ל-8MB דרך ffmpeg CRF 28 תחסוך ~80% bandwidth.
- ללא Google Analytics / Hotjar — אין מדידת המרה נכון לעכשיו.
