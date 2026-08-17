import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '88%',
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 16,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#D8D3C0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
});
