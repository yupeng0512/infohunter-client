import { View, Text, StyleSheet } from 'react-native';
import { getSourceLabel, getSourceColor } from '@infohunter/shared';

export function SourceBadge({ source }: { source: string }) {
  const color = getSourceColor(source);
  return (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
      <Text style={[styles.text, { color }]}>{getSourceLabel(source)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
