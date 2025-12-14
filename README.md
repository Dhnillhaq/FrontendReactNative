# Frontend React Native - Production Management

> ⚠️ **STATUS: IN DEVELOPMENT** - Project ini masih dalam tahap development aktif.

Mobile application untuk management produksi menggunakan React Native.

## 📊 Progress Development

### ✅ Sudah Selesai
- UI/UX Dashboard dengan statistik produksi
- Form CRUD Operations (Add, Edit, List)
- Navigation sistem (Bottom Tabs)
- Form input dengan date picker dan dropdown
- Component structure dan routing

### ⏳ Belum Selesai / In Progress
- **Backend Integration** - API belum tersambung
- **OCR Camera Feature** - Vision Camera masih unstable, currently disabled
- Testing & debugging
- Build optimization (path length issue on Windows)

## 📱 Tech Stack

- React Native 0.83
- React Navigation
- Axios (prepared, not integrated yet)
- React Native Vector Icons
- React Native Date Picker

# Getting Started

## Prerequisites

### Required Software
- **Node.js** 18+ and npm
- **JDK 17** (Eclipse Adoptium recommended)
- **Android Studio** with Android SDK
  - Android SDK Platform 34
  - Android SDK Build-Tools
  - Android Emulator (optional)
- **Git**

### Environment Variables (Windows)
Set these in System Environment Variables:
```
JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
ANDROID_HOME = D:\Android\Sdk
Path += %ANDROID_HOME%\platform-tools
Path += %ANDROID_HOME%\tools
```

### Installation

1. Clone repository
2. Install dependencies:
```bash
npm install
```

3. **IMPORTANT**: Project path must be short (< 100 characters)
   - ✅ Good: `D:\ReactApp`
   - ❌ Bad: `D:\Long\Folder\Names\Project` (causes build errors)

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

## Common Issues

<!-- ### ❌ "Filename longer than 260 characters"
**Cause**: Windows path length limitation.

**Solution**: Move project to shorter path
```bash
# Move project to D:\ReactApp instead of long nested folders
# Or use virtual drive:
subst P: "D:\Your\Long\Path\To\Project"
cd P:\
npx react-native run-android
``` -->

### ❌ "There is not enough space on the disk"
**Cause**: C: drive full (Gradle needs 2-3GB).

**Solution**: Clean disk space
```bash
# Clean Gradle cache
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches"

# Or run Windows Disk Cleanup on C: drive
# Then rebuild
```

### ❌ "Could not find java executable" / Wrong JDK version
**Cause**: JAVA_HOME not set or pointing to wrong JDK.

**Solution**: Set JDK 17 path
```bash
# In android/gradle.properties, add:
org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.17.10-hotspot
```

### ❌ "ninja: error: manifest still dirty"
**Cause**: Corrupted build cache.

**Solution**: Clean all build folders
```bash
cd android
.\gradlew clean
cd ..
rm -rf android/.gradle android/build android/app/build
npx react-native run-android
```

### ❌ Build fails after npm install
**Cause**: Native modules need rebuild.

**Solution**: Clean and rebuild
```bash
# Stop Gradle daemon
cd android
.\gradlew --stop

# Clean all
cd ..
rm -rf node_modules/@react-native*/android/.cxx
rm -rf android/build android/app/build

# Rebuild
npx react-native run-android
```

### 💡 General Tips
- Always use short project paths (< 100 chars)
- Keep 5GB+ free space on C: drive
- Use JDK 17, not JDK 20+
- Restart VS Code after changing environment variables

For more troubleshooting, see [React Native Docs](https://reactnative.dev/docs/troubleshooting).

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
