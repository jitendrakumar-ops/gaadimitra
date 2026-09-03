import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  HomeDashboardNavigationProp,
  HomeDashboardRouteProp,
} from '../../types/navigation';
import {
  BellNotificationIcon,
  LocationMarkerIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SedanCarGraphic,
  SuvGraphic,
  Mpv7SeaterGraphic,
  TravellerGraphic,
  LogOutIcon,
  CheckCircleIcon,
  PhoneIcon,
  SearchIcon,
} from '../../assets/icons/Icons';
import { VehicleCard, VehicleCategory } from '../../components/home/VehicleCard';
import { Button } from '../../components/common/Button';
import { detectCurrentLocationWithGps } from '../../utils/mapConfig';
import { useTheme } from '../../theme';

export const HomeDashboardScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<HomeDashboardNavigationProp>();
  const route = useRoute<HomeDashboardRouteProp>();
  const [selectedCity, setSelectedCity] = useState(
    route.params?.selectedCity || 'Patna Junction, Patna'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('car');
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showDriverResultsModal, setShowDriverResultsModal] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleDetectGpsLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const geo = await detectCurrentLocationWithGps();
      setSelectedCity(geo.shortLocation);
      setShowCityModal(false);
    } catch (err) {
      Alert.alert('GPS Error', 'Could not detect location. Please select manually.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Time-based greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning ☀️';
    if (hours < 17) return 'Good afternoon 👋';
    return 'Good evening 🌙';
  };

  const vehicleCategories: VehicleCategory[] = [
    {
      id: 'car',
      title: 'Car',
      capacity: '4 Seater',
      graphic: <SedanCarGraphic width={100} height={55} />,
    },
    {
      id: 'suv',
      title: 'SUV',
      capacity: '6 Seater',
      graphic: <SuvGraphic width={100} height={55} />,
    },
    {
      id: '7seater',
      title: '7 Seater',
      capacity: 'Comfortable',
      graphic: <Mpv7SeaterGraphic width={100} height={55} />,
    },
    {
      id: 'traveller',
      title: 'Traveller',
      capacity: '12 Seater',
      graphic: <TravellerGraphic width={100} height={55} />,
    },
  ];

  const citiesList = [
    'Patna Junction, Patna',
    'Bailey Road, Patna',
    'Kankarbagh, Patna',
    'Boring Road, Patna',
    'Patna Airport (PAT)',
    'Gaya Junction, Gaya',
    'Muzaffarpur City',
    'Bhagalpur Station',
    'Darbhanga Airport',
    'Connaught Place, New Delhi',
    'IGI Airport T3, New Delhi',
    'Sector 18, Noida',
    'Hazratganj, Lucknow',
    'Charbagh Station, Lucknow',
    'Varanasi Cantt, Varanasi',
    'Ranchi Main Road',
    'Bistupur, Jamshedpur',
    'Koramangala, Bengaluru',
    'Andheri East, Mumbai',
    'Salt Lake, Kolkata',
  ];

  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) {
      return citiesList;
    }
    const q = citySearchQuery.toLowerCase().trim();
    return citiesList.filter(city => city.toLowerCase().includes(q));
  }, [citySearchQuery, citiesList]);

  const mockDrivers = [
    {
      name: 'Ramesh Kumar',
      vehicle: 'Swift Dzire (White)',
      rating: '4.9 ⭐ (128 rides)',
      distance: '0.8 km away',
      price: '₹14 / km',
      verified: true,
    },
    {
      name: 'Amit Sharma',
      vehicle: 'Hyundai Aura (Silver)',
      rating: '4.8 ⭐ (94 rides)',
      distance: '1.4 km away',
      price: '₹13 / km',
      verified: true,
    },
    {
      name: 'Vikram Singh',
      vehicle: 'Honda Amaze (Grey)',
      rating: '4.9 ⭐ (210 rides)',
      distance: '2.1 km away',
      price: '₹15 / km',
      verified: true,
    },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => navigation.replace('PhoneLogin'),
      },
    ]);
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'Notifications',
      `You have 2 new driver inquiries near ${selectedCity}.`
    );
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setShowCityModal(false);
    setCitySearchQuery('');
  };

  const handleCustomCitySubmit = () => {
    if (citySearchQuery.trim().length > 0) {
      handleSelectCity(citySearchQuery.trim());
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Main Container */}
      <View className="flex-1 justify-between">
        {/* 1. Header Bar */}
        <View
          style={{
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          }}
          className="px-5 pt-3 pb-4 border-b"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              {/* Greeting */}
              <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold">
                {getGreeting()}
              </Text>

              {/* Location Selector Chip */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowCityModal(true)}
                className="flex-row items-center mt-1 flex-1"
              >
                <LocationMarkerIcon size={16} color={colors.primary} />
                <Text
                  numberOfLines={1}
                  style={{ color: colors.primary }}
                  className="text-base font-extrabold ml-1.5 mr-1 max-w-[220px]"
                >
                  {selectedCity}
                </Text>
                <ChevronDownIcon size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Notification Bell */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleNotificationPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="w-10 h-10 rounded-full border items-center justify-center"
            >
              <BellNotificationIcon size={20} color={colors.text} hasUnread={true} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Main Content Area */}
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View>
            {/* Section Title */}
            <Text
              style={{ color: colors.text }}
              className="text-lg font-extrabold tracking-tight mb-3.5"
            >
              What do you need today?
            </Text>

              {/* 2x2 Grid of Vehicle Categories */}
              <View className="flex-row flex-wrap -mx-1.5 mb-6">
                {vehicleCategories.map(cat => (
                  <View key={cat.id} className="w-1/2 p-1.5">
                    <VehicleCard
                      category={cat}
                      isSelected={selectedCategory === cat.id}
                      onSelect={id => {
                        setSelectedCategory(id);
                        const initialCatMap: Record<string, string> = {
                          car: 'car_5',
                          suv: 'scorpio',
                          '7seater': 'car_7',
                          traveller: 'mini_loader',
                        };
                        navigation.navigate('ChooseVehicle', {
                          selectedCity,
                          initialCategoryId: initialCatMap[id] || 'e_rickshaw',
                        });
                      }}
                    />
                  </View>
                ))}
              </View>

              {/* Primary Action Button: Find Nearby Vehicles */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  navigation.navigate('ChooseVehicle', {
                    selectedCity,
                    initialCategoryId: selectedCategory === 'car' ? 'car_5' : selectedCategory === 'suv' ? 'scorpio' : 'e_rickshaw',
                  });
                }}
                className="w-full bg-blue-600 py-4 px-6 rounded-xl flex-row items-center justify-center shadow-md shadow-blue-500 mb-6"
              >
                <Text className="text-white text-base font-bold tracking-wide mr-2">
                  Find Nearby Vehicles
                </Text>
                <ChevronRightIcon size={18} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Verified Drivers Info Banner */}
              <View
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
                className="p-4 rounded-xl border shadow-sm mb-4"
              >
                <View className="flex-row items-center mb-1.5">
                  <CheckCircleIcon size={16} color="#10B981" />
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-bold ml-2 uppercase tracking-wider"
                  >
                    Direct Marketplace Guarantee
                  </Text>
                </View>
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-xs leading-relaxed"
                >
                  Call & negotiate directly with vehicle owners. No surge pricing, hidden platform fees, or middlemen commission cuts.
                </Text>
              </View>
            </View>
        </ScrollView>
      </View>

      {/* Searchable Location Selector Modal */}
      <Modal
        visible={showCityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCityModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View
            style={{ backgroundColor: colors.card }}
            className="rounded-t-3xl p-6 max-h-[85%]"
          >
            {/* Modal Header */}
            <View
              style={{ borderBottomColor: colors.border }}
              className="flex-row items-center justify-between pb-3 border-b"
            >
              <View>
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-bold"
                >
                  Change Location
                </Text>
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-xs mt-0.5"
                >
                  Search city, landmark or type custom area
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowCityModal(false);
                  setCitySearchQuery('');
                }}
                style={{ backgroundColor: colors.surface }}
                className="p-1.5 rounded-full"
              >
                <Text style={{ color: colors.textSecondary }} className="font-bold text-sm">✕</Text>
              </TouchableOpacity>
            </View>

            {/* Live Search Input Bar */}
            <View
              style={{
                borderColor: colors.border,
                backgroundColor: colors.input,
              }}
              className="my-3 flex-row items-center border rounded-xl px-3.5 h-12"
            >
              <SearchIcon size={18} color={colors.textSecondary} />
              <TextInput
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
                placeholder="Search city, station, area..."
                placeholderTextColor={colors.placeholder}
                returnKeyType="search"
                onSubmitEditing={handleCustomCitySubmit}
                autoCorrect={false}
                style={{ color: colors.text }}
                className="flex-1 ml-2.5 text-sm font-semibold h-full p-0"
              />
              {citySearchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setCitySearchQuery('')}
                  className="p-1"
                >
                  <Text className="text-xs font-bold text-slate-400">✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Option: Use Current GPS Location */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDetectGpsLocation}
              disabled={isDetectingLocation}
              className="flex-row items-center p-3 mb-2 rounded-xl bg-blue-50 border border-blue-100"
            >
              <View className="w-8 h-8 rounded-full bg-blue-600 items-center justify-center mr-2.5">
                <LocationMarkerIcon size={16} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-blue-600">
                  {isDetectingLocation ? 'Detecting GPS Location...' : 'Use Current GPS Location'}
                </Text>
                <Text className="text-[11px] text-slate-500">
                  Detect via GPS & Google Maps Geocoding
                </Text>
              </View>
            </TouchableOpacity>

            {/* Custom Location Option if searched text */}
            {citySearchQuery.trim().length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCustomCitySubmit}
                className="flex-row items-center p-3 mb-2 rounded-xl bg-emerald-50 border border-emerald-200"
              >
                <CheckCircleIcon size={18} color="#059669" />
                <View className="ml-2.5 flex-1">
                  <Text className="text-xs font-bold text-emerald-800">
                    Use entered location: "{citySearchQuery.trim()}"
                  </Text>
                  <Text className="text-[10px] text-emerald-600">
                    Tap to set as your current pickup area
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Scrollable Results List */}
            <ScrollView
              className="mt-1"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {filteredCities.map((city, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => handleSelectCity(city)}
                  style={{
                    borderBottomColor: colors.border,
                    backgroundColor: selectedCity === city ? `${colors.primary}15` : 'transparent',
                  }}
                  className="flex-row items-center py-3.5 px-2 border-b rounded-lg"
                >
                  <LocationMarkerIcon
                    size={18}
                    color={selectedCity === city ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={{
                      color: selectedCity === city ? colors.primary : colors.text,
                    }}
                    className={`text-sm ml-3 flex-1 ${
                      selectedCity === city ? 'font-bold' : 'font-semibold'
                    }`}
                  >
                    {city}
                  </Text>
                  {selectedCity === city && (
                    <CheckCircleIcon size={16} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Nearby Drivers Modal */}
      <Modal
        visible={showDriverResultsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDriverResultsModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            style={{ backgroundColor: colors.card }}
            className="rounded-t-3xl p-6 max-h-[80%]"
          >
            <View
              style={{ borderBottomColor: colors.border }}
              className="flex-row items-center justify-between pb-3 border-b"
            >
              <View>
                <Text
                  style={{ color: colors.text }}
                  className="text-lg font-bold"
                >
                  Available Drivers Near You
                </Text>
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-xs"
                >
                  {selectedCity} • {selectedCategory.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDriverResultsModal(false)}
                style={{ backgroundColor: colors.surface }}
                className="p-1.5 rounded-full"
              >
                <Text style={{ color: colors.textSecondary }} className="font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
              {mockDrivers.map((driver, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="p-4 rounded-xl border mb-3"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View>
                      <Text
                        style={{ color: colors.text }}
                        className="text-base font-bold"
                      >
                        {driver.name}
                      </Text>
                      <Text
                        style={{ color: colors.primary }}
                        className="text-xs font-semibold"
                      >
                        {driver.vehicle}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text
                        style={{ color: colors.text }}
                        className="text-sm font-bold"
                      >
                        {driver.price}
                      </Text>
                      <Text
                        style={{ color: colors.placeholder }}
                        className="text-[11px]"
                      >
                        {driver.distance}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ borderTopColor: colors.border }}
                    className="flex-row items-center justify-between pt-2 border-t"
                  >
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-xs"
                    >
                      {driver.rating}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setShowDriverResultsModal(false);
                        Alert.alert(
                          'Calling Driver',
                          `Connecting you directly with ${driver.name} at no middleman commission.`
                        );
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 flex-row items-center"
                    >
                      <PhoneIcon size={14} color="#FFFFFF" />
                      <Text className="text-white text-xs font-bold ml-1.5">
                        Call Driver
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
