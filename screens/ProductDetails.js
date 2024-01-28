import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const ProductDetails = ({route, navigation}) => {
  const {productId} = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://my-json-server.typicode.com/benirvingplt/products/products/${productId}`,
      )
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product details', error));
  }, [productId]);

  const addToBasket = async () => {
    try {
      // Fetch existing basket items from AsyncStorage
      const existingItems = await AsyncStorage.getItem('basket');
      const items = existingItems ? JSON.parse(existingItems) : [];

      // Check if the product is already in the basket
      const existingItem = items.find(item => item.id === productId);

      if (existingItem) {
        // If the product is already in the basket, update the quantity
        existingItem.quantity += 1;
      } else {
        // If the product is not in the basket, add it
        const newProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        };
        items.push(newProduct);

      }

      // Save the updated basket items to AsyncStorage
      await AsyncStorage.setItem('basket', JSON.stringify(items));
    } catch (error) {
      console.error('Error adding to basket', error);
    }
  };

  return (
    <View style={styles.container}>
      {product && (
        <View style={styles.productCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          {/* Add more details if needed */}
          <Button
            title="Add to Basket"
            onPress={() => addToBasket(product.id)}
          />
        </View>
      )}
      <Button
        title="Go back to Products"
        onPress={() => navigation.navigate('ProductsList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    border: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ProductDetails;
