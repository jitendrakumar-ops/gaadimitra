import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  TripDetailsScreenNavigationProp,
  TripDetailsScreenRouteProp,
  DriverInfo,
  TripInfoData,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { InfoNoteBox } from '../../components/booking/InfoNoteBox';
import { DriverSummaryCard } from '../../components/booking/DriverSummaryCard';
import {
  CalendarOutlineIcon,
  ClockOutlineIcon,
  UsersIcon,
  CarBadgeIcon,
  PaperPlaneIcon,
} from '../../assets/icons/Icons';
import { useTheme } from '../../theme';

export const TripDetailsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<TripDetailsScreenNavigationProp>();
  const route = useRoute<TripDetailsScreenRouteProp>();

  const [isSending, setIsSending] = useState(false);

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

  const tripInfo: TripInfoData = route.params?.tripInfo || {
    pickupLocation: 'Patna Junction',
    destination: 'Gaya',
    date: '15 Aug 2026',
    pickupTime: '5:00 PM',
    passengers: '4 People',
    vehicleModel: driver.vehicleModel || 'Maruti Dzire',
  };

  const handleSendRequest = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      navigation.navigate('DriverAccepted', {
        driver,
        agreedFare,
        tripInfo,
        bookingToken: 200,
      });
    }, 600);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-between">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Navigation Bar */}
      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title="Trip details"
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Driver Card */}
          <DriverSummaryCard driver={driver} className="mb-4" />

          {/* Route Timeline Card */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-4 rounded-xl border mb-4"
          >
            <Text style={{ color: colors.text }} className="text-sm font-extrabold mb-3.5">
              Route
            </Text>

            <View className="flex-row items-start">
              <View className="items-center mr-3 mt-0.5">
                <View
                  style={{
                    borderColor: colors.primary,
                    backgroundColor: colors.card,
                  }}
                  className="w-3.5 h-3.5 rounded-full border-2"
                />
                <View style={{ backgroundColor: colors.border }} className="w-0.5 h-9 my-1" />
                <View className="w-3.5 h-3.5 rounded-full bg-red-500" />
              </View>

              <View className="flex-1">
                <View className="mb-4">
                  <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider">
                    Pickup
                  </Text>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold mt-0.5">
                    {tripInfo.pickupLocation}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider">
                    Drop
                  </Text>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold mt-0.5">
                    {tripInfo.destination}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip Detail Chips */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-4 rounded-xl border mb-4"
          >
            <Text style={{ color: colors.text }} className="text-sm font-extrabold mb-3.5">
              Trip Details
            </Text>

            <View className="flex-row flex-wrap -mx-1.5">
              <View className="w-1/2 px-1.5 mb-3">
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="border rounded-xl p-3"
                >
                  <View className="flex-row items-center mb-1.5">
                    <CalendarOutlineIcon size={14} color={colors.primary} />
                    <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider ml-1.5">
                      Date
                    </Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold" numberOfLines={1}>
                    {tripInfo.date}
                  </Text>
                </View>
              </View>

              <View className="w-1/2 px-1.5 mb-3">
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="border rounded-xl p-3"
                >
                  <View className="flex-row items-center mb-1.5">
                    <ClockOutlineIcon size={14} color={colors.primary} />
                    <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider ml-1.5">
                      Pickup Time
                    </Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold" numberOfLines={1}>
                    {tripInfo.pickupTime}
                  </Text>
                </View>
              </View>

              <View className="w-1/2 px-1.5">
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="border rounded-xl p-3"
                >
                  <View className="flex-row items-center mb-1.5">
                    <UsersIcon size={14} color={colors.primary} />
                    <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider ml-1.5">
                      Passengers
                    </Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold" numberOfLines={1}>
                    {tripInfo.passengers}
                  </Text>
                </View>
              </View>

              <View className="w-1/2 px-1.5">
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="border rounded-xl p-3"
                >
                  <View className="flex-row items-center mb-1.5">
                    <CarBadgeIcon size={14} color={colors.primary} />
                    <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider ml-1.5">
                      Vehicle
                    </Text>
                  </View>
                  <Text style={{ color: colors.text }} className="text-sm font-extrabold" numberOfLines={1}>
                    {tripInfo.vehicleModel}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Fare Highlight Card */}
          <View
            style={{
              backgroundColor: `${colors.primary}15`,
              borderColor: `${colors.primary}40`,
            }}
            className="p-4 rounded-xl border mb-4 flex-row items-center justify-between"
          >
            <View>
              <Text style={{ color: colors.primary }} className="text-[11px] font-bold uppercase tracking-wider">
                Total Agreed Fare
              </Text>
              <Text style={{ color: colors.text }} className="text-2xl font-black mt-0.5">
                ₹{agreedFare.toLocaleString('en-IN')}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: `${colors.primary}40`,
              }}
              className="px-3 py-1.5 rounded-full border"
            >
              <Text style={{ color: colors.primary }} className="text-[11px] font-bold">
                Pay after ride
              </Text>
            </View>
          </View>

          {/* Info Notice Box */}
          <InfoNoteBox
            subtitle="Your request will be sent to the driver. No payment is required at this stage."
            className="mb-4"
          />
        </View>
      </ScrollView>

      {/* Sticky bottom CTA, stays fixed while trip details scroll */}
      <View
        style={{
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }}
        className="px-5 pt-3 pb-4 border-t"
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSendRequest}
          disabled={isSending}
          style={{ backgroundColor: colors.primary }}
          className="w-full py-4 px-6 rounded-xl flex-row items-center justify-center shadow-md"
        >
          {isSending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <View className="mr-2">
                <PaperPlaneIcon size={18} color="#FFFFFF" />
              </View>
              <Text className="text-white text-base font-extrabold tracking-wide">
                Send Confirmation Request
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
