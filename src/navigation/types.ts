import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Shop: undefined;
  Cart: undefined;
  Admin: undefined;
};

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
