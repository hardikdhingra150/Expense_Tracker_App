
# 💰 Expense Tracker

A modern, feature-rich personal finance tracker built with **React Native** and **Expo**. Track your daily expenses, income, and pocket money with a beautiful dark/light theme, 12-month calendar grid, and optional Google Calendar sync.

---

## ✨ Features

- 📊 **Dashboard** — Net balance, income vs expenses at a glance
- 📅 **12-Month Calendar Grid** — Visual monthly overview with daily breakdown
- 💸 **Expense Tracking** — Add expenses with categories, notes, and dates
- 💰 **Income Tracking** — Track salary, pocket money, gifts, investments
- 🌙 **Dark / Light Mode** — Full theme switch across all screens
- 💱 **Multi-Currency** — INR, USD, EUR, GBP support
- 🗓️ **Google Calendar Sync** — Sync expenses as calendar events
- 📦 **Offline First** — All data stored locally, no internet required
- 📲 **APK Export** — Build and share directly as Android APK

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo SDK 55 | Development toolchain |
| Expo Router | File-based navigation |
| AsyncStorage | Local data persistence |
| Expo Auth Session | Google OAuth integration |
| React Context API | Global state (theme, currency) |

---


## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Expo Go app on your phone

### Installation

```bash
git clone https://github.com/hardikdhingra150/expense-tracker.git
cd expense-tracker
npm install --legacy-peer-deps
npx expo install expo-router expo-auth-session expo-web-browser expo-secure-store @react-native-async-storage/async-storage react-native-safe-area-context react-native-screens expo-linking
```

### Run

```bash
npx expo start --clear
```

Scan the QR code with **Expo Go** on your phone.

---

## 📦 Build APK

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Android Studio

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

APK: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🗓️ Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable **Google Calendar API**
3. Create OAuth 2.0 credentials → Copy **Client ID**
4. Paste in `app/(tabs)/settings.js`:

```js
const GOOGLE_CLIENT_ID = 'your-client-id.apps.googleusercontent.com';
```

5. Add redirect URI: `https://auth.expo.io/@hardikdhingra150/expense-tracker`

---

## 💱 Currencies Supported

₹ INR · $ USD · € EUR · £ GBP

---

## 🔒 Privacy

All data stored **locally on device**. Nothing sent to any server. Google Calendar sync is optional and uses your own account.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Hardik Dhingra**
- GitHub: [@hardikdhingra150](https://github.com/hardikdhingra150)
- Expo: [@hardikdhingra150](https://expo.dev/@hardikdhingra150)
