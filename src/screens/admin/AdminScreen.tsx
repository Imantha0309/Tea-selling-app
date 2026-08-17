import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin, useCart } from '@/context';
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

function PinLockScreen() {
  const insets = useSafeAreaInsets();
  const { pinBuffer, pinPress, pinBackspace } = useAdmin();
  const dots = [0, 1, 2, 3].map((i) => (
    <View
      key={i}
      style={[styles.dot, i < pinBuffer.length && styles.dotFilled]}
    />
  ));

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.lockScreen}>
        <Ionicons name="lock-closed" size={38} color={colors.mossDark} />
        <Text style={styles.lockTitle}>Admin access</Text>
        <View style={styles.pinDots}>{dots}</View>
        <View style={styles.keypad}>
          {keys.map((k) => (
            <Pressable key={k} style={styles.key} onPress={() => pinPress(k)}>
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
          <View />
          <Pressable style={styles.key} onPress={() => pinPress('0')}>
            <Text style={styles.keyText}>0</Text>
          </Pressable>
          <Pressable style={styles.key} onPress={pinBackspace}>
            <Text style={styles.keyText}>⌫</Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>Demo PIN: 1234</Text>
      </View>
    </View>
  );
}

export function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { unlocked, lock } = useAdmin();
  const { teas, setTeas } = useCart();
  const { showToast } = useToast();
  const [formVisible, setFormVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [editingTea, setEditingTea] = useState<Tea | null>(null);
  const [deletingTea, setDeletingTea] = useState<Tea | null>(null);

  // Form state
  const [fName, setFName] = useState('');
  const [fCategory, setFCategory] = useState('Green');
  const [fOrigin, setFOrigin] = useState('');
  const [fPrice, setFPrice] = useState('');
  const [fStock, setFStock] = useState('');
  const [fSteepTime, setFSteepTime] = useState('');
  const [fSteepTemp, setFSteepTemp] = useState('');
  const [fColor, setFColor] = useState('#C9D6A0');
  const [fDesc, setFDesc] = useState('');

  if (!unlocked) {
    return <PinLockScreen />;
  }

  const openAddForm = () => {
    setEditingTea(null);
    setFName('');
    setFCategory('Green');
    setFOrigin('');
    setFPrice('');
    setFStock('');
    setFSteepTime('');
    setFSteepTemp('');
    setFColor('#C9D6A0');
    setFDesc('');
    setFormVisible(true);
  };

  const openEditForm = (tea: Tea) => {
    setEditingTea(tea);
    setFName(tea.name);
    setFCategory(tea.category);
    setFOrigin(tea.origin);
    setFPrice(tea.price.toString());
    setFStock(tea.stock.toString());
    setFSteepTime(tea.steepTime);
    setFSteepTemp(tea.steepTemp);
    setFColor(tea.liquorColor);
    setFDesc(tea.description);
    setFormVisible(true);
  };

  const saveForm = () => {
    const name = fName.trim();
    const price = parseFloat(fPrice);
    if (!name) {
      showToast('Tea needs a name');
      return;
    }
    if (isNaN(price) || price < 0) {
      showToast('Enter a valid price');
      return;
    }

    const data: Omit<Tea, 'id'> = {
      name,
      category: fCategory,
      origin: fOrigin.trim(),
      price,
      stock: Math.max(0, parseInt(fStock) || 0),
      steepTime: fSteepTime.trim(),
      steepTemp: fSteepTemp.trim(),
      liquorColor: fColor,
      description: fDesc.trim(),
    };

    if (editingTea) {
      setTeas(teas.map((t) => (t.id === editingTea.id ? { ...t, ...data } : t)));
      showToast('Tea updated');
    } else {
      const newTea: Tea = { ...data, id: 't' + Date.now() };
      setTeas([...teas, newTea]);
      showToast('Tea added');
    }
    setFormVisible(false);
  };

  const openDeleteConfirm = (tea: Tea) => {
    setDeletingTea(tea);
    setDeleteVisible(true);
  };

  const deleteTea = () => {
    if (!deletingTea) return;
    setTeas(teas.filter((t) => t.id !== deletingTea.id));
    setDeleteVisible(false);
    setDeletingTea(null);
    showToast('Tea deleted');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.adminHeader}>
          <Text style={styles.adminWordmark}>Manage teas</Text>
          <Pressable
            style={styles.iconBtn}
            onPress={lock}
          >
            <Ionicons name="lock-closed" size={16} color={colors.mossDark} />
          </Pressable>
        </View>
        <Text style={styles.tagline}>{teas.length} teas in the catalog</Text>

        {teas.length > 0 ? (
          teas.map((tea) => (
            <View key={tea.id} style={styles.adminRow}>
              <View
                style={[styles.liquorSmall, { backgroundColor: tea.liquorColor }]}
              >
                <View
                  style={[
                    styles.liquorHighlightSmall,
                    { backgroundColor: lighten(tea.liquorColor) },
                  ]}
                />
              </View>
              <View style={styles.adminRowInfo}>
                <Text style={styles.adminRowName}>{tea.name}</Text>
                <View style={styles.adminRowMeta}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{tea.category}</Text>
                  </View>
                  <Text style={styles.adminRowPrice}>
                    ${tea.price.toFixed(2)}
                  </Text>
                  <Text
                    style={[
                      styles.adminRowStock,
                      { color: tea.stock === 0 ? colors.danger : '#6B7A6C' },
                    ]}
                  >
                    · {tea.stock} in stock
                  </Text>
                </View>
              </View>
              <View style={styles.adminActions}>
                <Pressable
                  style={styles.iconBtn}
                  onPress={() => openEditForm(tea)}
                >
                  <Ionicons name="pencil" size={13} color={colors.mossDark} />
                </Pressable>
                <Pressable
                  style={[styles.iconBtn, styles.iconBtnDanger]}
                  onPress={() => openDeleteConfirm(tea)}
                >
                  <Ionicons name="trash" size={13} color={colors.danger} />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyGlyph}>&#61970;</Text>
            <Text style={styles.emptyTitle}>Catalog is empty</Text>
            <Text style={styles.emptyText}>
              Tap the + button to add your first tea.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={openAddForm}>
        <Ionicons name="add" size={26} color={colors.white} />
      </Pressable>

      {/* Tea Form Bottom Sheet */}
      <BottomSheet visible={formVisible} onClose={() => setFormVisible(false)}>
        <Pressable
          style={styles.sheetClose}
          onPress={() => setFormVisible(false)}
        >
          <Ionicons name="close" size={20} color="#8A9389" />
        </Pressable>
        <Text style={styles.sheetTitle}>
          {editingTea ? 'Edit tea' : 'Add a tea'}
        </Text>

        <FormField label="Name" value={fName} onChangeText={setFName} placeholder="Dragon Well" />
        <View style={styles.row2}>
          <View style={styles.fieldHalf}>
            <Text style={formStyles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <Pressable
                  key={c}
                  style={[
                    styles.pickerOption,
                    c === fCategory && styles.pickerOptionActive,
                  ]}
                  onPress={() => setFCategory(c)}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      c === fCategory && styles.pickerOptionTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <FormField label="Origin" value={fOrigin} onChangeText={setFOrigin} placeholder="Hangzhou, China" />
        <View style={styles.row2}>
          <View style={styles.fieldHalf}>
            <FormField
              label="Price (USD)"
              value={fPrice}
              onChangeText={setFPrice}
              placeholder="8.50"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.fieldHalf}>
            <FormField
              label="Stock"
              value={fStock}
              onChangeText={setFStock}
              placeholder="24"
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.row2}>
          <View style={styles.fieldHalf}>
            <FormField
              label="Steep time"
              value={fSteepTime}
              onChangeText={setFSteepTime}
              placeholder="2–3 min"
            />
          </View>
          <View style={styles.fieldHalf}>
            <FormField
              label="Water temp"
              value={fSteepTemp}
              onChangeText={setFSteepTemp}
              placeholder="80°C"
            />
          </View>
        </View>
        <FormField
          label="Description"
          value={fDesc}
          onChangeText={setFDesc}
          placeholder="Tasting notes..."
          multiline
        />
        <Pressable style={styles.btnPrimary} onPress={saveForm}>
          <Text style={styles.btnPrimaryText}>
            {editingTea ? 'Save changes' : 'Add tea'}
          </Text>
        </Pressable>
      </BottomSheet>

      {/* Delete Confirmation Bottom Sheet */}
      <BottomSheet
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
      >
        <Text style={styles.sheetTitle}>
          Delete {deletingTea?.name}?
        </Text>
        <Text style={styles.deleteText}>
          This removes it from the catalog for everyone. This can't be undone.
        </Text>
        <Pressable style={styles.btnDanger} onPress={deleteTea}>
          <Text style={styles.btnDangerText}>Delete tea</Text>
        </Pressable>
        <Pressable
          style={styles.btnGhost}
          onPress={() => setDeleteVisible(false)}
        >
          <Text style={styles.btnGhostText}>Cancel</Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  multiline?: boolean;
}) {
  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[formStyles.input, multiline && formStyles.inputMultiline]}
      />
    </View>
  );
}

const formStyles = StyleSheet.create({
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: fontFamily.sansSemiBold,
    color: colors.mossDark,
    textTransform: 'uppercase',
    letterSpacing: 0.04,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    fontFamily: fontFamily.sans,
    fontSize: 14,
    color: colors.ink,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  adminWordmark: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 22,
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
  adminRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 10,
    paddingRight: 12,
    marginBottom: 9,
  },
  liquorSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    flexShrink: 0,
    borderWidth: 2,
    borderColor: 'rgba(30,42,34,0.15)',
    overflow: 'hidden',
  },
  liquorHighlightSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    opacity: 0.5,
    position: 'absolute',
    top: 4,
    left: 4,
  },
  adminRowInfo: {
    flex: 1,
    minWidth: 0,
  },
  adminRowName: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 14.5,
    color: colors.ink,
  },
  adminRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  adminRowPrice: {
    fontFamily: fontFamily.mono,
    fontSize: 13,
    fontWeight: '500',
    color: colors.clay,
  },
  adminRowStock: {
    fontSize: 11,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDanger: {
    backgroundColor: '#F3DDD7',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    zIndex: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
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

  // Lock screen
  lockScreen: {
    paddingTop: 110,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockTitle: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 18,
    color: colors.ink,
    marginTop: 14,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 18,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.moss,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: colors.mossDark,
  },
  keypad: {
    width: 230,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  key: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.mist,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 18,
    fontFamily: fontFamily.mono,
    color: colors.ink,
  },
  hint: {
    fontSize: 11,
    color: '#93A091',
    marginTop: 8,
  },

  // Sheet
  sheetClose: {
    position: 'absolute',
    top: 16,
    right: 18,
    zIndex: 10,
    padding: 4,
  },
  sheetTitle: {
    fontFamily: fontFamily.serifMedium,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 14,
  },
  row2: {
    flexDirection: 'row',
    gap: 10,
  },
  fieldHalf: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  pickerOption: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionActive: {
    backgroundColor: colors.mossDark,
    borderColor: colors.mossDark,
  },
  pickerOptionText: {
    fontSize: 12,
    fontFamily: fontFamily.sansSemiBold,
    color: colors.mossDark,
  },
  pickerOptionTextActive: {
    color: colors.paper,
  },
  btnPrimary: {
    backgroundColor: colors.mossDark,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPrimaryText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.paper,
  },
  deleteText: {
    fontSize: 13,
    color: '#6B7A6C',
    marginBottom: 18,
    lineHeight: 20,
  },
  btnDanger: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnDangerText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14.5,
    color: colors.danger,
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
  tag: {
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
});
