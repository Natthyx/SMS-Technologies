import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  getWebsiteTypes, 
  getPageTypes, 
  getPaymentSystems, 
  getProServices,
  WebsiteType,
  PageType,
  PaymentSystem,
  ProService
} from '../api/pricingApi';
import { saveQuoteRequest } from '../api/quoteRequests';

interface Page {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

// Create local interfaces that extend the API types with UI state
interface PageLocal extends PageType {
  selected: boolean;
}

interface PaymentSystemLocal extends PaymentSystem {
  selected: boolean;
}

interface ProServiceLocal extends ProService {
  enabled: boolean;
}

interface AdditionalPageDetails {
  id: string;
  title: string;
  description: string;
}

export default function PriceCalculator() {
  // State for dynamic data
  const [websiteTypes, setWebsiteTypes] = useState<WebsiteType[]>([]);
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);
  const [paymentSystems, setPaymentSystems] = useState<PaymentSystem[]>([]);
  const [proServices, setProServices] = useState<ProService[]>([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [selectedWebsiteType, setSelectedWebsiteType] = useState('');
  const [pages, setPages] = useState<PageLocal[]>([]);
  const [paymentSystem, setPaymentSystem] = useState<PaymentSystemLocal[]>([]);
  const [additionalProServices, setAdditionalProServices] = useState<ProServiceLocal[]>([]);
  const [additionalPages, setAdditionalPages] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // State for included pages
  const [includedPages, setIncludedPages] = useState<string[]>([]);

  // State for additional page details
  const [additionalPageDetails, setAdditionalPageDetails] = useState<AdditionalPageDetails[]>([]);

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Fetch pricing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [websiteTypesData, pageTypesData, paymentSystemsData, proServicesData] = await Promise.all([
          getWebsiteTypes(),
          getPageTypes(),
          getPaymentSystems(),
          getProServices()
        ]);
        
        setWebsiteTypes(websiteTypesData);
        setPageTypes(pageTypesData);
        setPaymentSystems(paymentSystemsData);
        setProServices(proServicesData);
        
        // Initialize pages state
        const initialPages = pageTypesData.map(page => ({
          ...page,
          selected: false
        }));
        setPages(initialPages);
        
        // Initialize payment systems state
        const initialPaymentSystems = paymentSystemsData.map(payment => ({
          ...payment,
          selected: false
        }));
        setPaymentSystem(initialPaymentSystems);
        
        // Initialize pro services state
        const initialProServices = proServicesData.map(service => ({
          ...service,
          enabled: false
        }));
        setAdditionalProServices(initialProServices);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError('Failed to load pricing data. Using default values.');
        // Fallback to default values
        setDefaultValues();
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Set default values in case of error
  const setDefaultValues = () => {
    // Default website types
    const defaultWebsiteTypes: WebsiteType[] = [
      { id: 'basic', name: 'Basic Company', price: 7000 },
      { id: 'ecommerce', name: 'E-commerce website', price: 20000 },
      { id: 'realestate', name: 'Real State website', price: 25000 },
      { id: 'mobile', name: 'Mobile App', price: 40000 },
    ];
    setWebsiteTypes(defaultWebsiteTypes);
    
    // Default page types
    const defaultPageTypes: PageType[] = [
      { id: 'about', name: 'About Us', price: 1000 },
      { id: 'contact', name: 'Contact Us', price: 1000 },
      { id: 'service', name: 'Service Page', price: 1000 },
    ];
    setPageTypes(defaultPageTypes);
    
    // Initialize pages state
    const initialPages = defaultPageTypes.map(page => ({
      ...page,
      selected: false
    }));
    setPages(initialPages);
    
    // Default payment systems
    const defaultPaymentSystems: PaymentSystem[] = [
      { id: 'chapa', name: 'Chapa', price: 10000 },
      { id: 'telebirr', name: 'Tele Birr', price: 10000 },
      { id: 'international', name: 'International Payment Gateway', price: 10000 },
    ];
    setPaymentSystems(defaultPaymentSystems);
    
    // Initialize payment systems state
    const initialPaymentSystems = defaultPaymentSystems.map(payment => ({
      ...payment,
      selected: false
    }));
    setPaymentSystem(initialPaymentSystems);
    
    // Default pro services
    const defaultProServices: ProService[] = [
      { id: 'seo', name: 'SEO (Search Engine Optimization)', price: 4000 },
      { id: 'analytics', name: 'Google Analytics', price: 3000 },
      { id: 'content', name: 'Website Content Creation', price: 2000 },
      { id: 'blog', name: 'Blog Platform', price: 3000 },
      { id: 'membership', name: 'Membership', price: 2500 },
      { id: 'booking', name: 'Booking', price: 5000 },
      { id: 'multivendor', name: 'Multi Vendor for E-commerce', price: 4000 },
    ];
    setProServices(defaultProServices);
    
    // Initialize pro services state
    const initialProServices = defaultProServices.map(service => ({
      ...service,
      enabled: false
    }));
    setAdditionalProServices(initialProServices);
  };

  // Handle website type selection
  const handleWebsiteTypeChange = (websiteTypeId: string) => {
    setSelectedWebsiteType(websiteTypeId);
    
    // Find the selected website type and get its included pages
    const selectedType = websiteTypes.find(type => type.id === websiteTypeId);
    if (selectedType && selectedType.includedPageIds) {
      setIncludedPages(selectedType.includedPageIds);
      
      // Update pages state to select included pages and deselect others
      setPages(pages.map(page => {
        if (!page.id) return page;
        return {
          ...page,
          selected: selectedType.includedPageIds?.includes(page.id) || false
        };
      }));
    } else {
      setIncludedPages([]);
      // Deselect all pages if no website type is selected
      setPages(pages.map(page => ({ ...page, selected: false })));
    }
  };

  // Calculate total price
  useEffect(() => {
    let total = 0;
    
    // Add website type price
    const websiteType = websiteTypes.find(type => type.id === selectedWebsiteType);
    if (websiteType) {
      total += websiteType.price;
    }
    
    // Add selected pages price (only for pages that are NOT included)
    pages.forEach(page => {
      if (page.selected && page.id && !includedPages.includes(page.id)) {
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
  }, [selectedWebsiteType, pages, additionalPages, paymentSystem, additionalProServices, websiteTypes, includedPages]);

  // Handle page selection with details management
  const handlePageToggle = (id: string | undefined) => {
    if (!id) return;
    
    const isCurrentlySelected = pages.find(page => page.id === id)?.selected;
    
    setPages(pages.map(page => 
      page.id === id ? { ...page, selected: !page.selected } : page
    ));
    
    // If page is selected, add it to additionalPageDetails
    if (!isCurrentlySelected) {
      setAdditionalPageDetails(prev => {
        // Check if the page is already in the array to avoid duplicates
        if (!prev.some(page => page.id === id)) {
          return [
            ...prev,
            { id, title: '', description: '' }
          ];
        }
        return prev;
      });
    } 
    // If page is deselected, remove it from additionalPageDetails
    else {
      setAdditionalPageDetails(prev => prev.filter(page => page.id !== id));
    }
  };

  // Handle additional page details change
  const handleAdditionalPageDetailsChange = (id: string, field: 'title' | 'description', value: string) => {
    setAdditionalPageDetails(prev => {
      // Check if the page already exists in the array
      const existingIndex = prev.findIndex(page => page.id === id);
      
      if (existingIndex !== -1) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], [field]: value };
        return updated;
      } else {
        // Add new entry
        return [...prev, { id, [field]: value, title: field === 'title' ? value : '', description: field === 'description' ? value : '' }];
      }
    });
  };

  // Handle payment system selection
  const handlePaymentToggle = (id: string | undefined) => {
    if (!id) return;
    setPaymentSystem(paymentSystem.map(payment => 
      payment.id === id ? { ...payment, selected: !payment.selected } : payment
    ));
  };

  // Handle pro service toggle
  const handleProServiceToggle = (id: string | undefined) => {
    if (!id) return;
    setAdditionalProServices(additionalProServices.map(service => 
      service.id === id ? { ...service, enabled: !service.enabled } : service
    ));
  };

  // Get selected website type details
  const getSelectedWebsiteType = () => {
    return websiteTypes.find(type => type.id === selectedWebsiteType) || null;
  };

  // Get pages that are not included in the selected website type
  const getAvailablePages = () => {
    return pages.filter(page => page.id && !includedPages.includes(page.id));
  };

  // Get selected pages (excluding included ones)
  const getSelectedPages = () => {
    return pages.filter(page => page.selected && page.id && !includedPages.includes(page.id));
  };

  // Get selected payment systems
  const getSelectedPaymentSystems = () => {
    return paymentSystem.filter(payment => payment.selected);
  };

  // Get enabled pro services
  const getEnabledProServices = () => {
    return additionalProServices.filter(service => service.enabled);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Prepare data to send
      const requestData = {
        websiteType: getSelectedWebsiteType(),
        includedPages: includedPages.map(pageId => {
          const page = [...pageTypes, ...pages].find(p => p.id === pageId);
          return page ? { id: page.id, name: page.name } : { id: '', name: '' };
        }).filter(page => page.id || page.name),
        additionalPages: getSelectedPages().map(page => ({
          id: page.id,
          name: page.name,
          price: page.price
        })),
        customAdditionalPages: [...Array(additionalPages)].map((_, index) => {
          const details = additionalPageDetails.find(p => p.id === `additional-${index}`);
          return {
            title: details?.title || `Additional Page ${index + 1}`,
            description: details?.description || ''
          };
        }),
        paymentSystems: getSelectedPaymentSystems().map(payment => ({
          id: payment.id,
          name: payment.name,
          price: payment.price
        })),
        proServices: getEnabledProServices().map(service => ({
          id: service.id,
          name: service.name,
          price: service.price
        })),
        totalPrice: totalPrice,
        submittedAt: new Date().toISOString()
      };
      
      // Send data to Firebase using our API
      const result = await saveQuoteRequest(requestData);
      
      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setSelectedWebsiteType('');
        setIncludedPages([]);
        setPages(pages.map(page => ({ ...page, selected: false })));
        setPaymentSystem(paymentSystem.map(payment => ({ ...payment, selected: false })));
        setAdditionalProServices(additionalProServices.map(service => ({ ...service, enabled: false })));
        setAdditionalPages(0);
        setAdditionalPageDetails([]);
      } else {
        throw new Error(result.error || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('Error submitting quote request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset status after delay
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-6xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

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
              onChange={(e) => handleWebsiteTypeChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a website type</option>
              {websiteTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} - {(type.price || 0).toLocaleString()} Birr
                </option>
              ))}
            </select>
            
            {/* Show included pages */}
            {includedPages.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Included Pages:</h4>
                <div className="flex flex-wrap gap-2">
                  {includedPages.map(pageId => {
                    const page = [...pageTypes, ...pages].find(p => p.id === pageId);
                    return page ? (
                      <span key={pageId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {page.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="text-xs text-purple-600 mt-2">These pages are included in the base price and cannot be deselected.</p>
              </div>
            )}
          </div>

          {/* Pages */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Additional Pages</h3>
            {includedPages.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Included with your website:</h4>
                <div className="flex flex-wrap gap-2">
                  {includedPages.map(pageId => {
                    const page = [...pageTypes, ...pages].find(p => p.id === pageId);
                    return page ? (
                      <span key={pageId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {page.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            
            {getAvailablePages().length > 0 ? (
              <div className="space-y-2 md:space-y-3 mb-4">
                {getAvailablePages().map((page) => (
                  <div key={page.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={page.id || ''}
                      checked={page.selected}
                      onChange={() => page.id && handlePageToggle(page.id)}
                      className="h-4 w-4 md:h-5 md:w-5 text-purple-600 focus:ring-purple-500 rounded"
                      disabled={!page.id}
                    />
                    <label 
                      htmlFor={page.id || ''} 
                      className="ml-2 md:ml-3 block text-sm md:text-base text-gray-700"
                    >
                      {page.name} - {(page.price || 0).toLocaleString()} Birr
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm italic">No additional pages available for this website type.</p>
            )}
            
            {/* Additional Pages Counter */}
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
              
              {/* Additional page details form for counter pages - appears when additional pages > 0 */}
              {additionalPages > 0 && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Page Details</h4>
                  <div className="space-y-3">
                    {[...Array(additionalPages)].map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Page Title
                          </label>
                          <input
                            type="text"
                            value={additionalPageDetails.find(p => p.id === `additional-${index}`)?.title || ''}
                            onChange={(e) => handleAdditionalPageDetailsChange(`additional-${index}`, 'title', e.target.value)}
                            placeholder="Enter page title"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={additionalPageDetails.find(p => p.id === `additional-${index}`)?.description || ''}
                            onChange={(e) => handleAdditionalPageDetailsChange(`additional-${index}`, 'description', e.target.value)}
                            placeholder="Enter page description"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    id={payment.id || ''}
                    checked={payment.selected}
                    onChange={() => payment.id && handlePaymentToggle(payment.id)}
                    className="h-4 w-4 md:h-5 md:w-5 text-purple-600 focus:ring-purple-500 rounded"
                    disabled={!payment.id}
                  />
                  <label htmlFor={payment.id || ''} className="ml-2 md:ml-3 block text-sm md:text-base text-gray-700">
                    {payment.name} - {(payment.price || 0).toLocaleString()} Birr
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
                  <label htmlFor={service.id || ''} className="block text-sm md:text-base text-gray-700">
                    {service.name}
                  </label>
                  <div className="flex items-center">
                    <span className="mr-2 md:mr-3 text-gray-600 text-sm">{(service.price || 0).toLocaleString()} Birr</span>
                    <button
                      onClick={() => service.id && handleProServiceToggle(service.id)}
                      disabled={!service.id}
                      className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none ${
                        service.enabled ? 'bg-purple-600' : 'bg-gray-300'
                      } ${!service.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    <td className="py-2 md:py-3 text-right text-gray-900 text-sm md:text-base">{(getSelectedWebsiteType()?.price || 0).toLocaleString()} Birr</td>
                  </tr>
                )}
                
                {/* Included Pages */}
                {includedPages.length > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">Included Pages</td>
                  </tr>
                )}
                {includedPages.map(pageId => {
                  const page = [...pageTypes, ...pages].find(p => p.id === pageId);
                  return page ? (
                    <tr key={`included-${pageId}`}>
                      <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {page.name}</td>
                      <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">Included</td>
                    </tr>
                  ) : null;
                })}
                
                {/* Additional Pages from checkboxes */}
                {getSelectedPages().length > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">Additional Pages</td>
                  </tr>
                )}
                {getSelectedPages().map((page) => (
                  <tr key={page.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {page.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{(page.price || 0).toLocaleString()} Birr</td>
                  </tr>
                ))}
                
                {/* Additional Simple Pages */}
                {additionalPages > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">Custom Additional Pages</td>
                  </tr>
                )}
                {additionalPages > 0 && [...Array(additionalPages)].map((_, index) => {
                  const details = additionalPageDetails.find(p => p.id === `additional-${index}`);
                  return (
                    <tr key={`additional-${index}`}>
                      <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">
                        • {details?.title || `Additional Page ${index + 1}`}
                        {details?.description && (
                          <div className="mt-1 text-xs text-gray-500">
                            {details.description}
                          </div>
                        )}
                      </td>
                      <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">1,000 Birr</td>
                    </tr>
                  );
                })}
                
                {/* Payment Systems */}
                {getSelectedPaymentSystems().length > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">Payment Systems</td>
                  </tr>
                )}
                {getSelectedPaymentSystems().map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {payment.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{(payment.price || 0).toLocaleString()} Birr</td>
                  </tr>
                ))}
                
                {/* Pro Services */}
                {getEnabledProServices().length > 0 && (
                  <tr>
                    <td colSpan={2} className="py-2 md:py-3 text-gray-900 font-medium text-sm md:text-base">Pro Services</td>
                  </tr>
                )}
                {getEnabledProServices().map((service) => (
                  <tr key={service.id}>
                    <td className="py-1 md:py-2 text-gray-700 pl-4 text-xs md:text-sm">• {service.name}</td>
                    <td className="py-1 md:py-2 text-right text-gray-700 text-xs md:text-sm">{(service.price || 0).toLocaleString()} Birr</td>
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
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full md:w-auto font-bold py-2 md:py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Request Quote'}
            </motion.button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                Quote request sent successfully! We'll contact you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                Error sending quote request. Please try again.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
