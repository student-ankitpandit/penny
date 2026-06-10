import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import BudgetScreen from '../screens/BudgetScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SubscriptionsScreen from '../screens/SubscriptionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';

const TABS = [
  { key: 'Home',          label: 'Home',    activeIcon: 'home',         inactiveIcon: 'home-outline' },
  { key: 'Transactions',  label: 'History', activeIcon: 'list',         inactiveIcon: 'list-outline' },
  { key: 'Analytics',     label: 'Charts',  activeIcon: 'bar-chart',    inactiveIcon: 'bar-chart-outline' },
  { key: 'Subscriptions', label: 'Subs',    activeIcon: 'card',         inactiveIcon: 'card-outline' },
  { key: 'Budget',        label: 'Budget',  activeIcon: 'wallet',       inactiveIcon: 'wallet-outline' },
  { key: 'Settings',      label: 'Settings',activeIcon: 'settings',     inactiveIcon: 'settings-outline' },
];

const NavigationContext = React.createContext(null);
export const useNavigation = () => React.useContext(NavigationContext);

const AppNavigator = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [modalScreen, setModalScreen] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const navigate = (name, params) => {
    if (name === 'AddTransaction' || name === 'EditTransaction') {
      setModalScreen({ name, params });
    } else {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.7, duration: 80, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
      setActiveTab(name);
    }
  };

  const goBack = () => setModalScreen(null);
  const navigation = { navigate, goBack };

  const renderScreen = () => {
    if (modalScreen) {
      const route = { params: modalScreen.params || {} };
      if (modalScreen.name === 'AddTransaction') return <AddTransactionScreen navigation={navigation} route={route} />;
      if (modalScreen.name === 'EditTransaction') return <EditTransactionScreen navigation={navigation} route={route} />;
    }
    switch (activeTab) {
      case 'Home':          return <HomeScreen navigation={navigation} />;
      case 'Transactions':  return <TransactionsScreen navigation={navigation} />;
      case 'Analytics':     return <AnalyticsScreen navigation={navigation} />;
      case 'Subscriptions': return <SubscriptionsScreen navigation={navigation} />;
      case 'Budget':        return <BudgetScreen navigation={navigation} />;
      case 'Settings':      return <SettingsScreen navigation={navigation} />;
      default:              return <HomeScreen navigation={navigation} />;
    }
  };

  return (
    <NavigationContext.Provider value={navigation}>
      <View style={styles.container}>
        <Animated.View style={[styles.screenArea, { opacity: fadeAnim }]}>
          {renderScreen()}
        </Animated.View>
        {!modalScreen && (
          <View style={styles.tabBar}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => { if (activeTab !== tab.key) navigate(tab.key); }} activeOpacity={0.7}>
                  <View style={[styles.tabIconWrap, isActive && styles.tabIconWrapActive]}>
                    <Ionicons name={isActive ? tab.activeIcon : tab.inactiveIcon} size={21} color={isActive ? COLORS.accent : COLORS.textMuted} />
                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  screenArea: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 8, paddingTop: 6, paddingHorizontal: SPACING.xs },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  tabIconWrap: { width: 36, height: 28, borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  tabIconWrapActive: { backgroundColor: `${COLORS.accent}18` },
  tabLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '500' },
  tabLabelActive: { color: COLORS.accent, fontWeight: '700' },
});

export default AppNavigator;
