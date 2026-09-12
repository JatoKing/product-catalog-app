// src/components/product-list-item.tsx
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { Product } from '@/data/products/types';
import { Spacing } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export function ProductListItem({ product }: { product: Product }) {
  return (
    <Link
      href={{ pathname: '/product/[id]', params: { id: String(product.id) } }}
      asChild
    >
      <ThemedView type="backgroundElement" style={styles.row}>
        <Image
          source={product.thumbnail}
          style={styles.thumbnail}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={200}
        />
        <ThemedView style={styles.info}>
          <ThemedText type="default" numberOfLines={2}>
            {product.title}
          </ThemedText>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ${product.price}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
    alignItems: 'center',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: Spacing.two,
  },
  info: {
    flex: 1,
    gap: Spacing.one,
  },
});
