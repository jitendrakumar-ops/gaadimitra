import React, { useEffect } from 'react';
import { View, Text, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  RideConfirmedScreenNavigationProp,
  RideConfirmedScreenRouteProp,
  DriverInfo,
  TripInfoData,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { CelebrationBadge } from '../../components/booking/CelebrationBadge';
import { DriverSummaryCard } from '../../components/booking/DriverSummaryCard';
import { FareSummaryTable } from '../../components/booking/FareSummaryTable';
import { CheckCircleIcon, ArrowRightIcon } from '../../assets/icons/Icons';
import { ridesService } from '../../services/rides';
import { useTheme } from '../../theme';

export const RideConfirmedScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<RideConfirmedScreenNavigationProp>();
  const route = useRoute<RideConfirmedScreenRouteProp>();

  const driver: DriverInfo = route.params?.driver || {
    id: 'drv_1',
    name: 'Rahul Kumar',
    phone: '+919876543210',
    rating: '4.8',
    totalRides: 286,
    experienceYears: 5,
    distance: '1.2 km away',
    isVerified: true,
    vehicleModel: 'Maruti Dzire',
    vehicleType: 'Car',
    vehiclePlate: 'BR01AB1234',
    hasAc: true,
    seatingCapacity: '4 Seats',
    pricePerKm: '₹14 / km',
  };

  const agreedFare = route.params?.agreedFare || 1500;
  const bookingToken = route.params?.bookingToken || 200;
  const bookingId = route.params?.bookingId || '#RIDE10245';

  const tripInfo: TripInfoData = route.params?.tripInfo || {
    pickupLocation: 'Patna Junction',
    destination: 'Gaya',
    date: '15 Aug 2026',
    pickupTime: '5:00 PM',
    passengers: '4 People',
    vehicleModel: driver.vehicleModel || 'Maruti Dzire',
  };

  useEffect(() => {
    // Save to My Rides list with active status
    ridesService.saveRide({
      bookingId,
      driver,
      tripInfo,
      agreedFare,
      bookingToken,
      status: 'active',
    });
  }, []);

  const handleViewMyRide = () => {
    navigation.navigate('RideDetails', {
      driver,
      agreedFare,
      tripInfo,
      bookingId,
      status: 'Active',
    });
  };

  const handleGoToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeDashboard' }],
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-between">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Navigation Bar */}
      <HeaderBar onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 0,
          paddingBottom: 24,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Confetti & Success Checkmark */}
          <CelebrationBadge size={105} />

          {/* Title & Subtitle */}
          <View className="items-center mb-3">
            <Text style={{ color: colors.text }} className="text-2xl font-black tracking-tight text-center">
              Ride confirmed
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-xs font-medium mt-1 text-center">
              Your booking is now confirmed.
            </Text>
          </View>

          {/* Booking ID Pill */}
          <View className="items-center mb-4">
            <View className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 flex-row items-center">
              <Text className="text-[11px] font-bold text-emerald-800">
                Booking ID{'  '}
              </Text>
              <Text className="text-xs font-black text-emerald-700 font-mono tracking-wider">
                {bookingId}
              </Text>
            </View>
          </View>

          {/* Driver Card */}
          <DriverSummaryCard driver={driver} className="mb-3.5" />

          {/* Fare Summary Card */}
          <FareSummaryTable
            totalAgreedFare={agreedFare}
            tokenAmount={bookingToken}
            tokenLabel="Token Paid"
            className="mb-3.5"
          />

          {/* Token Adjusted Green Status Pill */}
          <View className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 flex-row items-center justify-center mb-4">
            <CheckCircleIcon size={16} color="#15803D" />
            <Text className="text-xs font-bold text-emerald-800 ml-2">
              ₹{bookingToken} token is adjusted from your total fare.
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="mt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleViewMyRide}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-4 px-6 rounded-xl flex-row items-center justify-center shadow-md mb-3"
          >
            <Text className="text-white text-base font-extrabold tracking-wide mr-2">
              View My Ride
            </Text>
            <ArrowRightIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleGoToHome}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            className="w-full py-3.5 px-6 rounded-xl border items-center justify-center"
          >
            <Text style={{ color: colors.text }} className="text-sm font-bold tracking-wide">
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
