import 'react-native-get-random-values';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpenseProvider } from './src/context/ExpenseContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <ExpenseProvider>
        <StatusBar style="light" backgroundColor={COLORS.background} />
        <AppNavigator />
      </ExpenseProvider>
    </SafeAreaProvider>
  );
}
