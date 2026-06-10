<h1>Penny</h1>
<p>A beautiful, intuitive, and modern personal finance tracker built with React Native and Expo.</p>

---

## ✨ Features

- **Transaction Management**: Effortlessly add, edit, and categorize your income and expenses.
- **Smart Filtering**: Quickly filter your transactions by periods (This Month, This Week, All Time) or by type (Income vs. Expense).
- **Search Capabilities**: Find specific transactions instantly with real-time text search.
- **Sleek Modern UI**: Enjoy a premium, dark-mode-ready interface featuring floating action buttons, clean typography, and smooth layouts.
- **Cross-Platform**: Runs flawlessly on iOS, Android, and the Web.
- **Privacy First**: All your financial data is securely stored locally on your device.

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- Expo Go app on your physical device (or an Android/iOS emulator running)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/student-ankitpandit/penny.git
   cd penny
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Running the App
- **Android / iOS:** Open the Expo Go app on your phone and scan the QR code generated in your terminal.
- **Web:** Press `w` in your terminal to launch the web application in your browser.
- **Emulator:** Press `a` (Android) or `i` (iOS) to launch directly into an active emulator.

## 🛠️ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/)
- **Icons**: Ionicons (via `@expo/vector-icons`)
- **State Management**: React Context API
- **Storage**: `@react-native-async-storage/async-storage`
- **Utilities**: `date-fns` for robust date formatting and logic

## 📂 Project Structure

```text
penny/
├── assets/             # Images, splash screens, and app icons
├── src/
│   ├── components/     # Reusable UI elements (Cards, FAB, etc.)
│   ├── constants/      # Centralized theme config (Colors, Fonts, Spacing)
│   ├── context/        # Global state management (ExpenseContext)
│   ├── navigation/     # Screen routing and navigators
│   ├── screens/        # Main application views (e.g., TransactionsScreen)
│   └── utils/          # Helper functions (calculations, storage logic)
├── App.js              # Application entry point
└── package.json        # Dependencies and scripts
```

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check out the issues page if you'd like to help improve Penny.