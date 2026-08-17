import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const BASE_WIDTH = 390;
export const BASE_HEIGHT = 844;

export const scale = (size: number): number => (screenWidth / BASE_WIDTH) * size;
export const verticalScale = (size: number): number => (screenHeight / BASE_HEIGHT) * size;

export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

export const sp = moderateScale;
