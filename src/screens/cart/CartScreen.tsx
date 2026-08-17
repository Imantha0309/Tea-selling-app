import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context';
import { useToast } from '@/components/Toast';
import { BottomSheet } from '@/components/BottomSheet';
import { colors, fontFamily, radius, shadows, spacing } from '@/theme';
import { Tea } from '@/types';

function lighten(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + 40);
  const g = Math.min(255, ((n >> 8) & 255) + 40);
  const b = Math.min(255, (n & 255) + 40);
  return `rgb(${r},${g},${b})`;
}

export function CartScreen() {
  const insets = useSafeAreaInsets();
  const { teas, cart, increment, decrement, removeItem, subtotal, shipping, total, cartCount, clearCart } = useCart();
  const { showToast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNum, setOrderNum] = useState('');

  const cartIds = Object.keys(cart).filter((id) => cart[id] > 0);
  const cartItems = cartIds
    .map((id) => {
      const tea = teas.find((t) => t.id === id);
      return tea ? { tea, qty: cart[id] } : null;
    })
    .filter(Boolean) as { tea: Tea; qty: number }[];

  const placeOrder = () => {
    const num = 'STC-' + Math.floor(10000 + Math.random() * 89999);
    setOrderNum(num);
    setOrderPlaced(true);
  };

  const finishOrder = () => {
    clearCart();
    setOrderPlaced(false);
    setOrderNum('');
  };

  // Order success sheet
  if (orderPlaced) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <BottomSheet visible={true} onClose={finishOrder}>
          <View style={styles.orderSuccess}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={30} color={colors.paper} />
            </View>
            <Text style={styles.successTitle}>Order placed</Text>
            <Text style={styles.orderNum}>{orderNum}</Text>
            <Text style={styles.successText}>
              This is a demo order — no payment was charged.{'\n'}Your tea would ship in 2–3 business days.
            </Text>
            <Pressable style={styles.btnPrimary} onPress={finishOrder}>
              <Text style={styles.btnPrimaryText}>Back to shop</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </View>
    );
  }

  if (cartIds.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.brand}>
          <Text style={styles.wordmark}>Your Cart</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyGlyph}>&#61970;</Text>
          <Text style={styles.emptyTitle}>Cart's empty</Text>
          <Text style={styles.emptyText}>
            Nothing steeping yet.{'\n'}Go pick a few leaves from the shop.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <Text style={styles.wordmark}>Your Cart</Text>
        </View>
        <Text style={styles.tagline}>
          {cartIds.length} tea{cartIds.length > 1 ? 's' : ''} selected
        </Text>

        {cartItems.map(({ tea, qty }) => (
          <View key={tea.id} style={styles.cartRow}>
            <View
              style={[styles.liquor, { backgroundColor: tea.liquorColor }]}
            >
              <View
                style={[
                  styles.liquorHighlight,
                  { backgroundColor: lighten(tea.liquorColor) },
                ]}
              />
            </View>
            <View style={styles.cartRowInfo}>
              <Text style={styles.cartRowName}>{tea.name}</Text>
              <Text style={styles.cartRowPrice}>
                ${tea.price.toFixed(2)} each
              </Text>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => decrement(tea.id)}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepperValue}>{qty}</Text>
                <Pressable
                  style={styles.stepperBtn}
                  onPress={() => increment(tea.id)}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.cartRowRight}>
              <Text style={styles.cartRowTotal}>
                ${(tea.price * qty).toFixed(2)}
              </Text>
              <Pressable onPress={() => removeItem(tea.id)}>
                <Text style={styles.removeText}>remove</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.btnGold} onPress={placeOrder}>
            <Text style={styles.btnGoldText}>Place order</Text>
          </Pressable>
          <Text style={styles.hint}>Demo checkout — no payment is processed.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  brand: {
    marginTop: 10,
    marginBottom: 2,
  },
  wordmark: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 28,
    letterSpacing: -0.5,
    color: colors.mossDark,
  },
  tagline: {
    fontSize: 11,
    fontFamily: fontFamily.mono,
    color: colors.moss,
    letterSpacing: 0.06,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyGlyph: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 44,
    color: colors.mist,
    marginBottom: 10,
  },
  emptyTitle: {
    fontFamily: fontFamily.serifMedium,
    color: colors.mossDark,
    fontSize: 18,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#7C8A7D',
    textAlign: 'center',
    lineHeight: 20,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  liquor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: 'rgba(30,42,34,0.15)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liquorHighlight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    opacity: 0.5,
    position: 'absolute',
    top: 5,
    left: 5,
  },
  cartRowInfo: {
    flex: 1,
  },
  cartRowName: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.ink,
  },
  cartRowPrice: {
    fontFamily: fontFamily.mono,
    fontSize: 12,
    color: colors.clay,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.mist,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 15,
    color: colors.mossDark,
  },
  stepperValue: {
    fontFamily: fontFamily.mono,
    fontWeight: '500',
    fontSize: 14,
    minWidth: 18,
    textAlign: 'center',
  },
  cartRowRight: {
    alignItems: 'flex-end',
  },
  cartRowTotal: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    fontWeight: '500',
    color: colors.clay,
  },
  removeText: {
    color: '#B4ADA0',
    fontSize: 12,
    marginTop: 4,
  },
  summary: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#D8D3C0',
    borderStyle: 'dashed',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13.5,
    color: '#5C6B5D',
  },
  summaryValue: {
    fontSize: 13.5,
    color: '#5C6B5D',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#D8D3C0',
    marginVertical: 6,
  },
  totalLabel: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  totalValue: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  btnGold: {
    backgroundColor: colors.gold,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  btnGoldText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.white,
  },
  hint: {
    fontSize: 11,
    color: '#93A091',
    textAlign: 'center',
    marginTop: 8,
  },
  orderSuccess: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 10,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mossDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 19,
    color: colors.ink,
  },
  orderNum: {
    fontFamily: fontFamily.mono,
    color: colors.clay,
    fontSize: 13,
    marginVertical: 6,
    marginBottom: 20,
  },
  successText: {
    fontSize: 13,
    color: '#5C6B5D',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: colors.mossDark,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  btnPrimaryText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.paper,
  },
});
