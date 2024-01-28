// __tests__/ProductDetails.test.js

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect' // For extended expect matchers
import ProductDetails from '../screens/ProductDetails'

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

// Mock axios
jest.mock('axios')

describe('ProductDetails', () => {
  // Test rendering and basic behavior
  test('renders product details and adds to basket', async () => {
    const mockedProduct = {
      id: 1,
      name: 'Sample Product',
      price: 19.99,
    }

    // Mock the product details fetch
    jest.mock('axios', () => ({
      get: jest.fn(() => Promise.resolve({ data: mockedProduct })),
    }))

    // Render the component
    const { getByText, getByTestId } = render(
      <ProductDetails route={{ params: { productId: 1 } }} />
    )

    // Check if the product details are rendered
    expect(getByText(mockedProduct.name)).toBeTruthy()
    expect(getByText(`$${mockedProduct.price}`)).toBeTruthy()

    // Mock AsyncStorage getItem to simulate an empty basket
    AsyncStorage.getItem.mockReturnValueOnce(Promise.resolve(null))

    // Simulate adding the product to the basket
    await fireEvent.press(getByTestId('addToBasketButton'))

    // Check if AsyncStorage setItem is called with the correct arguments
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'basket',
      JSON.stringify([
        {
          id: mockedProduct.id,
          name: mockedProduct.name,
          price: mockedProduct.price,
          quantity: 1,
        },
      ])
    )

    // Check if react-native-toastify show is called with the correct arguments
    expect(require('react-native-toastify').show).toHaveBeenCalledWith({
      type: 'success',
      text1: 'Added to Basket',
      text2: `${mockedProduct.name} has been added to your basket.`,
      visibilityTime: 2000,
      position: 'bottom',
    })
  })
})
