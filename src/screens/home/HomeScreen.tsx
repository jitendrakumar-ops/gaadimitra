import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import NetworkLogger from 'react-native-network-logger';
import { HomeScreenNavigationProp, HomeScreenRouteProp } from '../../types/navigation';
import { CarBadgeIcon, LogOutIcon, CheckCircleIcon } from '../../assets/icons/Icons';
import { authService } from '../../services/authService';
import { sendTestNetworkRequest } from '../../services/api';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const user = route.params?.user;

  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const handleTestApi = async () => {
    setIsTestingApi(true);
    setApiResult(null);
    try {
      const result = await sendTestNetworkRequest();
      setApiResult(`✅ Success! Status: ${result.status} (ID: ${result.data.id || '101'})`);
    } catch (error: any) {
      setApiResult(`❌ Error: ${error.message}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <View className="flex-row items-center space-x-2">
          <View className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 items-center justify-center mr-2.5">
            <CarBadgeIcon size={22} color="#2563EB" />
          </View>
          <View>
            <Text className="text-lg font-bold text-slate-900">
              Gaadi<Text className="text-blue-600">Mitra</Text>
            </Text>
            <Text className="text-[11px] text-slate-500 font-medium">Marketplace Hub</Text>
          </View>
        </View>

        {/* Logout CTA */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleLogout}
          className="flex-row items-center px-3 py-2 rounded-xl bg-red-50 border border-red-200"
        >
          <LogOutIcon size={16} color="#EF4444" />
          <Text className="text-xs font-semibold text-red-600 ml-1.5">Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {/* Welcome Card */}
        <View className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full bg-blue-600 items-center justify-center mr-3.5">
              <Text className="text-white text-lg font-bold">
                {user?.name ? user.name.charAt(0) : 'U'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-900">
                Welcome, {user?.name || 'Valued User'}!
              </Text>
              <Text className="text-xs text-slate-500 font-medium">
                {user?.countryCode || '+91'} {user?.phoneNumber || '9876543210'}
              </Text>
            </View>
            <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <Text className="text-[10px] font-bold text-emerald-700 uppercase">
                {user?.role || 'BUYER'}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center pt-3 border-t border-slate-100">
            <CheckCircleIcon size={14} color="#10B981" />
            <Text className="text-xs text-slate-600 ml-1.5">
              Account Authenticated Successfully
            </Text>
          </View>
        </View>

        {/* 📡 Interactive Network API Test Card */}
        <View className="p-5 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm mb-6">
          <Text className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            Network Tab Inspector Test
          </Text>
          <Text className="text-sm font-semibold text-slate-800 mb-2">
            Trigger Live HTTP POST Request
          </Text>
          <Text className="text-xs text-slate-500 mb-4">
            Tap below to execute live API calls to {'https://jsonplaceholder.typicode.com/posts'} and inspect headers, request body & response.
          </Text>

          <View className="space-y-3">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTestApi}
              disabled={isTestingApi}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 items-center justify-center flex-row shadow-sm"
            >
              {isTestingApi ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold">
                  🚀 Send Test API Request
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowNetworkModal(true)}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 items-center justify-center flex-row shadow-sm"
            >
              <Text className="text-white text-xs font-semibold">
                🔍 Open Full In-App Network Inspector
              </Text>
            </TouchableOpacity>
          </View>

          {apiResult && (
            <View className="mt-3 p-3 rounded-xl bg-white border border-blue-200">
              <Text className="text-xs font-mono text-blue-900">{apiResult}</Text>
            </View>
          )}
        </View>

        {/* Placeholder Marketplace Status Card */}
        <View className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <Text className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            Vehicle Marketplace
          </Text>
          <Text className="text-xl font-bold text-white mb-2">
            Ready for Vehicle Listing Feature
          </Text>
          <Text className="text-xs text-slate-300 leading-relaxed mb-4">
            The Login flow, navigation stack, TypeScript types, and NativeWind styling system are fully configured. Vehicle discovery, search filters, and inventory listing screens can now be built on this foundation.
          </Text>

          <View className="flex-row items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
            <Text className="text-xs text-slate-300">
              Session Token: <Text className="font-mono text-[11px] text-blue-300">{user?.id || 'usr_session'}</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Network Logger Fullscreen Modal */}
      <Modal
        visible={showNetworkModal}
        animationType="slide"
        onRequestClose={() => setShowNetworkModal(false)}
      >
        <SafeAreaView className="flex-1 bg-slate-900">
          <View className="flex-row items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <Text className="text-white font-bold text-base">Network Inspector</Text>
            <TouchableOpacity
              onPress={() => setShowNetworkModal(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-700"
            >
              <Text className="text-white text-xs font-bold">Close ✕</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <NetworkLogger theme="dark" />
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
