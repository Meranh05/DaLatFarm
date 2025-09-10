Deployment guide

1) Prerequisites
- Node 18+
- Firebase project (Firestore + Storage) OR Cloudinary for image uploads
- GitHub repo connected (optional)

2) Environment (.env)
Create a .env file (do NOT commit) with:

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
# optional
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=...

3) Firestore structure
- products: { name, description, category, images, image, views, featured, createdAt, updatedAt }
- events: { title/name, date, description, createdAt, updatedAt }
- messages: { name, email, phone, subject, message, status('new'|'in_progress'|'done'), createdAt }
- notifications: { type('product'|'event'|'message'|...), title, message, read, createdAt }
- activities: { type, refId, title, message, createdAt }
- stats/daily: map of YYYY-MM-DD -> count

4) Recommended Firestore security (production)
- See firebase/firestore.rules in project. Replace ADMIN_UID_* with real admin UIDs (Firebase Auth custom claims) and deploy rules.

5) Build & host
- Local build: npm ci && npm run build
- Static hosting options:
  a) Vercel: import repo → Framework: Other → Build: npm run build → Output: dist → Thêm domain `dalatfarm.id.vn` trong Project Settings → CNAME trỏ về `cname.vercel-dns.com`.
  b) Netlify: connect repo → Build: npm run build → Publish: dist → Add domain `dalatfarm.id.vn` → CNAME theo hướng dẫn.
  c) Firebase Hosting: đã thêm `firebase/firebase.json` (public: DaLatFarm/DaLatFarm/dist). Chạy:
     - npm run build
     - firebase use YOUR_FIREBASE_PROJECT_ID
     - firebase deploy --only hosting

6) Post-deploy checks
- Images load (Storage/Cloudinary CORS ok)
- Contact form writes to messages and triggers notifications
- Admin receives notifications and can view contacts at /admin/contacts
- Analytics page loads without console errors

