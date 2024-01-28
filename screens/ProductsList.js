import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductsList = ({navigation}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get('https://my-json-server.typicode.com/benirvingplt/products/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products', error));
  }, []);

  const addToBasket = async productId => {
    try {
      // Get existing basket items from AsyncStorage
      const existingItems = await AsyncStorage.getItem('basket');
      const items = existingItems ? JSON.parse(existingItems) : [];

      // Check if the product is already in the basket
      const existingItem = items.find(item => item.id === productId);

      if (existingItem) {
        // If the product is already in the basket, update the quantity
        existingItem.quantity += 1;
      } else {
        // If the product is not in the basket, add it
        const product = products.find(product => product.id === productId);
        if (product) {
          items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          });
        }

      }

      // Save the updated basket items to AsyncStorage
      await AsyncStorage.setItem('basket', JSON.stringify(items));
    } catch (error) {
      console.error('Error adding to basket', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {products.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            <Button
              title="Details"
              onPress={() =>
                navigation.navigate('ProductDetails', {productId: product.id})
              }
            />
            <Button
              title="Add to Basket"
              onPress={() => addToBasket(product.id)}
            />
          </View>
        ))}
      </ScrollView>
      <Button
        title="Go to Basket"
        onPress={() => navigation.navigate('Basket')}
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

export default ProductsList;
