## Cara Menjalankan

### Setup Database
Jalankan MySQL lalu buat database baru:
```sql
CREATE DATABASE javis;
```

### Jalankan Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```
Backend jalan di: **http://localhost:4000**

### Jalankan Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend jalan di: **http://localhost:5173**

### 4️⃣ Login
Gunakan akun berikut:
- Username: `admin`
- Password: `123456`

Setelah login berhasil, kamu akan diarahkan ke `/dashboard`.