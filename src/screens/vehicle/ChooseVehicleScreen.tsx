import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ChooseVehicleScreenNavigationProp,
  ChooseVehicleScreenRouteProp,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import {
  ERickshawGraphic,
  ERickshawLoaderGraphic,
  ScorpioGraphic,
  BoleroGraphic,
  Car5SeaterGraphic,
  Car7SeaterGraphic,
  BoleroPickupGraphic,
  MiniLoaderGraphic,
  CheckCircleIcon,
} from '../../assets/icons/Icons';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../theme';

interface VehicleOption {
  id: string;
  title: string;
  capacity: string;
  graphic: React.ReactNode;
}

export const ChooseVehicleScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<ChooseVehicleScreenNavigationProp>();
  const route = useRoute<ChooseVehicleScreenRouteProp>();
  const selectedCity = route.params?.selectedCity || 'Patna Junction, Patna';
  const initialCat = route.params?.initialCategoryId || 'e_rickshaw';

  const [selectedId, setSelectedId] = useState<string>(initialCat);

  const vehicleOptions: VehicleOption[] = [
    {
      id: 'e_rickshaw',
      title: 'E-Rickshaw',
      capacity: '4 Passengers',
      graphic: <ERickshawGraphic width={80} height={48} />,
    },
    {
      id: 'e_loader',
      title: 'E-Rickshaw Loader',
      capacity: 'Up to 400 KG',
      graphic: <ERickshawLoaderGraphic width={80} height={48} />,
    },
    {
      id: 'scorpio',
      title: 'Scorpio / SUV',
      capacity: '7 Passengers',
      graphic: <ScorpioGraphic width={80} height={48} />,
    },
    {
      id: 'bolero',
      title: 'Bolero',
      capacity: '7-9 Passengers',
      graphic: <BoleroGraphic width={80} height={48} />,
    },
    {
      id: 'car_5',
      title: 'Sedan / Hatchback',
      capacity: '4-5 Passengers',
      graphic: <Car5SeaterGraphic width={80} height={48} />,
    },
    {
      id: 'car_7',
      title: '7 Seater MPV',
      capacity: '6-7 Passengers',
      graphic: <Car7SeaterGraphic width={80} height={48} />,
    },
    {
      id: 'bolero_pickup',
      title: 'Bolero Pickup',
      capacity: 'Up to 1.7 Tonne',
      graphic: <BoleroPickupGraphic width={80} height={48} />,
    },
    {
      id: 'mini_loader',
      title: 'Tata Ace / Mini',
      capacity: 'Up to 750 KG',
      graphic: <MiniLoaderGraphic width={80} height={48} />,
    },
  ];

  const handleProceed = () => {
    const currentOption = vehicleOptions.find(v => v.id === selectedId);
    navigation.navigate('NearbyDrivers', {
      categoryId: selectedId,
      categoryTitle: currentOption?.title || 'Cars',
      selectedCity,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-between">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title="Choose Vehicle"
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      {/* Main Body */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* 2-Column Grid */}
        <View className="flex-row flex-wrap -mx-1.5">
          {vehicleOptions.map(option => {
            const isSelected = selectedId === option.id;
            return (
              <View key={option.id} className="w-1/2 p-1.5">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedId(option.id);
                  }}
                  style={{
                    backgroundColor: isSelected ? `${colors.primary}18` : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  }}
                  className="rounded-xl p-4 items-center justify-between min-h-[148px] relative shadow-sm"
                >
                  {/* Top-Right Checkmark Badge when Selected */}
                  {isSelected && (
                    <View className="absolute top-2.5 right-2.5">
                      <CheckCircleIcon size={18} color={colors.primary} />
                    </View>
                  )}

                  {/* Vehicle Vector Graphic */}
                  <View className="h-16 items-center justify-center my-1">
                    {option.graphic}
                  </View>

                  {/* Title & Capacity */}
                  <View className="items-center mt-1">
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                      }}
                      className="text-sm font-bold text-center"
                    >
                      {option.title}
                    </Text>
                    <Text
                      style={{ color: colors.textSecondary }}
                      className="text-xs font-medium mt-0.5 text-center"
                    >
                      {option.capacity}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Button */}
      <View
        style={{
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        }}
        className="p-5 border-t"
      >
        <Button
          title="Find Nearby Vehicles"
          variant="primary"
          size="lg"
          onPress={() => handleProceed()}
          className="w-full shadow-md"
        />
      </View>
    </SafeAreaView>
  );
};
