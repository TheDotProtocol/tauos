import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { tokens } from '@tau/taumail-mobile-client';

type TauMailCodeInputProps = {
  value: string;
  onChange: (code: string) => void;
  length?: number;
  error?: string;
};

export function TauMailCodeInput({
  value,
  onChange,
  length = 6,
  error,
}: TauMailCodeInputProps) {
  const inputRef = useRef<TextInput>(null);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        style={styles.hiddenInput}
        caretHidden
      />
      <View style={styles.row}>
        {digits.map((digit, index) => {
          const filled = digit.trim().length > 0;
          const active = index === value.length && value.length < length;
          return (
            <View
              key={index}
              style={[
                styles.box,
                filled && styles.boxFilled,
                active && styles.boxActive,
              ]}
            >
              <Text style={[styles.digit, filled && styles.digitFilled]}>
                {filled ? digit : active ? '|' : '•'}
              </Text>
            </View>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 1,
    width: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  box: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: tokens.colors.gold,
    backgroundColor: tokens.colors.goldSurface,
  },
  boxActive: {
    borderColor: tokens.colors.gold,
  },
  digit: {
    fontSize: 20,
    fontWeight: '700',
    color: tokens.colors.textTertiary,
  },
  digitFilled: {
    color: tokens.colors.textPrimary,
  },
  error: {
    marginTop: 12,
    textAlign: 'center',
    color: tokens.colors.danger,
    fontSize: 13,
  },
});

export default TauMailCodeInput;
