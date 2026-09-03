import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  VerifyOtpScreenNavigationProp,
  VerifyOtpScreenRouteProp,
} from '../../types/navigation';
import { HeaderBar } from '../../components/common/HeaderBar';
import { ShieldCheckBadgeIcon, AlertCircleIcon } from '../../assets/icons/Icons';
import { Button } from '../../components/common/Button';
import { OtpInput } from '../../components/common/OtpInput';
import { useTheme } from '../../theme';

export const VerifyOtpScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<VerifyOtpScreenNavigationProp>();
  const route = useRoute<VerifyOtpScreenRouteProp>();
  const rawPhone = route.params?.phoneNumber || '9876543210';
  const countryCode = route.params?.countryCode || '+91';

  // Format masked phone number: e.g. +91 98XXXXXX21
  const maskedPhone = `${countryCode} ${rawPhone.slice(0, 2)}XXXXXX${rawPhone.slice(-2)}`;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // Live countdown timer for OTP resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length < 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Mock API verification
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('LocationPermission', {
        phoneNumber: rawPhone,
      });
    }, 500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp('');
    setError(null);
    Alert.alert('OTP Sent', `A new 6-digit OTP has been sent to ${maskedPhone}`);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Header */}
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
            {/* Shield Check Badge */}
            <View className="items-center mt-4 mb-6">
              <ShieldCheckBadgeIcon size={72} />
            </View>

            {/* Header Text */}
            <View className="items-center mb-4">
              <Text style={{ color: colors.text }} className="text-2xl font-extrabold tracking-tight text-center">
                Verify your number
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm font-normal text-center mt-1.5 leading-relaxed">
                Enter the 6-digit OTP sent to{'\n'}
                <Text style={{ color: colors.text }} className="font-bold">{maskedPhone}</Text>
              </Text>
            </View>

            {/* 6-Digit OTP Box Inputs */}
            <OtpInput
              length={6}
              value={otp}
              onChangeOtp={val => {
                setOtp(val);
                if (error) setError(null);
              }}
              disabled={isLoading}
            />

            {/* Error Message */}
            {error && (
              <View className="flex-row items-center justify-center -mt-2 mb-4">
                <AlertCircleIcon size={14} color={colors.error} />
                <Text style={{ color: colors.error }} className="text-xs ml-1.5 font-medium">
                  {error}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="space-y-3 mt-2">
              {/* Primary Verify CTA */}
              <Button
                title="Verify & Continue"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading || otp.length < 6}
                onPress={handleVerify}
                className="w-full shadow-md"
              />

              {/* Resend OTP Button */}
              <View className="mt-3">
                <Button
                  title="Resend OTP"
                  variant="outline"
                  size="md"
                  disabled={timer > 0 || isLoading}
                  onPress={handleResend}
                  className="w-full"
                />
              </View>
              {/* Resend Timer Notice */}
              <View className="items-center justify-center py-4">
                {timer > 0 ? (
                  <Text style={{ color: colors.placeholder }} className="text-xs font-medium">
                    Resend in <Text style={{ color: colors.primary }} className="font-bold">{timer}s</Text>
                  </Text>
                ) : (
                  <Text style={{ color: colors.primary }} className="text-xs font-semibold">
                    Didn't receive code? Tap Resend OTP above
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
