import React, { useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { SplashScreenNavigationProp } from '../../types/navigation';
import { SplashIllustration } from '../../components/illustrations/SplashIllustration';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleSkip = () => {
    navigation.replace('Onboarding');
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-600 justify-between">
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <TouchableOpacity
        activeOpacity={1}
        onPress={handleSkip}
        className="flex-1 justify-between py-12 px-6"
      >
        {/* Top Header / Brand Emblem */}
        <View className="items-center mt-12">
          {/* Circular Logo Emblem from Assets */}
          <View className="mb-4 w-20 h-20 rounded-full bg-white items-center justify-center overflow-hidden border-2 border-white/30">
            <Image
              source={require('../../assets/icons/logo.png')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* Brand Name */}
          <Text className="text-3xl font-extrabold text-white tracking-tight">
            Gaadimitra
          </Text>

          {/* Subtitle / Tagline */}
          <Text className="text-sm font-medium text-blue-100 text-center mt-2 leading-relaxed max-w-[240px]">
            Find a ride. Talk directly.{'\n'}Ride your way.
          </Text>
        </View>

        {/* Skyline & Driving Car Illustration */}
        <View className="items-center justify-center my-6">
          <SplashIllustration width={320} height={140} />
        </View>

        {/* Bottom Loading Indicator */}

      </TouchableOpacity>
    </SafeAreaView>
  );
};
