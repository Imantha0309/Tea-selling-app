export const fontFamily = {
  serif: 'Fraunces_700Bold',
  serifMedium: 'Fraunces_500Medium',
  sans: 'WorkSans_400Regular',
  sansMedium: 'WorkSans_500Medium',
  sansSemiBold: 'WorkSans_600SemiBold',
  sansBold: 'WorkSans_700Bold',
  mono: 'JetBrainsMono_400Regular',
} as const;

export const typography = {
  wordmark: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heading: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 20,
    lineHeight: 26,
  },
  subheading: {
    fontFamily: fontFamily.sansBold,
    fontSize: 17,
    lineHeight: 22,
  },
  body: {
    fontFamily: fontFamily.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  bodySemiBold: {
    fontFamily: fontFamily.sansSemiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  captionMedium: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    lineHeight: 18,
  },
  small: {
    fontFamily: fontFamily.sans,
    fontSize: 11,
    lineHeight: 15,
  },
  smallBold: {
    fontFamily: fontFamily.sansBold,
    fontSize: 11,
    lineHeight: 15,
  },
  tag: {
    fontFamily: fontFamily.sansBold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.04,
  },
  button: {
    fontFamily: fontFamily.sansBold,
    fontSize: 15,
    lineHeight: 20,
  },
  price: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    lineHeight: 18,
  },
  priceLg: {
    fontFamily: fontFamily.mono,
    fontSize: 16,
    lineHeight: 22,
  },
  tagline: {
    fontFamily: fontFamily.mono,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.06,
  },
} as const;
