import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import restaurantsData from '../data/restaurants.json';

const Toast = ({ message, isVisible, onHide }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
        <i className="fas fa-check-circle text-green-400"></i>
        <span>{message}</span>
      </div>
    </div>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [restaurant, setRestaurant] = useState(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [cartTotal, setCartTotal] = useState(0);
  const [animatingItem, setAnimatingItem] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    const restaurantData = restaurantsData[parseInt(id) - 1] || restaurantsData[0];
    setRestaurant(restaurantData);

    const handleScroll = () => {
      setIsHeaderSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  // Handle quantity changes with animation
  const updateQuantity = (itemId, delta, price) => {
    setAnimatingItem(itemId);
    setTimeout(() => setAnimatingItem(null), 200);

    setQuantities(prev => {
      const newQuantity = Math.max(0, (prev[itemId] || 0) + delta);
      const newQuantities = { ...prev, [itemId]: newQuantity };
      
      // Update cart total
      const total = Object.entries(newQuantities).reduce((sum, [id, qty]) => {
        const item = menuItems.find(item => item.id === parseInt(id));
        return sum + (item ? item.price * qty : 0);
      }, 0);
      setCartTotal(total);
      
      // Show toast when adding items
      if (delta > 0) {
        const item = menuItems.find(item => item.id === itemId);
        setToast({
          visible: true,
          message: `Added ${item.name} to cart`
        });
      }
      
      return newQuantities;
    });
  };

  // Handle adding to cart
  const addToCart = (item) => {
    setToast({
      visible: true,
      message: `${quantities[item.id]} × ${item.name} added to cart`
    });
  };

  // Mock menu categories
  const categories = ['Popular', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'];

  // Mock menu items with updated styling
  const menuItems = [
    {
      id: 1,
      name: 'Signature Dish',
      description: 'Our chef\'s special creation with premium ingredients',
      price: 899,
      image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
      category: 'Main Course',
      popular: true
    },
    {
      id: 2,
      name: 'Special Platter',
      description: 'A delightful combination of our best dishes',
      price: 1299,
      image: 'https://images.pexels.com/photos/2725744/pexels-photo-2725744.jpeg',
      category: 'Main Course',
      popular: true
    },
    {
      id: 3,
      name: 'Fresh Garden Salad',
      description: 'Crispy fresh vegetables with house dressing',
      price: 349,
      image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg',
      category: 'Appetizers'
    },
    {
      id: 4,
      name: 'Artisanal Dessert',
      description: 'Handcrafted sweet delicacy',
      price: 449,
      image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg',
      category: 'Desserts'
    }
  ];

  // Filter menu items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : selectedCategory === 'Popular'
    ? menuItems.filter(item => item.popular)
    : menuItems.filter(item => item.category === selectedCategory);

  if (!restaurant) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <Toast 
        message={toast.message}
        isVisible={toast.visible}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      {/* Sticky Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transform transition-transform duration-300 ${
        isHeaderSticky ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
              <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-sm">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  {restaurant.rating}
                </span>
                <span className="flex items-center text-sm">
                  <i className="far fa-clock text-gray-400 mr-1"></i>
                  {restaurant.deliveryTime}
                </span>
              </div>
              {cartTotal > 0 && (
                <div className="flex items-center bg-black text-white px-6 py-2 rounded-lg transform transition-all duration-200 hover:scale-105">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  <span className="font-medium">Rs. {cartTotal}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Hero Section */}
      <div className="relative h-[400px]">
        <img 
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto px-4 h-full flex items-end pb-12">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
              <p className="text-xl mb-4 text-gray-200">{restaurant.cuisine}</p>
              <div className="flex items-center space-x-6 text-base">
                <span className="flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-2"></i>
                  {restaurant.rating}
                </span>
                <span className="flex items-center">
                  <i className="far fa-clock text-gray-300 mr-2"></i>
                  {restaurant.deliveryTime}
                </span>
                <span className="flex items-center">
                  <i className="fas fa-tag text-gray-300 mr-2"></i>
                  Min {restaurant.minOrder}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Menu Categories</h2>
              <nav className="space-y-2">
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    selectedCategory === 'all'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Items
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative h-56">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.popular && (
                      <span className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <span className="text-xl font-bold text-gray-900">Rs. {item.price}</span>
                          {quantities[item.id] > 0 && (
                            <div className="text-sm text-gray-600">
                              Total: Rs. {item.price * quantities[item.id]}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center bg-gray-100 rounded-lg p-1 transition-transform duration-200 ${
                            animatingItem === item.id ? 'scale-110' : ''
                          }`}>
                            <button 
                              onClick={() => updateQuantity(item.id, -1, item.price)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-black hover:bg-black hover:text-white transition-colors"
                            >
                              -
                            </button>
                            <span className="w-10 text-center font-medium">
                              {quantities[item.id] || 0}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1, item.price)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-black hover:bg-black hover:text-white transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => addToCart(item)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                              quantities[item.id] 
                                ? 'bg-black text-white hover:bg-gray-900 transform hover:scale-105 shadow-lg' 
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!quantities[item.id]}
                          >
                            <i className="fas fa-shopping-cart mr-2"></i>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
