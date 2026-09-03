import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LocationPermissionNavigationProp } from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { LocationIllustration } from '../../components/illustrations/LocationIllustration';
import { Button } from '../../components/common/Button';
import {
  LocationMarkerIcon,
  SearchIcon,
  CheckCircleIcon,
} from '../../assets/icons/Icons';
import { detectCurrentLocationWithGps } from '../../utils/mapConfig';
import { useTheme } from '../../theme';

export const LocationPermissionScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<LocationPermissionNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allCities = [
    { name: 'Patna Junction, Patna', state: 'Bihar', isPopular: true },
    { name: 'Bailey Road, Patna', state: 'Bihar', isPopular: true },
    { name: 'Kankarbagh, Patna', state: 'Bihar', isPopular: true },
    { name: 'Boring Road, Patna', state: 'Bihar', isPopular: true },
    { name: 'Patna Airport (PAT)', state: 'Bihar', isPopular: true },
    { name: 'Gaya Junction, Gaya', state: 'Bihar' },
    { name: 'Muzaffarpur City', state: 'Bihar' },
    { name: 'Bhagalpur Station', state: 'Bihar' },
    { name: 'Darbhanga Airport', state: 'Bihar' },
    { name: 'Connaught Place, New Delhi', state: 'Delhi NCR', isPopular: true },
    { name: 'IGI Airport T3, New Delhi', state: 'Delhi NCR' },
    { name: 'Sector 18, Noida', state: 'Uttar Pradesh', isPopular: true },
    { name: 'Hazratganj, Lucknow', state: 'Uttar Pradesh', isPopular: true },
    { name: 'Charbagh Station, Lucknow', state: 'Uttar Pradesh' },
    { name: 'Varanasi Cantt, Varanasi', state: 'Uttar Pradesh' },
    { name: 'Ranchi Main Road', state: 'Jharkhand' },
    { name: 'Bistupur, Jamshedpur', state: 'Jharkhand' },
    { name: 'Koramangala, Bengaluru', state: 'Karnataka' },
    { name: 'Andheri East, Mumbai', state: 'Maharashtra' },
    { name: 'Salt Lake, Kolkata', state: 'West Bengal' },
  ];

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCities;
    }
    const query = searchQuery.toLowerCase().trim();
    return allCities.filter(
      city =>
        city.name.toLowerCase().includes(query) ||
        city.state.toLowerCase().includes(query)
    );
  }, [searchQuery, allCities]);

  const handleAllowLocation = async () => {
    setIsLoading(true);
    try {
      const geoResult = await detectCurrentLocationWithGps();
      setIsLoading(false);
      navigation.replace('HomeDashboard', {
        selectedCity: geoResult.shortLocation,
      });
    } catch (error) {
      setIsLoading(false);
      navigation.replace('HomeDashboard', {
        selectedCity: 'Patna Junction, Patna',
      });
    }
  };

  const handleSelectCity = (cityName: string) => {
    setIsModalVisible(false);
    setSearchQuery('');
    navigation.replace('HomeDashboard', {
      selectedCity: cityName,
    });
  };

  const handleCustomCitySubmit = () => {
    if (searchQuery.trim().length > 0) {
      handleSelectCity(searchQuery.trim());
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-between">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Header with Back Navigation */}
      <HeaderBar onBackPress={() => navigation.goBack()} />

      {/* Middle Illustration & Text */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 items-center justify-center">
          <Image
            source={require('../../assets/images/4th.png')}
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
        </View>

        <Text style={{ color: colors.text }} className="text-2xl font-extrabold tracking-tight text-center">
          Find vehicles near you
        </Text>

        <Text style={{ color: colors.textSecondary }} className="text-sm font-normal text-center mt-2.5 leading-relaxed max-w-[280px]">
          Allow location access to see available drivers around your current location.
        </Text>
      </View>

      {/* Bottom CTAs */}
      <View className="px-6 pb-8 space-y-3">
        <Button
          title={isLoading ? "Detecting GPS Location..." : "Allow Location"}
          variant="primary"
          size="lg"
          loading={isLoading}
          disabled={isLoading}
          onPress={handleAllowLocation}
          className="w-full"
        />

        <View className="mt-3">
          <Button
            title="Choose Location Manually"
            variant="outline"
            size="lg"
            disabled={isLoading}
            onPress={() => setIsModalVisible(true)}
            className="w-full"
          />
        </View>
      </View>

      {/* Searchable Manual City Selector Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-black/50"
        >
          <View style={{ backgroundColor: colors.card }} className="rounded-t-3xl p-6 max-h-[85%]">
            {/* Modal Header */}
            <View
              style={{ borderBottomColor: colors.border }}
              className="flex-row items-center justify-between pb-3 border-b"
            >
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-bold">
                  Select Your City / Pickup
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs mt-0.5">
                  Search by city name, area, or landmark
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setSearchQuery('');
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
              <SearchIcon size={18} color={colors.placeholder} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search city, station, airport, area..."
                placeholderTextColor={colors.placeholder}
                returnKeyType="search"
                onSubmitEditing={handleCustomCitySubmit}
                autoCorrect={false}
                style={{ color: colors.text }}
                className="flex-1 ml-2.5 text-sm font-semibold h-full p-0"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  className="p-1"
                >
                  <Text style={{ color: colors.placeholder }} className="text-xs font-bold">✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quick Option: Use Current Location */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleAllowLocation}
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
                  Use Current GPS Location
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-[11px]">
                  Detect via GPS & Google Geocoding
                </Text>
              </View>
            </TouchableOpacity>

            {/* Custom Location Option if searched text has no exact match */}
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCustomCitySubmit}
                className="flex-row items-center p-3 mb-2 rounded-xl bg-emerald-50 border border-emerald-200"
              >
                <CheckCircleIcon size={18} color="#059669" />
                <View className="ml-2.5 flex-1">
                  <Text className="text-xs font-bold text-emerald-800">
                    Use entered location: "{searchQuery.trim()}"
                  </Text>
                  <Text className="text-[10px] text-emerald-600">
                    Tap to select this custom pickup area
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
                  onPress={() => handleSelectCity(city.name)}
                  style={{ borderBottomColor: colors.border }}
                  className="flex-row items-center py-3.5 px-2 border-b"
                >
                  <LocationMarkerIcon size={18} color={colors.primary} />
                  <View className="ml-3 flex-1">
                    <Text style={{ color: colors.text }} className="text-sm font-bold">
                      {city.name}
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="text-xs">{city.state}</Text>
                  </View>
                  {city.isPopular && !searchQuery && (
                    <View style={{ backgroundColor: colors.surface }} className="px-2 py-0.5 rounded-full">
                      <Text style={{ color: colors.textSecondary }} className="text-[10px] font-semibold">
                        Popular
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {filteredCities.length === 0 && searchQuery.trim().length === 0 && (
                <View className="items-center py-8">
                  <Text style={{ color: colors.placeholder }} className="text-xs">
                    No matching cities found. Type above to enter custom location.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
