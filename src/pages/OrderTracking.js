import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      const orderData = orderService.getOrder(parseInt(orderId));
      setOrder(orderData);
      setLoading(false);
    };

    fetchOrder();
    
    // Refresh order data every 5 seconds to show real-time updates
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-yellow-500';
      case 'ready': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {new Date(order.orderTime).toLocaleDateString()}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg text-white font-medium ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
              <p className="text-gray-600">{order.deliveryInfo.address}</p>
              <p className="text-gray-600">{order.deliveryInfo.name}</p>
              <p className="text-gray-600">{order.deliveryInfo.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Restaurant</h3>
              <p className="text-gray-900 font-medium">{order.restaurant.name}</p>
              <p className="text-gray-600">{order.restaurant.cuisine}</p>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Progress</h2>
          <div className="space-y-6">
            {order.trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`w-4 h-4 rounded-full mt-1 ${
                  step.completed ? getStatusColor(step.status) : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      step.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.message}
                    </h3>
                    {step.timestamp && (
                      <span className="text-sm text-gray-500">
                        {formatTime(step.timestamp)}
                      </span>
                    )}
                  </div>
                  {step.completed && index < order.trackingSteps.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-200 ml-1.5 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Rs. {item.price * item.quantity}</p>
                  <p className="text-sm text-gray-600">Rs. {item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">Rs. {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">Rs. {order.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">Rs. {order.tax}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>Rs. {order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Button */}
        {['confirmed', 'preparing'].includes(order.status) && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  orderService.cancelOrder(order.id);
                  setOrder({...order, status: 'cancelled'});
                }
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
