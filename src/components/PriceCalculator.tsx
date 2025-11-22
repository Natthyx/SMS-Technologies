import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Page {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface ProService {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
}

export default function PriceCalculator() {
  // Website types with prices
  const websiteTypes = [
    { id: 'basic', name: 'Basic Company', price: 7000 },
    { id: 'ecommerce', name: 'E-commerce website', price: 20000 },
    { id: 'realestate', name: 'Real State website', price: 25000 },
    { id: 'mobile', name: 'Mobile App', price: 40000 },
  ];

  // Payment systems
  const paymentSystems = [
    { id: 'chapa', name: 'Chapa', price: 10000, selected: false },
    { id: 'telebirr', name: 'Tele Birr', price: 10000, selected: false },
    { id: 'international', name: 'International Payment Gateway', price: 10000, selected: false },
  ];

  // Pro services
  const proServices: ProService[] = [
    { id: 'seo', name: 'SEO (Search Engine Optimization)', price: 4000, enabled: false },
    { id: 'analytics', name: 'Google Analytics', price: 3000, enabled: false },
    { id: 'content', name: 'Website Content Creation', price: 2000, enabled: false },
    { id: 'blog', name: 'Blog Platform', price: 3000, enabled: false },
    { id: 'membership', name: 'Membership', price: 2500, enabled: false },
    { id: 'booking', name: 'Booking', price: 5000, enabled: false },
    { id: 'multivendor', name: 'Multi Vendor for E-commerce', price: 4000, enabled: false },
  ];

  // Pages
  const basePages: Page[] = [
    { id: 'about', name: 'About Us', price: 1000, selected: false },
    { id: 'contact', name: 'Contact Us', price: 1000, selected: false },
    { id: 'service', name: 'Service Page', price: 1000, selected: false },
  ];

  // State
  const [selectedWebsiteType, setSelectedWebsiteType] = useState(''); // Changed from websiteTypes[0].id
  const [pages, setPages] = useState<Page[]>(basePages);
  const [paymentSystem, setPaymentSystem] = useState(paymentSystems);
  const [additionalProServices, setAdditionalProServices] = useState<ProService[]>(proServices);
  const [additionalPages, setAdditionalPages] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calculate total price
  useEffect(() => {
    let total = 0;
    
    // Add website type price
    const websiteType = websiteTypes.find(type => type.id === selectedWebsiteType);
    if (websiteType) {
      total += websiteType.price;
    }
    
    // Add selected pages price
    pages.forEach(page => {
      if (page.selected) {
        total += page.price;
      }
    });
    
    // Add additional pages price
    total += additionalPages * 1000;
    
    // Add payment systems price
    paymentSystem.forEach(payment => {
      if (payment.selected) {
        total += payment.price;
      }
    });
    
    // Add pro services price
    additionalProServices.forEach(service => {
      if (service.enabled) {
        total += service.price;
      }
    });
    
    setTotalPrice(total);
  }, [selectedWebsiteType, pages, additionalPages, paymentSystem, additionalProServices]);

  // Handle page selection
  const handlePageToggle = (id: string) => {
    setPages(pages.map(page => 
      page.id === id ? { ...page, selected: !page.selected } : page
    ));
  };

  // Handle payment system selection
  const handlePaymentToggle = (id: string) => {
    setPaymentSystem(paymentSystem.map(payment => 
      payment.id === id ? { ...payment, selected: !payment.selected } : payment
    ));
  };

  // Handle pro service toggle
  const handleProServiceToggle = (id: string) => {
    setAdditionalProServices(additionalProServices.map(service => 
      service.id === id ? { ...service, enabled: !service.enabled } : service
    ));
  };

  // Get selected website type details
  const getSelectedWebsiteType = () => {
    return websiteTypes.find(type => type.id === selectedWebsiteType) || null; // Changed to return null if none selected
  };

  // Get selected pages
  const getSelectedPages = () => {
    return pages.filter(page => page.selected);
  };

  // Get selected payment systems
  const getSelectedPaymentSystems = () => {
    return paymentSystem.filter(payment => payment.selected);
  };

  // Get enabled pro services
  const getEnabledProServices = () => {
    return additionalProServices.filter(service => service.enabled);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8 md:mb-12">
        Price <span className="text-purple-600">Calculator</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6 md:space-y-8">
          {/* Website Type */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Website Type</h3>
            <select
              value={selectedWebsiteType}
              onChange={(e) => setSelectedWebsiteType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a website type</option>
              {websiteTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {type.price.toLocaleString()} Birr
                </option>
              ))}
            </select>
          </div>

          {/* Pages */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Pages</h3>
            <div className="space-y-2 md:space-y-3 mb-4">
              {pages.map((page) => (
                <div key={page.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={page.id}
                    checked={page.selected}
                    onChange={() => handlePageToggle(page.id)}
                    className="h-4 w-4 md:h-5 md:w-5 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <label htmlFor={page.id} className="ml-2 md:ml-3 block text-sm md:text-base text-gray-700">
                    {page.name} - {page.price.toLocaleString()} Birr
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 mb-2 text-sm md:text-base">
                Additional Pages: {additionalPages} (Each 1,000 Birr)
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => setAdditionalPages(Math.max(0, additionalPages - 1))}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-300 text-sm md:text-base"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={additionalPages}
                  onChange={(e) => setAdditionalPages(Math.max(0, parseInt(e.target.value) || 0))}
                  className="border-t border-b border-gray-300 px-3 md:px-4 py-1 w-16 md:w-20 text-center text-sm md:text-base"
                />
                <button
                  onClick={() => setAdditionalPages(additionalPages + 1)}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-300 text-sm md:text-base"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Payment System */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Payment System</h3>
            <div className="space-y-2 md:space-y-3">
              {paymentSystem.map((payment) => (
                <div key={payment.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={payment.id}
                    checked={payment.selected}
                    onChange={() => handlePaymentToggle(payment.id)}
                    className="h-4 w-4 md:h-5 md:w-5 text-purple-600 focus:ring-purple-500 rounded"
                  />
                  <label htmlFor={payment.id} className="ml-2 md:ml-3 block text-sm md:text-base text-gray-700">
                    {payment.name} - {payment.price.toLocaleString()} Birr
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Pro Services */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Additional Pro Services</h3>
            <div className="space-y-3 md:space-y-4">
              {additionalProServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                  <label htmlFor={service.id} className="block text-sm md:text-base text-gray-700">
                    {service.name}
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2 md:mr-3 text-gray-600 text-sm">{service.price.toLocaleString()} Birr</span>
                    <button
                      onClick={() => handleProServiceToggle(service.id)}
                      className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none ${
                        service.enabled ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                          service.enabled ? 'translate-x-4 md:translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="bg-gradient-to-br from-[#2C40F3]/5 to-[#C1BBF4]/5 p-4 md:p-6 rounded-2xl border border-purple-100">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">Total Summary</h3>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 md:py-3 text-gray-700 font-semibold text-sm md:text-base">Item</th>
                  <th className="text-right py-2 md:py-3 text-gray-700 font-semibold text-sm md:text-base">Price</th>
                </tr>
              </thead>
              <tbody>
                {/* Website Type */}
                {getSelectedWebsiteType() && (
                  <tr>
                    <td className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">{getSelectedWebsiteType()?.name}</td>
                    <td className="py-2 md:py-3 text-right text-gray-900 text-sm md:text-base">{getSelectedWebsiteType()?.price.toLocaleString()} Birr</td>
                  </tr>
                )}
                
                {/* Selected Pages */}
                {getSelectedPages().map((page) => (
                  <tr key={page.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {page.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{page.price.toLocaleString()} Birr</td>
                  </tr>
                ))}
                
                {/* Additional Pages */}
                {additionalPages > 0 && (
                  <tr>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• Additional Pages ({additionalPages})</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{(additionalPages * 1000).toLocaleString()} Birr</td>
                  </tr>
                )}
                
                {/* Payment Systems */}
                {getSelectedPaymentSystems().map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {payment.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{payment.price.toLocaleString()} Birr</td>
                  </tr>
                ))}
                
                {/* Pro Services */}
                {getEnabledProServices().map((service) => (
                  <tr key={service.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {service.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{service.price.toLocaleString()} Birr</td>
                  </tr>
                ))}
                
                {/* Total */}
                <tr className="border-t border-gray-200 mt-2 md:mt-4">
                  <td className="py-3 md:py-4 text-base md:text-lg font-bold text-gray-900">Total (without VAT)</td>
                  <td className="py-3 md:py-4 text-right text-base md:text-lg font-bold text-purple-600">
                    {totalPrice.toLocaleString()} Birr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 md:mt-8 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base"
            >
              Request Quote
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}