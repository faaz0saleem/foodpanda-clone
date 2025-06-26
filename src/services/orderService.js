// Simulated backend order service
class OrderService {
  constructor() {
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.orderIdCounter = parseInt(localStorage.getItem('orderIdCounter') || '1000');
  }

  // Place a new order
  async placeOrder(orderData) {
    const orderId = ++this.orderIdCounter;
    const order = {
      id: orderId,
      ...orderData,
      status: 'confirmed',
      orderTime: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes from now
      trackingSteps: [
        {
          status: 'confirmed',
          message: 'Order confirmed',
          timestamp: new Date().toISOString(),
          completed: true
        },
        {
          status: 'preparing',
          message: 'Restaurant is preparing your order',
          timestamp: null,
          completed: false
        },
        {
          status: 'ready',
          message: 'Order ready for pickup',
          timestamp: null,
          completed: false
        },
        {
          status: 'out_for_delivery',
          message: 'Out for delivery',
          timestamp: null,
          completed: false
        },
        {
          status: 'delivered',
          message: 'Order delivered',
          timestamp: null,
          completed: false
        }
      ]
    };

    this.orders.push(order);
    this.saveToStorage();

    // Simulate order progression
    this.simulateOrderProgress(orderId);

    return {
      success: true,
      orderId: orderId,
      message: 'Order placed successfully!'
    };
  }

  // Get order by ID
  getOrder(orderId) {
    return this.orders.find(order => order.id === parseInt(orderId));
  }

  // Get all orders
  getAllOrders() {
    return this.orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
  }

  // Update order status
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrder(orderId);
    if (order) {
      order.status = newStatus;
      
      // Update tracking steps
      const stepIndex = order.trackingSteps.findIndex(step => step.status === newStatus);
      if (stepIndex !== -1) {
        order.trackingSteps[stepIndex].completed = true;
        order.trackingSteps[stepIndex].timestamp = new Date().toISOString();
      }

      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Simulate order progress for demo purposes
  simulateOrderProgress(orderId) {
    const progressSteps = ['preparing', 'ready', 'out_for_delivery', 'delivered'];
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      if (currentStep < progressSteps.length) {
        this.updateOrderStatus(orderId, progressSteps[currentStep]);
        currentStep++;
      } else {
        clearInterval(progressInterval);
      }
    }, 10000); // Update every 10 seconds for demo
  }

  // Save to localStorage (simulating backend persistence)
  saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(this.orders));
    localStorage.setItem('orderIdCounter', this.orderIdCounter.toString());
  }

  // Get restaurant orders (for restaurant dashboard)
  getRestaurantOrders(restaurantId) {
    return this.orders.filter(order => order.restaurant.id === restaurantId);
  }

  // Cancel order
  cancelOrder(orderId) {
    const order = this.getOrder(orderId);
    if (order && ['confirmed', 'preparing'].includes(order.status)) {
      order.status = 'cancelled';
      order.trackingSteps.push({
        status: 'cancelled',
        message: 'Order cancelled',
        timestamp: new Date().toISOString(),
        completed: true
      });
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

export const orderService = new OrderService();
