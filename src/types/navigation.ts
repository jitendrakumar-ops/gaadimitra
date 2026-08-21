import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { User } from './auth';

export type RootStackParamList = {
  Login: undefined;
  Home: {
    user?: User;
  };
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
