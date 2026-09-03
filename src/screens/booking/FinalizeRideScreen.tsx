import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  FinalizeRideScreenNavigationProp,
  FinalizeRideScreenRouteProp,
  DriverInfo,
  TripInfoData,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { Input } from '../../components/common/Input';
import { DriverSummaryCard } from '../../components/booking/DriverSummaryCard';
import { InfoNoteBox } from '../../components/booking/InfoNoteBox';
import {
  CheckCircleIcon,
  CrossCircleIcon,
  LocationMarkerIcon,
  FlagIcon,
  SearchIcon,
} from '../../assets/icons/Icons';
import { detectCurrentLocationWithGps } from '../../utils/mapConfig';
import { useTheme } from '../../theme';

export const FinalizeRideScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<FinalizeRideScreenNavigationProp>();
  const route = useRoute<FinalizeRideScreenRouteProp>();

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

  const tripInfo: TripInfoData = route.params?.tripInfo || {
    pickupLocation: 'Patna Junction',
    destination: 'Gaya',
    date: '15 Aug 2026',
    pickupTime: '5:00 PM',
    passengers: '4 People',
    vehicleModel: driver.vehicleModel || 'Maruti Dzire',
  };

  const [fareText, setFareText] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [locationType, setLocationType] = useState<'pickup' | 'drop' | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const agreedFare = parseInt(fareText, 10) || 0;
  const isFormValid = pickupLocation.trim().length > 0 && dropLocation.trim().length > 0 && agreedFare > 0;

  const locationOptions = [
    'Patna Junction, Patna',
    'Bailey Road, Patna',
    'Kankarbagh, Patna',
    'Boring Road, Patna',
    'Patna Airport (PAT)',
    'Gaya Junction, Gaya',
    'Muzaffarpur City',
    'Bhagalpur Station',
    'Connaught Place, New Delhi',
    'IGI Airport T3, New Delhi',
    'Sector 18, Noida',
    'Varanasi Cantt, Varanasi',
  ];

  const filteredLocations = useMemo(() => {
    const query = locationQuery.trim().toLowerCase();
    return query
      ? locationOptions.filter(location => location.toLowerCase().includes(query))
      : locationOptions;
  }, [locationQuery]);

  const closeLocationPicker = () => {
    setLocationType(null);
    setLocationQuery('');
  };

  const selectLocation = (location: string) => {
    if (locationType === 'pickup') {
      setPickupLocation(location);
    } else {
      setDropLocation(location);
    }
    closeLocationPicker();
  };

  const handleUseCurrentLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const geo = await detectCurrentLocationWithGps();
      selectLocation(geo.shortLocation);
    } catch {
      Alert.alert('Location Error', 'Could not detect your location. Please search and select a place.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleConfirmRide = () => {
    if (!isFormValid) {
      return;
    }

    navigation.navigate('TripDetails', {
      driver,
      tripInfo: {
        ...tripInfo,
        pickupLocation,
        destination: dropLocation,
      },
      agreedFare,
      selectedCity: route.params?.selectedCity,
    });
  };

  const handleNotConfirmed = () => {
    navigation.navigate('NearbyDrivers', {
      selectedCity: route.params?.selectedCity,
    });
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
        title={driver.name}
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 24,
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Title & Subtitle */}
          <View className="items-center mb-6">
            <Text style={{ color: colors.text }} className="text-2xl font-black tracking-tight text-center">
              Did you finalize this ride?
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-xs font-medium mt-1.5 text-center">
              Only confirmed rides become bookings.
            </Text>
          </View>

          {/* Driver Card */}
          <DriverSummaryCard driver={driver} className="mb-5" />

          {/* Trip Route */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="border rounded-xl p-4 mb-5"
          >
            <Text style={{ color: colors.text }} className="text-sm font-extrabold mb-3">
              Trip details
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setLocationType('pickup')}
              className="flex-row items-center"
            >
              <LocationMarkerIcon size={18} color="#2563EB" />
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider">
                    Pickup location
                  </Text>
                  <Text className="text-[10px] font-bold text-red-500 ml-1">*</Text>
                </View>
                <Text
                  style={{
                    color: pickupLocation ? colors.text : colors.placeholder,
                  }}
                  className={`text-sm mt-0.5 ${pickupLocation ? 'font-bold' : 'font-semibold'}`}
                  numberOfLines={2}
                >
                  {pickupLocation || 'Select pickup location'}
                </Text>
                <Text className="text-[10px] font-semibold text-blue-600 mt-1">
                  Search and select from map
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ backgroundColor: colors.border }} className="w-px h-4 ml-[8px] my-1" />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setLocationType('drop')}
              className="flex-row items-center"
            >
              <FlagIcon size={18} color="#DC2626" />
              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text style={{ color: colors.placeholder }} className="text-[10px] font-bold uppercase tracking-wider">
                    Drop location
                  </Text>
                  <Text className="text-[10px] font-bold text-red-500 ml-1">*</Text>
                </View>
                <Text
                  style={{
                    color: dropLocation ? colors.text : colors.placeholder,
                  }}
                  className={`text-sm mt-0.5 ${dropLocation ? 'font-bold' : 'font-semibold'}`}
                >
                  {dropLocation || 'Select drop location'}
                </Text>
                <Text className="text-[10px] font-semibold text-blue-600 mt-1">
                  Search and select from map
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Agreed Fare */}
          <View className="mb-2">
            <Input
              label="Agreed fare"
              value={fareText}
              onChangeText={(text) => setFareText(text.replace(/[^0-9]/g, ''))}
              placeholder="Enter fare amount"
              keyboardType="numeric"
              maxLength={6}
              leftIcon={<Text style={{ color: colors.textSecondary }} className="text-base font-bold">₹</Text>}
              helperText="Enter the amount agreed with the driver."
            />
          </View>

          {/* Private Call Notice */}
          <InfoNoteBox
            title="This was a private call."
            subtitle="A call does not create a booking."
            className="mb-6"
          />
        </View>

        {/* Action CTAs */}
        <View className="space-y-3.5 mt-4">
          {/* Primary Confirm Ride Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirmRide}
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? colors.primary : colors.disabled,
            }}
            className="w-full py-4 px-6 rounded-xl flex-row items-center justify-center shadow-md mb-3"
          >
            <View className="mr-2">
              <CheckCircleIcon size={19} color="#FFFFFF" />
            </View>
            <Text className="text-white text-base font-extrabold tracking-wide">
              Confirm & Continue
            </Text>
          </TouchableOpacity>

          {/* Secondary Not Confirmed Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNotConfirmed}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
            className="w-full py-3.5 px-6 rounded-xl border flex-row items-center justify-center"
          >
            <View className="mr-2">
              <CrossCircleIcon size={18} color={colors.textSecondary} />
            </View>
            <Text style={{ color: colors.text }} className="text-sm font-bold tracking-wide">
              Not Confirmed
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={locationType !== null}
        animationType="slide"
        transparent
        onRequestClose={closeLocationPicker}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View style={{ backgroundColor: colors.card }} className="rounded-t-3xl p-5 max-h-[85%]">
            <View
              style={{ borderBottomColor: colors.border }}
              className="flex-row items-center justify-between pb-3 border-b"
            >
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-bold">
                  Select {locationType === 'pickup' ? 'pickup' : 'drop'} location
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
                  Search a place and select it from the map results
                </Text>
              </View>
              <TouchableOpacity
                onPress={closeLocationPicker}
                style={{ backgroundColor: colors.surface }}
                className="p-2 rounded-full"
              >
                <Text style={{ color: colors.textSecondary }} className="font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderColor: colors.border,
                backgroundColor: colors.input,
              }}
              className="my-3 flex-row items-center border rounded-xl px-3.5 h-12"
            >
              <SearchIcon size={18} color={colors.placeholder} />
              <TextInput
                value={locationQuery}
                onChangeText={setLocationQuery}
                placeholder="Search city, station, area..."
                placeholderTextColor={colors.placeholder}
                autoCorrect={false}
                style={{ color: colors.text }}
                className="flex-1 ml-2.5 text-sm font-semibold h-full p-0"
              />
            </View>

            {locationType === 'pickup' && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleUseCurrentLocation}
                disabled={isDetectingLocation}
                style={{
                  backgroundColor: `${colors.primary}15`,
                  borderColor: `${colors.primary}30`,
                }}
                className="flex-row items-center p-3 mb-2 rounded-xl border"
              >
                <View style={{ backgroundColor: colors.primary }} className="w-8 h-8 rounded-full items-center justify-center mr-2.5">
                  <LocationMarkerIcon size={16} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text style={{ color: colors.primary }} className="text-xs font-bold">
                    {isDetectingLocation ? 'Detecting location...' : 'Use current GPS location'}
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-[11px]">
                    Detect your pickup point automatically
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {filteredLocations.map(location => {
                const isSelected = location === (locationType === 'pickup' ? pickupLocation : dropLocation);
                return (
                  <TouchableOpacity
                    key={location}
                    activeOpacity={0.7}
                    onPress={() => selectLocation(location)}
                    style={{
                      borderBottomColor: colors.border,
                      backgroundColor: isSelected ? `${colors.primary}18` : 'transparent',
                    }}
                    className={`flex-row items-center py-3.5 px-2 border-b ${isSelected ? 'rounded-lg' : ''}`}
                  >
                    <LocationMarkerIcon size={18} color={isSelected ? colors.primary : colors.placeholder} />
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                      }}
                      className={`text-sm ml-3 flex-1 ${isSelected ? 'font-bold' : 'font-semibold'}`}
                    >
                      {location}
                    </Text>
                    {isSelected && <CheckCircleIcon size={16} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
