import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

export interface VehicleCategory {
  id: string;
  title: string;
  capacity: string;
  graphic: React.ReactNode;
}

interface VehicleCardProps {
  category: VehicleCategory;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  category,
  isSelected,
  onSelect,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect(category.id)}
      style={{
        backgroundColor: isSelected ? `${colors.primary}18` : colors.card,
        borderColor: isSelected ? colors.primary : colors.border,
        borderWidth: isSelected ? 2 : 1,
      }}
      className="flex-1 rounded-xl p-4 items-center justify-between min-h-[148px] m-1.5 shadow-sm"
    >
      {/* Vehicle Vector / Image Graphic */}
      <View className="h-16 items-center justify-center my-1">
        {category.graphic}
      </View>

      {/* Category Info */}
      <View className="items-center mt-2">
        <Text
          style={{ color: colors.text }}
          className="text-base font-bold"
        >
          {category.title}
        </Text>
        <Text
          style={{ color: colors.textSecondary }}
          className="text-xs font-medium mt-0.5"
        >
          {category.capacity}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
