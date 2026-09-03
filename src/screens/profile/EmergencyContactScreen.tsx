import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ShieldSafetyIcon,
  HeartFilledIcon,
} from '../../assets/icons/Icons';
import { HeaderBar } from '../../components/common/HeaderBar';
import { useTheme } from '../../theme';

export const EmergencyContactScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const [contactName, setContactName] = useState('Pooja Kumar');
  const [relation, setRelation] = useState('Sister');
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 00000');
  const [autoShareRide, setAutoShareRide] = useState(true);

  const handleSaveContact = () => {
    Alert.alert('Contact Saved', 'Your emergency SOS contact has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleTestCall = () => {
    Alert.alert('Test Emergency Call', `Calling ${contactName} (${phoneNumber})...`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call Now',
        onPress: () => {
          Linking.openURL(`tel:${phoneNumber.replace(/\s+/g, '')}`).catch(() => {});
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <HeaderBar
        onBackPress={() => navigation.goBack()}
        title="Emergency Contact"
        className="border-b"
        style={{ borderBottomColor: colors.border }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Safety SOS Banner */}
        <View className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-5 flex-row items-start">
          <View className="w-10 h-10 rounded-xl bg-rose-100 items-center justify-center mr-3 mt-0.5">
            <ShieldSafetyIcon size={20} color="#E11D48" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-extrabold text-rose-900">
              24x7 Safety & SOS Protection
            </Text>
            <Text className="text-xs font-medium text-rose-700 mt-1 leading-relaxed">
              In case of emergency during your ride, an instant alert with your live GPS location will be sent to your contact.
            </Text>
          </View>
        </View>

        {/* Contact Form Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="p-5 rounded-xl border mb-5 space-y-4"
        >
          <View
            style={{ borderBottomColor: colors.border }}
            className="flex-row items-center justify-between pb-2 border-b"
          >
            <View className="flex-row items-center">
              <HeartFilledIcon size={18} color="#E11D48" />
              <Text style={{ color: colors.text }} className="text-sm font-black ml-2">
                Primary Contact
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={handleTestCall}>
              <Text style={{ color: colors.primary }} className="text-xs font-extrabold">
                Test Call
              </Text>
            </TouchableOpacity>
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Contact Name
            </Text>
            <TextInput
              value={contactName}
              onChangeText={setContactName}
              placeholder="e.g. Brother, Parent, Friend"
              placeholderTextColor={colors.placeholder}
              style={{
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              }}
              className="border rounded-xl px-4 py-3 text-sm font-bold"
            />
          </View>

          {/* Relation */}
          <View className="mb-4">
            <Text
              style={{ color: colors.textSecondary }}
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Relationship
            </Text>
            <TextInput
              value={relation}
              onChangeText={setRelation}
              placeholder="e.g. Sister, Spouse"
              placeholderTextColor={colors.placeholder}
              style={{
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              }}
              className="border rounded-xl px-4 py-3 text-sm font-bold"
            />
          </View>

          {/* Phone Number */}
          <View>
            <Text
              style={{ color: colors.textSecondary }}
              className="text-xs font-bold uppercase tracking-wider mb-1.5"
            >
              Phone Number
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="+91 XXXXX XXXXX"
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

        {/* Preferences Toggle Card */}
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
          className="p-4 rounded-xl border mb-6 flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <Text style={{ color: colors.text }} className="text-xs font-bold">
              Auto-share Intercity Rides
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-[11px] mt-0.5">
              Automatically send live tracking link when a long trip starts
            </Text>
          </View>
          <Switch
            value={autoShareRide}
            onValueChange={setAutoShareRide}
            trackColor={{ false: colors.border, true: `${colors.primary}50` }}
            thumbColor={autoShareRide ? colors.primary : colors.placeholder}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveContact}
          style={{ backgroundColor: colors.primary }}
          className="w-full py-4 px-6 rounded-xl items-center justify-center shadow-md"
        >
          <Text className="text-white text-base font-extrabold tracking-wide">
            Save Emergency Contact
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
