import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PhoneLoginScreenNavigationProp } from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import {
  PhoneDeviceIcon,
  IndiaFlagIcon,
  LockIcon,
  AlertCircleIcon,
} from '../../assets/icons/Icons';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../theme';

export const PhoneLoginScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<PhoneLoginScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (text: string) => {
    const numeric = text.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(numeric);
    if (error) {
      setError(null);
    }
  };

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('VerifyOtp', {
        phoneNumber,
        countryCode: '+91',
      });
    }, 400);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Header with Back Navigation */}
      <HeaderBar onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 24,
            justifyContent: 'space-between',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {/* Top Device Icon Badge */}
            <View className="items-center mt-4 mb-6">
              <PhoneDeviceIcon size={72} />
            </View>

            {/* Header Text */}
            <View className="items-center mb-8">
              <Text style={{ color: colors.text }} className="text-2xl font-extrabold tracking-tight text-center">
                Welcome
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm font-normal text-center mt-1.5">
                Enter your mobile number to continue.
              </Text>
            </View>

            {/* Combined Phone Number Input Field */}
            <View className="w-full">
              <View
                style={{
                  borderColor: error ? colors.error : isFocused ? colors.primary : colors.border,
                  backgroundColor: error ? `${colors.error}15` : isFocused ? colors.card : colors.input,
                }}
                className="flex-row items-center border rounded-xl h-14 overflow-hidden"
              >
                {/* Country Code Pill */}
                <View
                  style={{
                    borderRightColor: colors.border,
                    backgroundColor: colors.surface,
                  }}
                  className="flex-row items-center px-3.5 h-full border-r"
                >
                  <IndiaFlagIcon size={20} />
                  <Text style={{ color: colors.text }} className="text-sm font-bold ml-2">
                    +91
                  </Text>
                </View>

                {/* Input Field */}
                <TextInput
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Enter mobile number"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={{ color: colors.text }}
                  className="flex-1 px-4 text-base font-semibold h-full"
                />
              </View>

              {/* Error Message */}
              {error && (
                <View className="flex-row items-center mt-2 ml-1">
                  <AlertCircleIcon size={14} color={colors.error} />
                  <Text style={{ color: colors.error }} className="text-xs ml-1.5 font-medium">
                    {error}
                  </Text>
                </View>
              )}

              {/* Primary Action Button */}
              <View className="mt-6">
                <Button
                  title="Continue"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading || phoneNumber.length < 10}
                  onPress={handleContinue}
                  className="w-full shadow-md"
                />
              </View>
            </View>
          </View>

          {/* Footer Terms Notice */}
          <View className="items-center justify-center py-4 flex-row">
            <LockIcon size={14} color={colors.placeholder} />
            <Text style={{ color: colors.textSecondary }} className="text-xs ml-1.5 text-center">
              By continuing, you agree to our{' '}
              <Text
                onPress={() => navigation.navigate('TermsAndConditions')}
                style={{ color: colors.primary }}
                className="font-semibold underline"
              >
                Terms & Privacy Policy
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
