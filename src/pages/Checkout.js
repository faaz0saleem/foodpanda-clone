import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Delivery Address
    address: '',
    apartment: '',
    city: '',
    instructions: '',
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock order summary data
  const orderSummary = {
    subtotal: 947,
    deliveryFee: 99,
    total: 1046
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.address.trim()) {
        newErrors.address = 'Delivery address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    }

    if (currentStep === 2 && formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }

      if (!formData.cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Invalid expiry date (MM/YY)';
      }

      if (!formData.cardCVC.trim()) {
        newErrors.cardCVC = 'CVC is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
        newErrors.cardCVC = 'Invalid CVC';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual order submission logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      navigate('/order-confirmation');
    } catch (error) {
      setErrors({
        submit: 'An error occurred while processing your order. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Steps Progress */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-[#d70f64] text-white' : 'bg-gray-200'
                    }`}>
                      1
                    </span>
                    <span className="ml-2 font-medium">Delivery Address</span>
                  </div>
                  <div className="flex-1 mx-4 border-t-2 border-gray-200"></div>
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-[#d70f64] text-white' : 'bg-gray-200'
                    }`}>
                      2
                    </span>
                    <span className="ml-2 font-medium">Payment</span>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    /* Delivery Address Form */
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className={`input-field mt-1 ${errors.address ? 'border-red-500' : ''}`}
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address"
                        />
                        {errors.address && (
                          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                          Apartment, suite, etc. (optional)
                        </label>
                        <input
                          type="text"
                          id="apartment"
                          name="apartment"
                          className="input-field mt-1"
                          value={formData.apartment}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className={`input-field mt-1 ${errors.city ? 'border-red-500' : ''}`}
                          value={formData.city}
                          onChange={handleChange}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                          Delivery Instructions (optional)
                        </label>
                        <textarea
                          id="instructions"
                          name="instructions"
                          rows="3"
                          className="input-field mt-1"
                          value={formData.instructions}
                          onChange={handleChange}
                          placeholder="Any specific instructions for delivery"
                        ></textarea>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    /* Payment Form */
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Payment Method
                        </label>
                        <div className="space-y-4">
                          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#d70f64]">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="card"
                              checked={formData.paymentMethod === 'card'}
                              onChange={handleChange}
                              className="text-[#d70f64] focus:ring-[#d70f64]"
                            />
                            <span className="ml-3">Credit/Debit Card</span>
                          </label>
                          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-[#d70f64]">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cash"
                              checked={formData.paymentMethod === 'cash'}
                              onChange={handleChange}
                              className="text-[#d70f64] focus:ring-[#d70f64]"
                            />
                            <span className="ml-3">Cash on Delivery</span>
                          </label>
                        </div>
                      </div>

                      {formData.paymentMethod === 'card' && (
                        <>
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                              Card Number
                            </label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              className={`input-field mt-1 ${errors.cardNumber ? 'border-red-500' : ''}`}
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="cardExpiry"
                                name="cardExpiry"
                                className={`input-field mt-1 ${errors.cardExpiry ? 'border-red-500' : ''}`}
                                value={formData.cardExpiry}
                                onChange={handleChange}
                                placeholder="MM/YY"
                              />
                              {errors.cardExpiry && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700">
                                CVC
                              </label>
                              <input
                                type="text"
                                id="cardCVC"
                                name="cardCVC"
                                className={`input-field mt-1 ${errors.cardCVC ? 'border-red-500' : ''}`}
                                value={formData.cardCVC}
                                onChange={handleChange}
                                placeholder="123"
                              />
                              {errors.cardCVC && (
                                <p className="mt-1 text-sm text-red-600">{errors.cardCVC}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="saveCard"
                              name="saveCard"
                              checked={formData.saveCard}
                              onChange={handleChange}
                              className="h-4 w-4 text-[#d70f64] focus:ring-[#d70f64] border-gray-300 rounded"
                            />
                            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                              Save card for future payments
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary"
                      >
                        Back
                      </button>
                    )}
                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary ml-auto"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn-primary ml-auto"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="loading-spinner w-5 h-5 border-2"></div>
                        ) : (
                          'Place Order'
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
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
                  <p>Rs. {orderSummary.subtotal}</p>
                </div>
                <div className="flex justify-between text-base text-gray-600">
                  <p>Delivery Fee</p>
                  <p>Rs. {orderSummary.deliveryFee}</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <p>Total</p>
                    <p>Rs. {orderSummary.total}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center text-sm text-gray-500">
                <i className="fas fa-lock text-[#d70f64] mr-2"></i>
                <p>Your payment information is encrypted and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
