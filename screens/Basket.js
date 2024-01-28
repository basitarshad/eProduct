import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Basket = ({navigation}) => {
  const [basketItems, setBasketItems] = useState([]);

  useEffect(() => {
    const fetchBasketItems = async () => {
      try {
        // Get basket items from AsyncStorage
        const items = await AsyncStorage.getItem('basket');
        if (items) {
          setBasketItems(JSON.parse(items));
        }
      } catch (error) {
        console.error('Error fetching basket items', error);
      }
    };

    fetchBasketItems();
  }, []);

  const removeFromBasket = async productId => {
    try {
      // Remove product from basket and update AsyncStorage
      const updatedItems = basketItems.filter(item => item.id !== productId);
      setBasketItems(updatedItems);
      await AsyncStorage.setItem('basket', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing from basket', error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // Update product quantity in basket and update AsyncStorage
      const updatedItems = basketItems.map(item =>
        item.id === productId ? {...item, quantity: newQuantity} : item,
      );
      setBasketItems(updatedItems);
      await AsyncStorage.setItem('basket', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const calculateTotalPrice = () => {
    return basketItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={basketItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.basketItemCard}>
            <Text style={styles.basketItemName}>{item.name}</Text>
            <Text style={styles.basketItemDetails}>
              ${item.price} x {item.quantity}
            </Text>
            <Button title="Remove" onPress={() => removeFromBasket(item.id)} />
            <Button
              title="+"
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            />
            <Button
              title="-"
              onPress={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1))
              }
            />
          </View>
        )}
      />
      <Text style={styles.totalPrice}>
        Total Price: ${calculateTotalPrice()}
      </Text>
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
  basketItemCard: {
    border: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  basketItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  basketItemDetails: {
    fontSize: 16,
    marginTop: 5,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default Basket;
