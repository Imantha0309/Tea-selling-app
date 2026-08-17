import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context';
import { useToast } from '@/components/Toast';
import { BottomSheet } from '@/components/BottomSheet';
import { CATEGORIES } from '@/data/categories';
import { colors, fontFamily, radius, shadows, spacing } from '@/theme';
import { Tea } from '@/types';

function lighten(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + 40);
  const g = Math.min(255, ((n >> 8) & 255) + 40);
  const b = Math.min(255, (n & 255) + 40);
  return `rgb(${r},${g},${b})`;
}

export function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { teas, addItem } = useCart();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTea, setSelectedTea] = useState<Tea | null>(null);
  const [detailQty, setDetailQty] = useState(1);

  const filtered = activeCategory === 'All' ? teas : teas.filter((t) => t.category === activeCategory);

  const quickAdd = (tea: Tea) => {
    addItem(tea.id, 1);
    showToast(`Added ${tea.name} to cart`);
  };

  const openDetail = (tea: Tea) => {
    setSelectedTea(tea);
    setDetailQty(1);
  };

  const addFromDetail = () => {
    if (!selectedTea) return;
    addItem(selectedTea.id, detailQty);
    showToast(`Added ${detailQty} × ${selectedTea.name} to cart`);
    setSelectedTea(null);
    setDetailQty(1);
  };

  const renderTeaCard = ({ item }: { item: Tea }) => (
    <Pressable
      style={({ pressed }) => [styles.teaCard, pressed && styles.teaCardPressed]}
      onPress={() => openDetail(item)}
    >
      <View style={[styles.liquor, { backgroundColor: item.liquorColor }]}>
        <View
          style={[
            styles.liquorHighlight,
            {
              backgroundColor: lighten(item.liquorColor),
            },
          ]}
        />
      </View>
      <View style={styles.teaInfo}>
        <Text style={styles.teaName}>{item.name}</Text>
        <Text style={styles.teaOrigin}>{item.origin}</Text>
        <View style={styles.teaMeta}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.category}</Text>
          </View>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          {item.stock === 0 && <Text style={styles.stockOut}>Sold out</Text>}
        </View>
      </View>
      {item.stock > 0 && (
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
          onPress={(e) => {
            e.stopPropagation();
            quickAdd(item);
          }}
        >
          <Ionicons name="add" size={18} color={colors.paper} />
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand header */}
        <View style={styles.brand}>
          <Text style={styles.wordmark}>Steep & Co.</Text>
        </View>
        <Text style={styles.tagline}>Loose-leaf tea, sourced & steeped with care</Text>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
          style={styles.chipsScroll}
        >
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              style={({ pressed }) => [
                styles.chip,
                c === activeCategory && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
              onPress={() => setActiveCategory(c)}
            >
              <Text
                style={[
                  styles.chipText,
                  c === activeCategory && styles.chipTextActive,
                ]}
              >
                {c}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Tea cards */}
        <View style={styles.teaList}>
          {filtered.length > 0 ? (
            filtered.map((tea) => (
              <View key={tea.id}>{renderTeaCard({ item: tea })}</View>
            ))
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyGlyph}>&#61970;</Text>
              <Text style={styles.emptyTitle}>No leaves here</Text>
              <Text style={styles.emptyText}>
                Nothing in this category yet.{'\n'}Try another blend of leaves.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Tea Detail Bottom Sheet */}
      <BottomSheet
        visible={selectedTea !== null}
        onClose={() => setSelectedTea(null)}
      >
        {selectedTea && (
          <View style={styles.detailContent}>
            <Pressable
              style={styles.sheetClose}
              onPress={() => setSelectedTea(null)}
            >
              <Ionicons name="close" size={20} color="#8A9389" />
            </Pressable>

            <View
              style={[
                styles.liquorLg,
                { backgroundColor: selectedTea.liquorColor },
              ]}
            >
              <View
                style={[
                  styles.liquorHighlightLg,
                  { backgroundColor: lighten(selectedTea.liquorColor) },
                ]}
              />
            </View>

            <View style={styles.detailCenter}>
              <Text style={styles.detailName}>{selectedTea.name}</Text>
              <Text style={styles.detailOrigin}>{selectedTea.origin}</Text>
              <View style={[styles.tag, { alignSelf: 'center', marginTop: 8 }]}>
                <Text style={styles.tagText}>{selectedTea.category}</Text>
              </View>
            </View>

            <Text style={styles.detailDesc}>{selectedTea.description}</Text>

            <View style={styles.detailRow2}>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatLabel}>Steep time</Text>
                <Text style={styles.detailStatValue}>{selectedTea.steepTime}</Text>
              </View>
              <View style={styles.detailStat}>
                <Text style={styles.detailStatLabel}>Water temp</Text>
                <Text style={styles.detailStatValue}>{selectedTea.steepTemp}</Text>
              </View>
            </View>

            {selectedTea.stock === 0 ? (
              <View>
                <Text style={styles.soldOutDetail}>Currently sold out</Text>
                <Pressable
                  style={styles.btnGhost}
                  onPress={() => setSelectedTea(null)}
                >
                  <Text style={styles.btnGhostText}>Close</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <View style={styles.detailPriceRow}>
                  <Text style={styles.priceLg}>
                    ${selectedTea.price.toFixed(2)}
                  </Text>
                  <View style={styles.stepper}>
                    <Pressable
                      style={styles.stepperBtn}
                      onPress={() => setDetailQty(Math.max(1, detailQty - 1))}
                    >
                      <Text style={styles.stepperBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.stepperValue}>{detailQty}</Text>
                    <Pressable
                      style={styles.stepperBtn}
                      onPress={() => setDetailQty(detailQty + 1)}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable style={styles.btnPrimary} onPress={addFromDetail}>
                  <Text style={styles.btnPrimaryText}>Add to cart</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </BottomSheet>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
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
  chipsScroll: {
    marginBottom: 6,
  },
  chipsContainer: {
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 100,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.mossDark,
    borderColor: colors.mossDark,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipText: {
    fontSize: 12.5,
    fontFamily: fontFamily.sansSemiBold,
    color: colors.mossDark,
  },
  chipTextActive: {
    color: colors.paper,
  },
  teaList: {
    gap: 10,
  },
  teaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 12,
  },
  teaCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  liquor: {
    width: 52,
    height: 52,
    borderRadius: 26,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: 'rgba(30,42,34,0.15)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liquorHighlight: {
    width: 28,
    height: 28,
    borderRadius: 14,
    opacity: 0.5,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  teaInfo: {
    flex: 1,
    minWidth: 0,
  },
  teaName: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 16.5,
    color: colors.ink,
  },
  teaOrigin: {
    fontSize: 11.5,
    color: '#6B7A6C',
    marginTop: 1,
  },
  teaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  tag: {
    fontSize: 10,
    fontFamily: fontFamily.sansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    color: colors.mossDark,
    backgroundColor: colors.mist,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontFamily: fontFamily.sansBold,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    color: colors.mossDark,
  },
  price: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    fontWeight: '500',
    color: colors.clay,
  },
  stockOut: {
    color: colors.danger,
    fontSize: 10.5,
    fontWeight: '600',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.mossDark,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addBtnPressed: {
    opacity: 0.7,
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

  // Bottom sheet detail
  detailContent: {
    paddingBottom: 20,
  },
  sheetClose: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 4,
  },
  liquorLg: {
    width: 118,
    height: 118,
    borderRadius: 59,
    marginVertical: 6,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: 'rgba(30,42,34,0.15)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liquorHighlightLg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.45,
    position: 'absolute',
    top: 18,
    left: 18,
  },
  detailCenter: {
    alignItems: 'center',
    marginBottom: 8,
  },
  detailName: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 20,
    color: colors.ink,
  },
  detailOrigin: {
    fontSize: 12,
    color: '#6B7A6C',
    marginBottom: 4,
  },
  detailDesc: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#4E5C4F',
    marginVertical: 16,
  },
  detailRow2: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  detailStat: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.mist,
    borderRadius: 12,
    paddingVertical: 10,
  },
  detailStatLabel: {
    fontSize: 11,
    fontFamily: fontFamily.sansSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    color: colors.mossDark,
    marginBottom: 2,
  },
  detailStatValue: {
    fontFamily: fontFamily.mono,
    fontWeight: '600',
    fontSize: 13,
    color: colors.ink,
  },
  soldOutDetail: {
    textAlign: 'center',
    color: colors.danger,
    fontWeight: '600',
    marginBottom: 10,
  },
  detailPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceLg: {
    fontFamily: fontFamily.mono,
    fontSize: 16,
    fontWeight: '500',
    color: colors.clay,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  btnPrimary: {
    backgroundColor: colors.mossDark,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimaryText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.paper,
  },
  btnGhost: {
    backgroundColor: colors.mist,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnGhostText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.mossDark,
  },
});
