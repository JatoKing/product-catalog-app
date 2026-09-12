// src/app/index.tsx
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProductListItem } from '@/components/product-list-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProducts } from '@/data/products/use-products';

export default function ProductListScreen() {
  const { products, isLoading, isLoadingMore, error, hasMore, loadMore, retry } =
    useProducts();

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="default" style={styles.centeredText}>
          {error}
        </ThemedText>
        <Pressable onPress={retry} style={styles.retryButton}>
          <ThemedText type="smallBold" themeColor="background">
            Retry
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  if (products.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="default">No products found.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductListItem product={item} />}
        contentContainerStyle={styles.list}
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? <ActivityIndicator style={styles.footer} /> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
  },
  footer: {
    marginVertical: Spacing.three,
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
