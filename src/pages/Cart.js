import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Classic Beef Burger',
      price: 399,
      quantity: 2,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
      restaurant: 'Burger Palace'
    },
    {
      id: 2,
      name: 'French Fries',
      price: 149,
      quantity: 1,
      image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
      restaurant: 'Burger Palace'
    }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 99;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center py-5 border-b border-gray-200 last:border-0">
                      {/* Item Image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.restaurant}
                            </p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            Rs. {item.price * item.quantity}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              className="px-3 py-1 text-gray-600 hover:text-[#d70f64]"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            <span className="px-3 py-1 text-gray-600 border-x">
                              {item.quantity}
                            </span>
                            <button
                              className="px-3 py-1 text-gray-600 hover:text-[#d70f64]"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          <button
                            className="text-[#d70f64] hover:text-[#b30d53]"
                            onClick={() => removeItem(item.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-[#d70f64] hover:text-[#b30d53] flex items-center"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-base text-gray-600">
                    <p>Subtotal</p>
                    <p>Rs. {subtotal}</p>
                  </div>
                  <div className="flex justify-between text-base text-gray-600">
                    <p>Delivery Fee</p>
                    <p>Rs. {deliveryFee}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <p>Total</p>
                      <p>Rs. {total}</p>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full btn-primary mt-6"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* Accepted Payment Methods */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Accepted Payment Methods
                </h3>
                <div className="flex space-x-4 text-2xl text-gray-400">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard"></i>
                  <i className="fab fa-cc-amex"></i>
                  <i className="fas fa-money-bill-wave"></i>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">
              <i className="fas fa-shopping-cart"></i>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link to="/" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
