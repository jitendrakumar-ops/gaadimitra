import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { BookedRide, RideStatus, ridesService } from '../../services/rides';
import {
  PhoneIcon,
} from '../../assets/icons/Icons';
import { useTheme } from '../../theme';

interface MyRidesViewProps {
  onBookRidePress?: () => void;
}

export const MyRidesView: React.FC<MyRidesViewProps> = ({ onBookRidePress }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<'all' | RideStatus>('all');
  const [ridesList, setRidesList] = useState<BookedRide[]>(ridesService.getAllRides());

  const filterTabs: { key: 'all' | RideStatus; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: ridesList.length },
    { key: 'active', label: 'Active', count: ridesList.filter(r => r.status === 'active').length },
    { key: 'pending', label: 'Pending', count: ridesList.filter(r => r.status === 'pending').length },
    { key: 'completed', label: 'Completed', count: ridesList.filter(r => r.status === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: ridesList.filter(r => r.status === 'cancelled').length },
  ];

  const displayedRides = selectedFilter === 'all'
    ? ridesList
    : ridesList.filter(r => r.status === selectedFilter);

  const handleCallDriver = (ride: BookedRide) => {
    Alert.alert('Call Driver', `Calling ${ride.driver.name} at ${ride.driver.phone}...`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${ride.driver.phone}`).catch(() => {});
        },
      },
    ]);
  };

  const handleViewRideDetails = (ride: BookedRide) => {
    navigation.navigate('RideDetails', {
      driver: ride.driver,
      agreedFare: ride.agreedFare,
      tripInfo: ride.tripInfo,
      bookingId: ride.bookingId,
      status: ride.status.charAt(0).toUpperCase() + ride.status.slice(1),
    });
  };

  const handleRebook = (ride?: BookedRide) => {
    if (onBookRidePress) {
      onBookRidePress();
    } else {
      navigation.navigate('ChooseVehicle', {
        selectedCity: ride?.tripInfo.pickupLocation || 'Patna Junction, Patna',
      });
    }
  };

  const renderStatusBadge = (status: RideStatus) => {
    switch (status) {
      case 'active':
        return (
          <View className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5" />
            <Text className="text-[11px] font-bold text-blue-700">Active</Text>
          </View>
        );
      case 'pending':
        return (
          <View className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            <Text className="text-[11px] font-bold text-amber-700">Pending</Text>
          </View>
        );
      case 'completed':
        return (
          <View className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
            <Text className="text-[11px] font-bold text-emerald-700">Completed</Text>
          </View>
        );
      case 'cancelled':
        return (
          <View className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
            <Text className="text-[11px] font-bold text-red-700">Cancelled</Text>
          </View>
        );
    }
  };

  return (
    <View className="w-full">
      {/* 1. Filter Horizontal Tabs */}
      <View className="mb-3.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 2, flexDirection: 'row' }}
        >
          {filterTabs.map(tab => {
            const isSelected = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => setSelectedFilter(tab.key)}
                style={{
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
                className="h-9 px-3.5 mr-2 rounded-xl flex-row items-center border"
              >
                <Text
                  style={{
                    color: isSelected ? '#FFFFFF' : colors.text,
                  }}
                  className="text-xs font-bold"
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View
                    style={{
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.surface,
                    }}
                    className="ml-1.5 px-1.5 py-0.5 rounded-full"
                  >
                    <Text
                      style={{
                        color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      }}
                      className="text-[10px] font-extrabold"
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. List of Filtered Rides */}
      {displayedRides.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="rounded-xl border p-8 items-center justify-center my-3"
        >
          <View
            style={{ backgroundColor: colors.surface }}
            className="w-14 h-14 rounded-full items-center justify-center mb-3"
          >
            <Text className="text-2xl">🚗</Text>
          </View>
          <Text
            style={{ color: colors.text }}
            className="text-base font-extrabold mb-1"
          >
            No {selectedFilter !== 'all' ? selectedFilter : ''} rides found
          </Text>
          <Text
            style={{ color: colors.textSecondary }}
            className="text-xs text-center mb-5 leading-relaxed"
          >
            Your booked intercity and local rides will appear here in real time.
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleRebook()}
            style={{ backgroundColor: colors.primary }}
            className="px-6 py-3 rounded-xl"
          >
            <Text className="text-white text-xs font-extrabold">Book a New Ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="pb-4">
          {displayedRides.map(ride => (
            <TouchableOpacity
              key={ride.id}
              activeOpacity={0.7}
              onPress={() => handleViewRideDetails(ride)}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
              className="rounded-xl border p-4 mb-3.5"
            >
              {/* Card Header: Booking ID, Date & Status Badge */}
              <View
                style={{ borderBottomColor: colors.border }}
                className="flex-row items-center justify-between pb-3 border-b"
              >
                <View>
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-mono font-black"
                  >
                    {ride.bookingId}
                  </Text>
                  <Text
                    style={{ color: colors.textSecondary }}
                    className="text-[11px] font-semibold mt-0.5"
                  >
                    {ride.tripInfo.date} • {ride.tripInfo.pickupTime}
                  </Text>
                </View>

                {/* Fare & Status Badge */}
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{
                      color: colors.text,
                      borderRightColor: colors.border,
                    }}
                    className="text-base font-black border-r pr-2 mt-0.5 mr-2"
                  >
                    ₹{ride.agreedFare.toLocaleString('en-IN')}
                  </Text>
                  {renderStatusBadge(ride.status)}
                </View>
              </View>

              {/* Driver & Vehicle Row */}
              <View className="flex-row items-center justify-between my-3">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={require('../../assets/images/driver_rahul.jpg')}
                    style={{ borderColor: colors.border }}
                    className="w-11 h-11 rounded-full border"
                    resizeMode="cover"
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      style={{ color: colors.text }}
                      className="text-sm font-extrabold"
                    >
                      {ride.driver.name}
                    </Text>
                    <View className="flex-row items-center mt-0.5">
                      <Text className="text-xs font-bold text-amber-500 mr-1">★</Text>
                      <Text
                        style={{ color: colors.text }}
                        className="text-xs font-bold"
                      >
                        {ride.driver.rating}
                      </Text>
                      <Text
                        style={{ color: colors.textSecondary }}
                        className="text-xs font-semibold ml-2"
                      >
                        • {ride.driver.vehicleModel}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleCallDriver(ride)}
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    borderColor: `${colors.primary}40`,
                  }}
                  className="w-9 h-9 rounded-full border items-center justify-center ml-2"
                >
                  <PhoneIcon size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Route Timeline Box */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="rounded-xl p-3 border mb-1"
              >
                <View className="flex-row items-center mb-2">
                  <View
                    style={{ backgroundColor: colors.primary }}
                    className="w-2 h-2 rounded-full mr-2.5"
                  />
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-bold flex-1"
                    numberOfLines={1}
                  >
                    {ride.tripInfo.pickupLocation}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: colors.error }}
                    className="w-2 h-2 rounded-full mr-2.5"
                  />
                  <Text
                    style={{ color: colors.text }}
                    className="text-xs font-bold flex-1"
                    numberOfLines={1}
                  >
                    {ride.tripInfo.destination}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
