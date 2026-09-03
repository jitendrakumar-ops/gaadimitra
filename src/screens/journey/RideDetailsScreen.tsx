import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  RideDetailsScreenNavigationProp,
  RideDetailsScreenRouteProp,
  DriverInfo,
  TripInfoData,
} from '../../types/navigation';
import {
  PhoneIcon,
  ShareNodesIcon,
  ProhibitedBanIcon,
  LocationMarkerIcon,
  CalendarDateIcon,
  ClockTimeIcon,
} from '../../assets/icons/Icons';
import { ReportDriverModal } from '../../components/drivers/ReportDriverModal';
import { HeaderBar } from '../../components/common/HeaderBar';
import { useTheme } from '../../theme';

export const RideDetailsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<RideDetailsScreenNavigationProp>();
  const route = useRoute<RideDetailsScreenRouteProp>();

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

  const bookingId = route.params?.bookingId || '#RIDE10245';
  const agreedFare = route.params?.agreedFare || 1500;
  const status = route.params?.status || 'Completed';

  const tripInfo: TripInfoData = route.params?.tripInfo || {
    pickupLocation: 'Patna Junction',
    destination: 'Gaya',
    date: '15 Aug 2026',
    pickupTime: '5:00 PM',
    passengers: '4 People',
    vehicleModel: driver.vehicleModel || 'Maruti Dzire',
  };

  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const handleCallDriver = () => {
    Alert.alert('Call Driver', `Calling ${driver.name} (${driver.phone})...`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${driver.phone}`).catch(() => { });
        },
      },
    ]);
  };

  const handleShareTrip = async () => {
    try {
      await Share.share({
        message: `GaadiMitra Trip Details:\nBooking ID: ${bookingId}\nDriver: ${driver.name} (${driver.phone})\nVehicle: ${driver.vehicleModel} (${driver.vehiclePlate})\nPickup: ${tripInfo.pickupLocation}\nDrop: ${tripInfo.destination}\nFare: ₹${agreedFare}\nStatus: ${status}`,
      });
    } catch { }
  };

  const handleReportSubmit = (_reason: string) => {
    Alert.alert(
      'Report Submitted',
      'Thank you for reporting. Our support team will investigate this ride.'
    );
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in transit':
      case 'running':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-500';
      case 'completed':
      default:
        return 'text-emerald-600';
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-between">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title="Ride details"
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 28,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Card 1: Booking ID & Status */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="rounded-xl border p-5 mb-4 flex-row items-center justify-between"
          >
            <View>
              <Text style={{ color: colors.placeholder }} className="text-xs font-semibold">
                Booking ID
              </Text>
              <Text style={{ color: colors.text }} className="text-base font-black mt-0.5 tracking-wide">
                {bookingId}
              </Text>
            </View>
            <View className="items-end">
              <Text style={{ color: colors.placeholder }} className="text-xs font-semibold">
                Status
              </Text>
              <Text className={`text-base font-extrabold mt-0.5 ${getStatusColor()}`}>
                {status}
              </Text>
            </View>
          </View>

          {/* Card 2: Driver & Vehicle Info */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="rounded-xl border p-4 mb-4"
          >
            {/* Top Row: Driver Profile */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {/* Driver Avatar */}
                <View
                  className="overflow-hidden bg-blue-50 border border-blue-100"
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                >
                  <Image
                    source={require('../../assets/images/driver_rahul.jpg')}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>

                {/* Driver Name & Star Rating */}
                <View className="ml-3.5 flex-1">
                  <Text style={{ color: colors.text }} className="text-lg font-bold leading-tight">
                    {driver.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-amber-500 text-sm mr-1.5">★</Text>
                    <Text style={{ color: colors.text }} className="text-sm font-bold">
                      {driver.rating}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Call Driver Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCallDriver}
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="w-11 h-11 rounded-full border items-center justify-center ml-2"
              >
                <PhoneIcon size={19} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Subtle Divider */}
            <View style={{ backgroundColor: colors.border }} className="h-[1px] my-3.5" />

            {/* Bottom Row: Vehicle Model & Photo */}
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <Text style={{ color: colors.text }} className="text-base font-bold leading-tight">
                  {driver.vehicleModel}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-semibold mt-0.5 tracking-wider">
                  {driver.vehiclePlate}
                </Text>
              </View>

              {/* White Maruti Dzire Car Graphic */}
              <Image
                source={require('../../assets/images/maruti_dzire_white.jpg')}
                style={{ width: 120, height: 68 }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Card 3: Trip Information Table */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="rounded-xl border p-5 mb-5 space-y-4"
          >
            {/* Pickup Row */}
            <View className="flex-row items-start">
              <View className="items-center mr-3 mt-0.5">
                <LocationMarkerIcon size={18} color="#2563EB" />
                <View style={{ borderColor: colors.border }} className="w-0.5 h-6 border-l border-dashed my-0.5" />
              </View>
              <View className="flex-row items-center flex-1">
                <Text style={{ color: colors.placeholder }} className="text-xs font-semibold w-24">
                  Pickup
                </Text>
                <Text style={{ color: colors.text }} className="text-sm font-extrabold flex-1">
                  {tripInfo.pickupLocation}
                </Text>
              </View>
            </View>

            {/* Destination Row */}
            <View className="flex-row items-center">
              <View className="mr-3">
                <LocationMarkerIcon size={18} color="#EF4444" />
              </View>
              <View className="flex-row items-center flex-1">
                <Text style={{ color: colors.placeholder }} className="text-xs font-semibold w-24">
                  Destination
                </Text>
                <Text style={{ color: colors.text }} className="text-sm font-extrabold flex-1">
                  {tripInfo.destination}
                </Text>
              </View>
            </View>

            {/* Date Row */}
            <View className="flex-row items-center pt-1">
              <View className="mr-3">
                <CalendarDateIcon size={18} color={colors.textSecondary} />
              </View>
              <View className="flex-row items-center flex-1">
                <Text style={{ color: colors.placeholder }} className="text-xs font-semibold w-24">
                  Date
                </Text>
                <Text style={{ color: colors.text }} className="text-sm font-extrabold flex-1">
                  {tripInfo.date}
                </Text>
              </View>
            </View>

            {/* Time Row */}
            <View className="flex-row items-center pt-1">
              <View className="mr-3">
                <ClockTimeIcon size={18} color={colors.textSecondary} />
              </View>
              <View className="flex-row items-center flex-1">
                <Text style={{ color: colors.placeholder }} className="text-xs font-semibold w-24">
                  Time
                </Text>
                <Text style={{ color: colors.text }} className="text-sm font-extrabold flex-1">
                  {tripInfo.pickupTime}
                </Text>
              </View>
            </View>

            {/* Agreed Fare Row */}
            <View className="flex-row items-center pt-1">
              <View className="mr-3 w-[18px] items-center">
                <Text style={{ color: colors.textSecondary }} className="text-base font-bold">₹</Text>
              </View>
              <View className="flex-row items-center flex-1">
                <Text style={{ color: colors.placeholder }} className="text-xs font-semibold w-24">
                  Agreed Fare
                </Text>
                <Text style={{ color: colors.text }} className="text-base font-black flex-1">
                  ₹ {agreedFare.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Action Buttons */}
        <View className="pt-2">
          {/* Row 1: Call Driver & Share Trip */}
          <View className="flex-row items-center mb-3">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCallDriver}
              style={{ backgroundColor: colors.primary }}
              className="flex-1 py-4 px-4 rounded-xl flex-row items-center justify-center mr-2 shadow-md"
            >
              <PhoneIcon size={18} color="#FFFFFF" />
              <Text className="text-white text-base font-bold ml-2">
                Call Driver
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleShareTrip}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="flex-1 border py-4 px-4 rounded-xl flex-row items-center justify-center ml-2"
            >
              <ShareNodesIcon size={18} color={colors.primary} />
              <Text style={{ color: colors.primary }} className="text-base font-bold ml-2">
                Share Trip
              </Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: Report Ride */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowReportModal(true)}
            style={{
              backgroundColor: `${colors.error}10`,
              borderColor: `${colors.error}40`,
            }}
            className="w-full border py-4 px-6 rounded-xl flex-row items-center justify-center"
          >
            <ProhibitedBanIcon size={18} color="#EF4444" />
            <Text className="text-[#EF4444] text-base font-bold ml-2">
              Report Ride
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Report Driver & Ride Modal */}
      <ReportDriverModal
        visible={showReportModal}
        driverName={driver.name}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </SafeAreaView>
  );
};
