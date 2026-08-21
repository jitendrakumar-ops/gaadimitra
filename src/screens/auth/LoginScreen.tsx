import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../../types/navigation';
import { useLoginForm } from '../../hooks/useLoginForm';
import { Logo } from '../../components/common/Logo';
import { PhoneInput } from '../../components/common/PhoneInput';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialButton } from '../../components/common/SocialButton';
import { Divider } from '../../components/common/Divider';
import { LockIcon, EyeIcon, EyeOffIcon } from '../../assets/icons/Icons';
import { AuthResponse } from '../../types/auth';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLoginSuccess = (response: AuthResponse) => {
    // Navigate from Login -> Home upon successful mock authentication
    navigation.replace('Home', { user: response.user });
  };

  const handleLoginError = (errorMessage: string) => {
    Alert.alert('Authentication Failed', errorMessage);
  };

  const {
    phoneNumber,
    password,
    isPasswordVisible,
    errors,
    isLoading,
    handlePhoneChange,
    handlePasswordChange,
    togglePasswordVisibility,
    handleSubmit,
    handleSocialLogin,
  } = useLoginForm({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  });

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Password reset instructions will be sent via SMS to your registered mobile number.',
      [{ text: 'OK' }]
    );
  };

  const handleRegisterPress = () => {
    Alert.alert(
      'Create Account',
      'Registration flow will be available in the upcoming release.',
      [{ text: 'Understood' }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 16,
            justifyContent: 'space-between',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* 1. App Logo / Brand Header */}
            <Logo size="lg" showSubtitle={true} />

            {/* 2. Welcome Section */}
            <View className="mt-2 mb-6">
              <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back 👋
              </Text>
              <Text className="text-sm text-slate-500 font-normal mt-1">
                Login to continue to your account and explore verified vehicles.
              </Text>
            </View>

            {/* General Server/Validation Error Banner */}
            {errors.general && (
              <View className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200">
                <Text className="text-xs text-red-600 font-medium text-center">
                  {errors.general}
                </Text>
              </View>
            )}

            {/* Form Section */}
            <View className="w-full">
              {/* 3. Phone Number Input */}
              <PhoneInput
                label="Mobile Number"
                countryCode="+91"
                placeholder="98765 43210"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                error={errors.phoneNumber}
                disabled={isLoading}
              />

              {/* 4. Password Input */}
              <Input
                label="Password"
                placeholder="Enter your account password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!isPasswordVisible}
                error={errors.password}
                disabled={isLoading}
                leftIcon={<LockIcon size={18} color="#94A3B8" />}
                rightIcon={
                  isPasswordVisible ? (
                    <EyeOffIcon size={20} color="#64748B" />
                  ) : (
                    <EyeIcon size={20} color="#64748B" />
                  )
                }
                onRightIconPress={togglePasswordVisibility}
              />

              {/* 5. Forgot Password */}
              <View className="flex-row justify-end -mt-2 mb-5">
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleForgotPassword}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-xs font-semibold text-blue-600">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 6. Primary CTA: Login Button */}
              <Button
                title="Login"
                variant="primary"
                size="lg"
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                className="w-full shadow-md shadow-blue-500"
              />
            </View>

            {/* 7. Divider */}
            <Divider label="OR" />

            {/* 8. Social Login */}
            <View className="w-full">
              <SocialButton
                provider="google"
                disabled={isLoading}
                onPress={() => handleSocialLogin('google')}
              />

              {Platform.OS === 'ios' && (
                <SocialButton
                  provider="apple"
                  disabled={isLoading}
                  onPress={() => handleSocialLogin('apple')}
                />
              )}
            </View>
          </View>

          {/* 9. Register Section / Footer */}
          <View className="py-6 items-center justify-center">
            <View className="flex-row items-center">
              <Text className="text-sm text-slate-500 font-normal">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleRegisterPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-sm font-bold text-blue-600">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms / Privacy badge */}
            <Text className="text-[11px] text-slate-400 text-center mt-3">
              By logging in, you agree to GaadiMitra's Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
