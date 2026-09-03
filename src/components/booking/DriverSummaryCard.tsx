import React from 'react';
import { View, Text } from 'react-native';
import { DriverInfo } from '../../types/navigation';
import {
  DriverAvatarPortrait,
  CheckCircleIcon,
  Car5SeaterGraphic,
} from '../../assets/icons/Icons';
import { useTheme } from '../../theme';

interface DriverSummaryCardProps {
  driver?: DriverInfo;
  className?: string;
}

export const DriverSummaryCard: React.FC<DriverSummaryCardProps> = ({
  driver = {
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
  },
  className = '',
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      className={`p-4 rounded-xl border shadow-sm flex-row items-center justify-between ${className}`}
    >
      {/* Left side: Avatar + Driver Info */}
      <View className="flex-row items-center flex-1 pr-2">
        <View className="mr-3">
          <DriverAvatarPortrait
            size={52}
            seed={driver.avatarSeed || '1'}
            bg={driver.avatarBg || '#EFF6FF'}
            showVerified={false}
          />
        </View>

        <View className="flex-1">
          {/* Driver Name */}
          <Text
            style={{ color: colors.text }}
            className="text-base font-extrabold leading-tight"
          >
            {driver.name}
          </Text>

          {/* Vehicle Model */}
          <Text
            style={{ color: colors.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            {driver.vehicleModel}
          </Text>

          {/* Verified Badge */}
          {driver.isVerified && (
            <View className="flex-row items-center mt-1">
              <CheckCircleIcon size={12} color="#10B981" />
              <Text className="text-[11px] font-bold text-emerald-600 ml-1">
                Verified Driver
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Right side: Car Graphic + License Plate */}
      <View className="items-center justify-center">
        <View className="w-24 h-12 items-center justify-center">
          <Car5SeaterGraphic width={90} height={46} />
        </View>
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
          className="mt-1 px-2 py-0.5 rounded-md border"
        >
          <Text
            style={{ color: colors.text }}
            className="text-[10px] font-mono font-bold uppercase tracking-wider"
          >
            {driver.vehiclePlate || 'BR01AB1234'}
          </Text>
        </View>
      </View>
    </View>
  );
};
