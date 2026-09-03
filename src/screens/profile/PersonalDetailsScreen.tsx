import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraBadgeIcon, CheckCircleIcon } from '../../assets/icons/Icons';
import { HeaderBar } from '../../components/common/HeaderBar';
import { useTheme } from '../../theme';

export const PersonalDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const [fullName, setFullName] = useState('Rahul Kumar');
  const [phoneNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rahul.kumar@example.com');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [city, setCity] = useState('Patna, Bihar');

  const handleSave = () => {
    Alert.alert('Success', 'Your personal details have been updated successfully.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Top Navigation Bar */}
      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title="Personal Details"
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Edit Section */}
          <View className="items-center mb-6">
            <View className="relative">
              <View
                style={{
                  borderColor: colors.primary,
                  backgroundColor: colors.surface,
                }}
                className="w-24 h-24 rounded-full overflow-hidden border-2"
              >
                <Image
                  source={require('../../assets/images/driver_rahul.jpg')}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Alert.alert('Update Photo', 'Choose from Gallery or Take a Photo')}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.card,
                }}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 items-center justify-center shadow-md"
              >
                <CameraBadgeIcon size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.primary }} className="text-xs font-bold mt-2">
              Change Profile Photo
            </Text>
          </View>

          {/* Form Fields Card */}
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
            className="p-5 rounded-xl border mb-6 space-y-4"
          >
            {/* Full Name */}
            <View className="mb-4">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-wider mb-1.5"
              >
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.placeholder}
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                className="border rounded-xl px-4 py-3 text-sm font-bold"
              />
            </View>

            {/* Phone Number (Verified) */}
            <View className="mb-4">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-wider mb-1.5"
              >
                Phone Number
              </Text>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="border rounded-xl px-4 py-3 flex-row items-center justify-between"
              >
                <Text style={{ color: colors.text }} className="text-sm font-bold">
                  {phoneNumber}
                </Text>
                <View className="flex-row items-center px-2 py-0.5 rounded-full bg-emerald-100">
                  <CheckCircleIcon size={12} color="#059669" />
                  <Text className="text-[10px] font-extrabold text-emerald-700 ml-1">
                    Verified
                  </Text>
                </View>
              </View>
            </View>

            {/* Email Address */}
            <View className="mb-4">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-wider mb-1.5"
              >
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={colors.placeholder}
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                className="border rounded-xl px-4 py-3 text-sm font-bold"
              />
            </View>

            {/* Gender Selector */}
            <View className="mb-4">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-wider mb-2"
              >
                Gender
              </Text>
              <View className="flex-row">
                {(['Male', 'Female', 'Other'] as const).map(g => (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.75}
                    onPress={() => setGender(g)}
                    style={{
                      backgroundColor: gender === g ? `${colors.primary}18` : colors.input,
                      borderColor: gender === g ? colors.primary : colors.border,
                    }}
                    className="flex-1 py-2.5 rounded-xl border items-center justify-center mr-2"
                  >
                    <Text
                      style={{
                        color: gender === g ? colors.primary : colors.text,
                      }}
                      className="text-sm font-bold"
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* City / State */}
            <View>
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs font-bold uppercase tracking-wider mb-1.5"
              >
                Primary City
              </Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Enter your city"
                placeholderTextColor={colors.placeholder}
                style={{
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.text,
                }}
                className="border rounded-xl px-4 py-3 text-sm font-bold"
              />
            </View>
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSave}
            style={{ backgroundColor: colors.primary }}
            className="w-full py-3.5 rounded-xl items-center justify-center shadow-sm"
          >
            <Text className="text-white font-bold text-base tracking-wide">
              Save Changes
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
