# Quick Start Commands

## 🚀 Start Development

### Terminal 1: Backend API
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\rest-express"
npm run dev
```
Backend akan running di: http://localhost:3001

### Terminal 2: React Native Metro
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\FrontendReactNative"
npm start
```

### Terminal 3: Run Android
```bash
cd "d:\Important Document\Aku nak magang...bismillah\After Interview\FrontendReactNative"
npx react-native run-android
```

## 📱 Alternative Commands

### Using npm scripts
```bash
# Android
npm run android

# iOS
npm run ios

# Start Metro
npm start
```

### Clear cache if needed
```bash
npm start -- --reset-cache
```

### Clean build Android
```bash
cd android
gradlew clean
cd ..
npx react-native run-android
```

## 🔧 Configuration Checklist

Before running:
- [ ] Backend API running on port 3001
- [ ] API_BASE_URL configured in `src/services/api.js`
- [ ] Android Emulator started OR Physical device connected
- [ ] USB Debugging enabled (for physical device)

## 📍 Important URLs

- Backend API: http://localhost:3001
- Android Emulator API: http://10.0.2.2:3001
- Metro Bundler: http://localhost:8081

## 🎯 First Time Setup

1. **Install global dependencies** (if not done):
```bash
npm install -g react-native-cli
```

2. **Install project dependencies** (already done):
```bash
npm install
```

3. **Link native modules for iOS** (if developing for iOS):
```bash
cd ios
pod install
cd ..
```

## 🐛 Quick Troubleshooting

### Port already in use:
```bash
# Kill process on port 8081
npx react-native start --port 8082
```

### Build failed:
```bash
cd android
./gradlew clean
cd ..
```

### Metro bundler error:
```bash
npm start -- --reset-cache
```

### Can't connect to backend:
- Check backend is running
- For emulator use `10.0.2.2` not `localhost`
- For device use computer IP address

## ✅ Verify Setup

Test backend API:
```bash
curl http://localhost:3001/api/operations
```

Should return JSON with operations list.

---

**Quick Command Summary:**
```bash
# Backend
cd rest-express && npm run dev

# React Native (new terminal)
cd FrontendReactNative && npm start

# Android (new terminal)
cd FrontendReactNative && npx react-native run-android
```
