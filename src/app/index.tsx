// src/app/index.tsx
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductSearchIndex } from '@/data/products/use-product-search-index';
import { ProductListItem } from '@/components/product-list-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useProducts } from '@/data/products/use-products';

export default function ProductListScreen() {
  const { products, isLoading, isLoadingMore, error, hasMore, loadMore, retry } =
    useProducts();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  const searchIndex = useProductSearchIndex();
  const filteredProducts = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return products;
    const source = searchIndex.length > 0 ? searchIndex : products;
    return source.filter((product) => product.title.toLowerCase().includes(q));
  }, [products, searchIndex, debouncedQuery]);

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

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search products..."
        placeholderTextColor="#8A8A8E"
        style={styles.searchInput}
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {filteredProducts.length === 0 ? (
        <ThemedView style={styles.centered}>
          <ThemedText type="default">
            {debouncedQuery ? 'No products match your search.' : 'No products found.'}
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductListItem product={item} />}
          contentContainerStyle={styles.list}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? <ActivityIndicator style={styles.footer} /> : null
          }
        />
      )}
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

    searchInput: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    backgroundColor: '#F0F0F3',
    fontSize: 16,
  },

});
