import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import restaurantData from '../data/restaurants.json';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // Mock data for carousel
  const carouselItems = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      title: 'Explore Lahore\'s Best Restaurants',
      description: 'Discover amazing food from top-rated restaurants'
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
      title: 'Quick & Easy Delivery',
      description: 'Food delivered to your doorstep'
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg',
      title: 'Special Deals & Discounts',
      description: 'Save big on your favorite meals'
    }
  ];

  // Initialize restaurants
  useEffect(() => {
    setRestaurants(restaurantData);
    setFilteredRestaurants(restaurantData);
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get unique cuisines from restaurants
  const cuisines = ['all', ...new Set(restaurants.map(restaurant => 
    restaurant.cuisine.split(',')[0].trim()
  ))].sort();

  // Handle cuisine filter change
  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine);
    filterRestaurants(cuisine, sortBy);
  };

  // Handle sort change
  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    filterRestaurants(selectedCuisine, sortType);
  };

  // Filter and sort restaurants
  const filterRestaurants = (cuisine, sort) => {
    let filtered = [...restaurants];
    
    // Apply cuisine filter
    if (cuisine !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    }

    // Apply sorting
    switch (sort) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        filtered.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime);
          const timeB = parseInt(b.deliveryTime);
          return timeA - timeB;
        });
        break;
      case 'minOrder':
        filtered.sort((a, b) => {
          const orderA = parseInt(a.minOrder.replace(/[^0-9]/g, ''));
          const orderB = parseInt(b.minOrder.replace(/[^0-9]/g, ''));
          return orderA - orderB;
        });
        break;
      default:
        break;
    }

    setFilteredRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <div className="relative h-[500px] overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{item.title}</h1>
              <p className="text-xl md:text-2xl">{item.description}</p>
            </div>
          </div>
        ))}

        {/* Carousel Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === activeSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setActiveSlide(index)}
            ></button>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          {/* Cuisine Filter */}
          <div className="flex flex-wrap gap-2">
            {cuisines.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => handleCuisineChange(cuisine)}
                className={`px-4 py-2 rounded-full ${
                  selectedCuisine === cuisine
                    ? 'bg-[#d70f64] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border rounded-lg px-3 py-2 bg-white"
            >
              <option value="rating">Rating</option>
              <option value="deliveryTime">Delivery Time</option>
              <option value="minOrder">Minimum Order</option>
            </select>
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <Link
              key={index}
              to={`/restaurant/${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.imageUrl || 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <span className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    {restaurant.rating}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    {restaurant.deliveryTime}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="flex items-center">
                    <i className="fas fa-money-bill-wave mr-1"></i>
                    {restaurant.minOrder}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Download App Section */}
      <div className="bg-white py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">
                Download the foodpanda app
              </h2>
              <p className="text-gray-600 mb-6">
                Order from your favorite restaurants, track delivery in real-time
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800">
                  <i className="fab fa-apple text-2xl"></i>
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a href="#" className="bg-black text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-800">
                  <i className="fab fa-google-play text-2xl"></i>
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.pexels.com/photos/1162361/pexels-photo-1162361.jpeg"
                alt="Mobile App"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
