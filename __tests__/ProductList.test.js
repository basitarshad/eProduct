// __tests__/ProductList.test.js

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-native/extend-expect'
import ProductList from '../screens/ProductList'

describe('ProductList', () => {
  test('renders product list', async () => {
    const mockedProducts = [
      { id: 1, name: 'Product 1', price: 10.99 },
      { id: 2, name: 'Product 2', price: 15.99 },
      // Add more products as needed
    ]

    const { getByText } = render(<ProductList products={mockedProducts} />)

    // Check if each product is rendered
    mockedProducts.forEach((product) => {
      expect(getByText(product.name)).toBeTruthy()
      expect(getByText(`$${product.price}`)).toBeTruthy()
    })
  })

  test('navigates to ProductDetails on product click', async () => {
    const mockedProducts = [
      { id: 1, name: 'Product 1', price: 10.99 },
      { id: 2, name: 'Product 2', price: 15.99 },
    ]

    const { getByText, getByTestId } = render(
      <ProductList
        products={mockedProducts}
        navigation={{ navigate: jest.fn() }}
      />
    )

    // Simulate clicking on the first product
    await fireEvent.press(getByText('Product 1'))

    // Check if navigation.navigate is called with the correct screen and params
    expect(getByTestId('addToBasketButton')).toBeTruthy()
    expect(mockedProducts.navigation.navigate).toHaveBeenCalledWith(
      'ProductDetails',
      { productId: 1 }
    )
  })
})
