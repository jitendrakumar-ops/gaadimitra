import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  NearbyDriversScreenNavigationProp,
  NearbyDriversScreenRouteProp,
  DriverInfo,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import {
  FilterIcon,
  ChevronDownIcon,
  StarIcon,
  PhoneIcon,
  DriverAvatarPortrait,
  LocationMarkerIcon,
  CheckCircleIcon,
  CarBadgeIcon,
} from '../../assets/icons/Icons';
import {
  getCityCoordinates,
  buildGoogleStaticMapUrl,
} from '../../utils/mapConfig';
import { useTheme } from '../../theme';

export const NearbyDriversScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NearbyDriversScreenNavigationProp>();
  const route = useRoute<NearbyDriversScreenRouteProp>();
  const categoryTitle = route.params?.categoryTitle || 'Cars';
  const selectedCity = route.params?.selectedCity || 'Patna Junction, Patna';

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [showRadiusModal, setShowRadiusModal] = useState<boolean>(false);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState<number>(0);
  const [isMapImageLoading, setIsMapImageLoading] = useState<boolean>(true);

  const radiusOptions = [
    { label: 'Within 2 km', value: 2 },
    { label: 'Within 5 km', value: 5 },
    { label: 'Within 10 km', value: 10 },
    { label: 'Within 25 km', value: 25 },
  ];

  // Base coordinates for selected location
  const centerCoords = useMemo(
    () => getCityCoordinates(selectedCity),
    [selectedCity]
  );

  const driversList: (DriverInfo & { lat: number; lng: number })[] = useMemo(() => [
    {
      id: 'drv_1',
      name: 'Rahul Kumar',
      phone: '+919876543210',
      avatarSeed: '1',
      avatarBg: '#EFF6FF',
      rating: '4.8',
      totalRides: 286,
      experienceYears: 5,
      distance: '1.2 km away',
      isVerified: true,
      vehicleModel: 'Maruti Dzire',
      vehicleType: categoryTitle,
      vehiclePlate: 'BR01AB1234',
      hasAc: true,
      seatingCapacity: '4 Seats',
      pricePerKm: '₹14 / km',
      lat: centerCoords.latitude + 0.007,
      lng: centerCoords.longitude + 0.008,
    },
    {
      id: 'drv_2',
      name: 'Amit Kumar',
      phone: '+919812345678',
      avatarSeed: '2',
      avatarBg: '#F1F5F9',
      rating: '4.6',
      totalRides: 194,
      experienceYears: 3,
      distance: '2.4 km away',
      isVerified: true,
      vehicleModel: 'WagonR',
      vehicleType: categoryTitle,
      vehiclePlate: 'BR01CD5678',
      hasAc: true,
      seatingCapacity: '4 Seats',
      pricePerKm: '₹12 / km',
      lat: centerCoords.latitude - 0.009,
      lng: centerCoords.longitude + 0.012,
    },
    {
      id: 'drv_3',
      name: 'Rakesh Kumar',
      phone: '+919834567890',
      avatarSeed: '3',
      avatarBg: '#ECFDF5',
      rating: '4.9',
      totalRides: 412,
      experienceYears: 7,
      distance: '3.1 km away',
      isVerified: true,
      vehicleModel: 'Ertiga',
      vehicleType: categoryTitle,
      vehiclePlate: 'BR01EF9012',
      hasAc: true,
      seatingCapacity: '6 Seats',
      pricePerKm: '₹16 / km',
      lat: centerCoords.latitude + 0.012,
      lng: centerCoords.longitude - 0.011,
    },
    {
      id: 'drv_4',
      name: 'Santosh Yadav',
      phone: '+919871122334',
      avatarSeed: '4',
      avatarBg: '#FEF3C7',
      rating: '4.7',
      totalRides: 156,
      experienceYears: 4,
      distance: '4.5 km away',
      isVerified: true,
      vehicleModel: 'Scorpio Classic',
      vehicleType: categoryTitle,
      vehiclePlate: 'BR01GH3456',
      hasAc: true,
      seatingCapacity: '7 Seats',
      pricePerKm: '₹18 / km',
      lat: centerCoords.latitude - 0.014,
      lng: centerCoords.longitude - 0.009,
    },
  ], [categoryTitle, centerCoords]);

  // Google Static Map URL using MAP_KEY
  const mapUrl = useMemo(() => {
    const zoomLevel = selectedRadius <= 2 ? 15 : selectedRadius <= 5 ? 14 : selectedRadius <= 10 ? 13 : 12;
    return buildGoogleStaticMapUrl(
      centerCoords,
      driversList.map((d, i) => ({
        latitude: d.lat,
        longitude: d.lng,
        label: `${i + 1}`,
      })),
      zoomLevel,
      600,
      400
    );
  }, [centerCoords, driversList, selectedRadius]);

  const handleCallDriver = (driver: DriverInfo) => {
    Alert.alert(
      `Call ${driver.name}`,
      `Do you want to place a direct phone call to ${driver.name} (${driver.phone})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call Now',
          onPress: () => {
            Linking.openURL(`tel:${driver.phone}`).catch(() => {
              Alert.alert('Phone Dialer', `Direct number: ${driver.phone}`);
            });
          },
        },
      ]
    );
  };

  const handleOpenProfile = (driver: DriverInfo) => {
    navigation.navigate('DriverProfile', {
      driver,
      selectedCity,
    });
  };

  const selectedDriver = driversList[selectedDriverIndex] || driversList[0];

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header Bar */}
      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title={categoryTitle}
        className="border-b"
        style={{ borderBottomColor: colors.border }}
        rightSlotClassName="w-auto"
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowRadiusModal(true)}
            className="flex-row items-center p-2 rounded-full"
          >
            <Text style={{ color: colors.text }} className="text-xs font-bold ml-1.5 mr-1">
              {selectedRadius} km
            </Text>
            <ChevronDownIcon size={14} color={colors.text} />
          </TouchableOpacity>
        }
      />

      {/* Main Content: List Mode */}
      {viewMode === 'list' ? (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          {driversList.map(driver => (
            <TouchableOpacity
              key={driver.id}
              activeOpacity={0.85}
              onPress={() => handleOpenProfile(driver)}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="rounded-xl p-4 mb-3 border"
            >
              {/* Top Row: Avatar, Name, Rating, Specs */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <DriverAvatarPortrait
                    size={48}
                    seed={driver.avatarSeed}
                    bg={driver.avatarBg}
                    showVerified={false}
                  />

                  <View className="ml-3 flex-1">
                    <Text
                      style={{ color: colors.text }}
                      className="text-base font-extrabold"
                    >
                      {driver.name}
                    </Text>
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-xs font-bold mt-0.5"
                    >
                      {driver.vehicleModel}
                    </Text>
                    <Text
                      style={{ color: colors.placeholder }}
                      className="text-[11px] font-semibold mt-0.5"
                    >
                      {driver.hasAc ? 'AC • ' : ''}
                      {driver.seatingCapacity}
                    </Text>
                  </View>
                </View>

                {/* Rating Badge */}
                <View className="flex-row items-center px-2 py-1 rounded-lg bg-amber-50 border border-amber-200">
                  <StarIcon size={14} color="#F59E0B" />
                  <Text className="text-xs font-bold text-amber-700 ml-1">
                    {driver.rating}
                  </Text>
                </View>
              </View>

              {/* Divider Line */}
              <View style={{ backgroundColor: colors.border }} className="h-[1px] mb-3" />

              {/* Bottom Row: Distance, Verified, and Call CTA */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-2.5">
                    <LocationMarkerIcon size={14} color={colors.textSecondary} />
                    <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold ml-1">
                      {driver.distance}
                    </Text>
                  </View>

                  <View className="flex-row items-center px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <CheckCircleIcon size={12} color="#10B981" />
                    <Text className="text-[10px] font-bold text-emerald-700 ml-1">
                      Verified
                    </Text>
                  </View>
                </View>

                {/* Call Driver Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCallDriver(driver)}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                  }}
                  className="flex-row items-center px-3.5 py-1.5 rounded-xl border"
                >
                  <PhoneIcon size={13} color={colors.primary} />
                  <Text style={{ color: colors.primary }} className="text-xs font-extrabold ml-1.5">
                    Call Driver
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        /* Live Satellite/Street Maps Mode */
        <View className="flex-1">
          {/* Map Container View */}
          <View className="flex-1 relative bg-slate-200 overflow-hidden">
            {/* Live Map Image */}
            <Image
              source={{ uri: mapUrl }}
              onLoadStart={() => setIsMapImageLoading(true)}
              onLoadEnd={() => setIsMapImageLoading(false)}
              onError={() => setIsMapImageLoading(false)}
              resizeMode="cover"
              className="w-full h-full"
            />

            {/* Map Loading Overlay */}
            {isMapImageLoading && (
              <View className="absolute inset-0 bg-white/85 items-center justify-center">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="text-xs font-bold text-slate-600 mt-2">
                  Loading Live Map...
                </Text>
              </View>
            )}

            {/* Center User Location Marker Overlay */}
            <View className="absolute top-3.5 left-3.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 flex-row items-center shadow-sm">
              <View className="w-2 h-2 rounded-full bg-blue-600 mr-1.5" />
              <Text className="text-xs font-bold text-slate-800">
                {selectedCity} (Center)
              </Text>
            </View>

            {/* Live Driver Interactive Overlay Pins */}
            {driversList.map((driver, idx) => {
              const pinPositions = [
                { top: '28%', left: '22%' },
                { top: '38%', right: '18%' },
                { bottom: '34%', left: '26%' },
                { bottom: '26%', right: '22%' },
              ][idx % 4];

              const isCurrent = selectedDriverIndex === idx;

              return (
                <TouchableOpacity
                  key={driver.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDriverIndex(idx)}
                  style={pinPositions as any}
                  className={`absolute px-2.5 py-1.5 rounded-xl border flex-row items-center ${
                    isCurrent
                      ? 'bg-blue-600 border-white shadow-md'
                      : 'bg-white border-blue-600 shadow-sm'
                  }`}
                >
                  <CarBadgeIcon
                    size={14}
                    color={isCurrent ? '#FFFFFF' : '#2563EB'}
                  />
                  <Text
                    className={`text-[11px] font-bold ml-1 ${
                      isCurrent ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    #{idx + 1} {driver.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Floating Active Driver Card on Map */}
          <View
            style={{
              backgroundColor: colors.card,
              borderTopColor: colors.border,
            }}
            className="p-4 border-t"
          >
            <View className="flex-row items-center justify-between mb-3.5">
              <View className="flex-row items-center flex-1">
                <DriverAvatarPortrait
                  size={46}
                  seed={selectedDriver.avatarSeed}
                  bg={selectedDriver.avatarBg}
                />
                <View className="ml-3 flex-1">
                  <Text
                    style={{ color: colors.text }}
                    className="text-base font-extrabold"
                  >
                    {selectedDriver.name}
                  </Text>
                  <Text
                    style={{ color: colors.textSecondary }}
                    className="text-xs font-bold mt-0.5"
                  >
                    {selectedDriver.vehicleModel}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  style={{ color: colors.primary }}
                  className="text-base font-black"
                >
                  {selectedDriver.pricePerKm}
                </Text>
                <Text
                  style={{ color: colors.placeholder }}
                  className="text-[11px] font-semibold"
                >
                  {selectedDriver.distance}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleOpenProfile(selectedDriver)}
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
                className="flex-1 py-3 rounded-xl border items-center justify-center mr-2"
              >
                <Text style={{ color: colors.text }} className="text-xs font-bold">
                  View Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleCallDriver(selectedDriver)}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 py-3 rounded-xl items-center justify-center flex-row ml-2"
              >
                <PhoneIcon size={14} color="#FFFFFF" />
                <Text className="text-xs font-extrabold text-white ml-1.5">
                  Call Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Radius Filter Modal */}
      <Modal
        visible={showRadiusModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRadiusModal(false)}
      >
        <View className="flex-1 justify-end bg-black/45">
          <View style={{ backgroundColor: colors.card }} className="rounded-t-3xl p-6">
            <View
              style={{ borderBottomColor: colors.border }}
              className="flex-row items-center justify-between pb-3 border-b"
            >
              <Text
                style={{ color: colors.text }}
                className="text-base font-extrabold"
              >
                Filter Search Distance
              </Text>
              <TouchableOpacity
                onPress={() => setShowRadiusModal(false)}
                className="p-1"
              >
                <Text style={{ color: colors.textSecondary }} className="text-base font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-3">
              {radiusOptions.map(opt => {
                const isSelected = selectedRadius === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedRadius(opt.value);
                      setShowRadiusModal(false);
                    }}
                    style={{
                      backgroundColor: isSelected ? `${colors.primary}18` : 'transparent',
                      borderColor: isSelected ? colors.primary : 'transparent',
                    }}
                    className="flex-row items-center justify-between py-3.5 px-3 rounded-xl mb-1.5 border"
                  >
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                      }}
                      className={`text-sm ${
                        isSelected ? 'font-bold' : 'font-semibold'
                      }`}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <CheckCircleIcon size={18} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
