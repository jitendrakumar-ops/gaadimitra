import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  DriverAcceptedScreenNavigationProp,
  DriverAcceptedScreenRouteProp,
  DriverInfo,
  TripInfoData,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { CelebrationBadge } from '../../components/booking/CelebrationBadge';
import { DriverSummaryCard } from '../../components/booking/DriverSummaryCard';
import { FareSummaryTable } from '../../components/booking/FareSummaryTable';
import { InfoNoteBox } from '../../components/booking/InfoNoteBox';
import { CheckCircleIcon, LockFilledIcon, CarBadgeIcon, ClockOutlineIcon, CrossCircleIcon } from '../../assets/icons/Icons';
import { useTheme } from '../../theme';

export const DriverAcceptedScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<DriverAcceptedScreenNavigationProp>();
  const route = useRoute<DriverAcceptedScreenRouteProp>();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [isDriverAccepted, setIsDriverAccepted] = useState(false);
  const pulseAnimation = useRef(new Animated.Value(0)).current;

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

  const tripInfo: TripInfoData = route.params?.tripInfo || {
    pickupLocation: 'Patna Junction',
    destination: 'Gaya',
    date: '15 Aug 2026',
    pickupTime: '5:00 PM',
    passengers: '4 People',
    vehicleModel: driver.vehicleModel || 'Maruti Dzire',
  };

  const driverFirstName = driver.name.split(' ')[0] || 'Rahul';
  const remainingFare = Math.max(0, agreedFare - bookingToken);

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    if (!isDriverAccepted) {
      pulse.start();
    }

    return () => pulse.stop();
  }, [isDriverAccepted, pulseAnimation]);

  useEffect(() => {
    const acceptanceTimer = setTimeout(() => {
      setIsDriverAccepted(true);
    }, 10000);

    return () => clearTimeout(acceptanceTimer);
  }, []);

  const handlePayToken = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      navigation.navigate('RideConfirmed', {
        driver,
        agreedFare,
        tripInfo,
        bookingToken,
        bookingId: '#RIDE10245',
      });
    }, 800);
  };

  if (!isDriverAccepted) {
    const pulseScale = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.12],
    });
    const ringScale = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.6],
    });
    const ringOpacity = pulseAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.35, 0],
    });

    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <HeaderBar onBackPress={() => navigation.goBack()} />

        <View className="flex-1 items-center justify-center px-6">
          <View className="w-28 h-28 items-center justify-center">
            <Animated.View
              style={{ transform: [{ scale: ringScale }], opacity: ringOpacity }}
              className="absolute w-28 h-28 rounded-full bg-blue-500"
            />
            <Animated.View
              style={{ transform: [{ scale: pulseScale }] }}
              className="w-20 h-20 rounded-full bg-blue-600 items-center justify-center shadow-lg shadow-blue-300"
            >
              <CarBadgeIcon size={34} color="#FFFFFF" />
            </Animated.View>
          </View>

          <Text style={{ color: colors.text }} className="text-2xl font-black text-center mt-8">
            Waiting for driver acceptance
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-sm font-medium text-center mt-2 leading-5">
            Your ride request has been sent to {driverFirstName}. We will show the booking details as soon as the driver accepts.
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="w-full border rounded-2xl shadow-sm p-4 mt-8"
          >
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 items-center justify-center mr-3">
                <CarBadgeIcon size={22} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider">
                  Requested driver
                </Text>
                <Text style={{ color: colors.text }} className="text-base font-extrabold mt-0.5">
                  {driver.name}
                </Text>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                <Text className="text-[10px] font-bold text-blue-600">
                  Pending
                </Text>
              </View>
            </View>

            <View style={{ backgroundColor: colors.border }} className="h-px my-3.5" />

            <View className="flex-row items-center justify-center">
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold ml-2">
                Checking driver availability...
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-5">
            <ClockOutlineIcon size={14} color={colors.placeholder} />
            <Text style={{ color: colors.placeholder }} className="text-xs font-medium ml-1.5">
              This usually takes less than a minute
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            className="flex-row items-center mt-6 px-6 py-3 rounded-xl border"
          >
            <CrossCircleIcon size={15} color={colors.textSecondary} />
            <Text style={{ color: colors.text }} className="text-sm font-bold ml-2">Cancel Request</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {/* Confetti & Green Success Checkmark */}
          <CelebrationBadge size={105} />

          {/* Title & Subtitle */}
          <View className="items-center mb-4">
            <Text style={{ color: colors.text }} className="text-2xl font-black tracking-tight text-center">
              Driver accepted
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-xs font-medium mt-1 text-center">
              {driverFirstName} has accepted your request.
            </Text>
          </View>

          {/* Driver Card */}
          <DriverSummaryCard driver={driver} className="mb-3.5" />

          {/* Driver Accepted Status Banner */}
          <View className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 mb-3.5 items-center">
            <View className="flex-row items-center">
              <CheckCircleIcon size={16} color="#15803D" />
              <Text className="text-xs font-extrabold text-emerald-800 ml-1.5">
                Driver Accepted
              </Text>
            </View>
            <Text className="text-[11px] font-medium text-emerald-700 mt-0.5 text-center">
              Complete your token payment to confirm the booking.
            </Text>
          </View>

          {/* Fare Summary Card */}
          <FareSummaryTable
            totalAgreedFare={agreedFare}
            tokenAmount={bookingToken}
            tokenLabel="Booking Token (Pay Now)"
            className="mb-3.5"
          />

          {/* Info Notice Box */}
          <InfoNoteBox
            subtitle={`Pay ₹${bookingToken} token to confirm your booking. You will pay ₹${remainingFare.toLocaleString(
              'en-IN'
            )} directly to the driver after the ride.`}
            className="mb-4"
          />
        </View>

        {/* Bottom Sticky Action Button */}
        <View className="mt-2">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePayToken}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-4 px-6 rounded-xl flex-row items-center justify-center shadow-md"
          >
            <View className="mr-2">
              <LockFilledIcon size={18} color="#FFFFFF" />
            </View>
            <Text className="text-white text-base font-extrabold tracking-wide">
              Pay ₹{bookingToken} Token
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Interactive Token Payment Modal Sheet */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View style={{ backgroundColor: colors.card }} className="rounded-t-3xl p-6 shadow-2xl">
            <View className="items-center mb-4">
              <View style={{ backgroundColor: colors.border }} className="w-12 h-1.5 rounded-full mb-3" />
              <Text style={{ color: colors.text }} className="text-xl font-black">
                Pay Booking Token
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
                Fast and secure payment via UPI, Card, or NetBanking
              </Text>
            </View>

            {/* Token Amount Box */}
            <View
              style={{
                backgroundColor: `${colors.primary}15`,
                borderColor: `${colors.primary}40`,
              }}
              className="p-4 rounded-xl border items-center justify-center mb-4"
            >
              <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-wider">
                Token Amount Payable
              </Text>
              <Text style={{ color: colors.text }} className="text-3xl font-black mt-0.5">
                ₹{bookingToken}
              </Text>
            </View>

            {/* Payment Options */}
            <View className="space-y-2 mb-6">
              {[
                { id: 'upi', title: 'UPI (GPay / PhonePe / Paytm)', subtitle: 'Instant 1-click token pay' },
                { id: 'card', title: 'Debit / Credit Card', subtitle: 'Visa, MasterCard, RuPay' },
                { id: 'wallet', title: 'Wallets / NetBanking', subtitle: 'Airtel, Amazon Pay, SBI, HDFC' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedMethod(opt.id as any)}
                  style={{
                    backgroundColor: selectedMethod === opt.id ? `${colors.primary}15` : colors.surface,
                    borderColor: selectedMethod === opt.id ? colors.primary : colors.border,
                  }}
                  className="p-3.5 rounded-xl border flex-row items-center justify-between mb-2"
                >
                  <View className="flex-1">
                    <Text style={{ color: colors.text }} className="text-xs font-bold">
                      {opt.title}
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="text-[10px] mt-0.5">
                      {opt.subtitle}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderColor: selectedMethod === opt.id ? colors.primary : colors.border,
                      backgroundColor: selectedMethod === opt.id ? colors.primary : 'transparent',
                    }}
                    className="w-5 h-5 rounded-full border items-center justify-center"
                  >
                    {selectedMethod === opt.id && (
                      <View className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Payment CTA */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirmPayment}
              disabled={isProcessingPayment}
              style={{ backgroundColor: colors.primary }}
              className="w-full py-4 rounded-xl items-center justify-center shadow-md mb-2"
            >
              {isProcessingPayment ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-base font-extrabold">
                  Confirm & Pay ₹{bookingToken}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPaymentModal(false)}
              className="py-2.5 items-center"
            >
              <Text style={{ color: colors.textSecondary }} className="text-xs font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
