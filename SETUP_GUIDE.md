# Setup Guide - React Native OCR Production Management

## ✅ Yang Sudah Selesai

### 1. Instalasi Dependencies
```bash
✅ npm install -g react-native-cli
✅ npx @react-native-community/cli init FrontendReactNative
✅ npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
✅ npm install react-native-screens react-native-safe-area-context
✅ npm install axios
✅ npm install react-native-vision-camera
✅ npm install vision-camera-ocr
✅ npm install @react-native-picker/picker
✅ npm install react-native-date-picker
✅ npm install react-native-vector-icons
```

### 2. Struktur Folder
```
✅ src/screens/
✅ src/components/
✅ src/services/
✅ src/navigation/
```

### 3. Files Created
```
✅ src/services/api.js - API client dengan Axios
✅ src/navigation/AppNavigator.js - Navigation setup
✅ src/screens/DashboardScreen.js - Dashboard dengan cards
✅ src/screens/OperationsListScreen.js - List operasi
✅ src/screens/AddOperationScreen.js - Form tambah dengan OCR button
✅ src/screens/EditOperationScreen.js - Form edit
✅ src/screens/OCRCameraScreen.js - Camera OCR scanner
✅ App.tsx - Updated dengan navigation
```

### 4. Android Configuration
```
✅ AndroidManifest.xml - Camera permissions added
```

## 🔧 Langkah Selanjutnya

### 1. Konfigurasi API Base URL

Edit `src/services/api.js` baris 3-5:

**Untuk Android Emulator** (Default):
```javascript
const API_BASE_URL = 'http://10.0.2.2:3001/api';
```

**Untuk Physical Device**:
```javascript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3001/api';
```
Ganti `YOUR_COMPUTER_IP` dengan IP komputer kamu (cek dengan `ipconfig` di Windows).

### 2. Pastikan Backend Running

Di terminal lain, jalankan backend Express:
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\rest-express"
npm run dev
```

Backend harus running di `http://localhost:3001`

### 3. Jalankan React Native

#### Option A: Android Emulator (Recommended untuk Testing)

1. Buka Android Studio
2. Start AVD (Android Virtual Device)
3. Di terminal project React Native:
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\FrontendReactNative"
npm start
```
4. Di terminal baru:
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\FrontendReactNative"
npx react-native run-android
```

#### Option B: Physical Android Device

1. Enable "Developer Options" di Android:
   - Settings → About Phone → Tap "Build Number" 7x
2. Enable "USB Debugging":
   - Settings → Developer Options → USB Debugging
3. Connect device via USB
4. Di terminal:
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\FrontendReactNative"
npm start
```
5. Di terminal baru:
```bash
npx react-native run-android
```

### 4. Testing Aplikasi

#### Dashboard
- Buka app → Lihat tab "Dashboard"
- Harus menampilkan 4 cards dengan statistik
- List operasi terbaru hari ini

#### Operasi
- Tab "Operasi" → Lihat list operations
- FAB (+) button → Add operation
- Isi form manual atau gunakan OCR

#### OCR Scanner
- Saat add operation → Tap "📷 Scan dengan OCR"
- Allow camera permission
- Arahkan ke dokumen dengan angka
- Tap "Scan"
- Data suhu dan berat akan otomatis terisi

## 🐛 Common Issues & Solutions

### 1. Metro Bundler Error
```bash
npm start -- --reset-cache
```

### 2. Build Failed
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### 3. Network Error "Unable to connect"
- Cek backend running: `http://localhost:3001/api/operations`
- Untuk emulator gunakan `10.0.2.2` bukan `localhost`
- Untuk physical device gunakan IP komputer

### 4. Camera Permission Denied
- Go to Settings → Apps → FrontendReactNative → Permissions → Enable Camera

### 5. OCR Not Working
- Pastikan pencahayaan cukup
- Dokumen harus jelas dan fokus
- Text/angka harus terbaca jelas

## 📱 Testing Checklist

- [ ] Backend API running di port 3001
- [ ] App builds successfully
- [ ] Dashboard loads dengan data
- [ ] Can navigate between tabs
- [ ] Can view operations list
- [ ] Can add operation manually
- [ ] Can scan with OCR camera
- [ ] OCR extracts temperature and weight
- [ ] Can edit operation
- [ ] Can delete operation
- [ ] Pull to refresh works

## 🎯 Quick Test Flow

1. **Start Backend**:
```bash
cd rest-express
npm run dev
```

2. **Start React Native**:
```bash
cd FrontendReactNative
npm start
# Terminal baru:
npx react-native run-android
```

3. **Test in App**:
   - Dashboard → Check statistics
   - Operations → Add new
   - Fill form or use OCR
   - Save and verify in list

## 📝 API Configuration

### Backend Endpoints Used:
- `GET /api/groups` - Master data groups
- `GET /api/shifts` - Master data shifts
- `GET /api/production-lines` - Master data production lines
- `GET /api/operations` - All operations
- `GET /api/operations/:id` - Single operation
- `POST /api/operations` - Create operation
- `PUT /api/operations/:id` - Update operation
- `DELETE /api/operations/:id` - Delete operation

### Request Format (Create/Update):
```json
{
  "operation_date": "2025-12-12",
  "group_id": 1,
  "shift_id": 1,
  "production_line_id": 1,
  "temperature": 75.5,
  "weight": 120.75,
  "quality": "OK",
  "input_method": "OCR"
}
```

### Response Format:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "operationDate": "2025-12-12",
    "temperature": 75.5,
    "weight": 120.75,
    "quality": "OK",
    "inputMethod": "OCR",
    "group": { "name": "Group A" },
    "shift": { "shiftNumber": 1 },
    "productionLine": { "lineCode": "LINE-01" }
  }
}
```

## 🎨 UI Components

### Color Scheme:
- Primary: `#059669` (Greenfields Green)
- Success: `#10b981` (OK badge)
- Danger: `#ef4444` (NOT OK badge)
- Manual: `#3b82f6` (Blue)
- OCR: `#a855f7` (Purple)

### Navigation:
- Bottom Tabs: Dashboard, Operations
- Stack Navigator: Add, Edit, OCR Camera

## 🚀 Production Build

### Android APK:
```bash
cd android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Before Release:
1. Update `API_BASE_URL` ke production server
2. Generate release keystore
3. Update `android/app/build.gradle` dengan keystore config
4. Test thoroughly

## 📞 Support

Jika ada error atau pertanyaan:
1. Check console logs di Metro Bundler
2. Check Logcat di Android Studio
3. Verify backend API dengan Postman
4. Check network connectivity

---

**Project**: MBKM Internship Test - Greenfields
**Stack**: React Native + Express.js + Prisma + SQL Server
**Features**: CRUD + OCR Scanning + Real-time Dashboard
