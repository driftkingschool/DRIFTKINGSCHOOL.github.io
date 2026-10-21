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
├── hero-bg.mp4         סרטון רקע ל-hero (11MB, H.264 CRF 28)
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

## Packages (8) · updated 21/10/2026

| # | Name | What's in it | Price | Booking |
|---|---|---|---|---|
| 1 | First Drift | 2 drift sessions × 10 min | 1,500 ₪ | online `/book/?pkg=first` |
| 2 | CLASSIC (flagship) | 2 drift sessions × 15 min + taxi | 1,800 ₪ | online `/book/?pkg=classic` |
| 3 | Drift + Track | 15-min drift + Mazda MX-5 track session (6 laps) | 2,300 ₪ | WhatsApp |
| 4 | Drift + Track BRZ | 15-min drift + supercharged Subaru BRZ track session | 2,500 ₪ | WhatsApp |
| 5 | Drift + Track Premium | 15-min drift + Porsche 718-S track session | 2,800 ₪ | WhatsApp |
| 6 | Drift Advanced | 4 drift sessions + taxi, can be split between two drivers | 3,100 ₪ | online `/book/?pkg=driftadvanced` |
| 7 | Grand Prix Drift | 3 drift sessions + 2 Porsche track sessions + taxi | 4,500 ₪ | WhatsApp |
| 8 | Drift King | 10 sessions, full day, video review, certificate | 7,000 ₪ | online `/book/?pkg=king` |

Online prices live in the booking Apps Script (`BK_PACKAGES`), not in this repo. A price change has to be made in both places.

## Known Tech Debt

- `hero-bg.mp4` — נדחס מ-45MB ל-11MB (H.264 CRF 28, preset slow). המקור שמור ב-`archive/` לוקלית (לא ב-git).
- GA4 — בלוק gtag מוטמע ב-`<head>` אך לא פעיל: ממתין ל-Measurement ID אמיתי במקום `G-XXXXXXXXXX`.
- טסטימוניאלים — אין סקשן עדיין, ממתין ל-3-4 ציטוטים + שמות + תמונות לקוחות.
