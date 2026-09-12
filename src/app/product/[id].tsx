// src/app/product/[id].tsx
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProduct } from '@/data/products/use-product';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, error, retry } = useProduct(Number(id));

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="default" style={styles.centeredText}>
          {error ?? 'Product not found.'}
        </ThemedText>
        <Pressable onPress={retry} style={styles.retryButton}>
          <ThemedText type="smallBold" themeColor="background">
            Retry
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {product.images.map((uri) => (
          <Image key={uri} source={uri} style={styles.image} contentFit="cover" />
        ))}
      </ScrollView>

      <ThemedView style={styles.info}>
        <ThemedText type="title" style={styles.title}>
          {product.title}
        </ThemedText>
        <ThemedText type="subtitle" themeColor="textSecondary">
          ${product.price}
        </ThemedText>
        <ThemedText type="smallBold">⭐ {product.rating.toFixed(1)}</ThemedText>
        <ThemedText type="default" style={styles.description}>
          {product.description}
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.six,
  },
  image: {
    width: 350,
    height: 350,
  },
  info: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  description: {
    marginTop: Spacing.three,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
  centeredText: {
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3c87f7',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
});
