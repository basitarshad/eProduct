// __tests__/Basket.test.js

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import Basket from '../screens/Basket'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

describe('Basket', () => {
  test('renders empty basket', async () => {
    // Mock AsyncStorage getItem to simulate an empty basket
    AsyncStorage.getItem.mockReturnValueOnce(Promise.resolve(null))

    const { getByText } = render(<Basket />)

    expect(getByText('Your basket is empty')).toBeTruthy()
  })

  test('renders items in the basket', async () => {
    const mockedItems = [
      { id: 1, name: 'Product 1', price: 10.99, quantity: 2 },
      { id: 2, name: 'Product 2', price: 15.99, quantity: 1 },
    ]

    // Mock AsyncStorage getItem to simulate items in the basket
    AsyncStorage.getItem.mockReturnValueOnce(
      Promise.resolve(JSON.stringify(mockedItems))
    )

    const { getByText } = render(<Basket />)

    // Check if items and total price are displayed correctly
    mockedItems.forEach((item) => {
      expect(getByText(item.name)).toBeTruthy()
      expect(getByText(`Quantity: ${item.quantity}`)).toBeTruthy()
      expect(getByText(`$${item.price * item.quantity}`)).toBeTruthy()
    })

    expect(
      getByText(
        `Total: $${mockedItems
          .reduce((acc, item) => acc + item.price * item.quantity, 0)
          .toFixed(2)}`
      )
    ).toBeTruthy()
  })

  test('clears the basket', async () => {
    const mockedItems = [
      { id: 1, name: 'Product 1', price: 10.99, quantity: 2 },
      { id: 2, name: 'Product 2', price: 15.99, quantity: 1 },
    ]

    // Mock AsyncStorage getItem to simulate items in the basket
    AsyncStorage.getItem.mockReturnValueOnce(
      Promise.resolve(JSON.stringify(mockedItems))
    )

    const { getByText, getByTestId } = render(<Basket />)

    // Simulate pressing the "Clear Basket" button
    await fireEvent.press(getByTestId('clearBasketButton'))

    // Check if AsyncStorage setItem is called with an empty array
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'basket',
      JSON.stringify([])
    )

    // Check if the basket is now empty
    expect(getByText('Your basket is empty')).toBeTruthy()
  })
})
