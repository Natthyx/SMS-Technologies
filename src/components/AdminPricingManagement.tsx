import { useState, useEffect } from 'react';
import { 
  getWebsiteTypes, 
  createWebsiteType, 
  updateWebsiteType, 
  deleteWebsiteType,
  getPageTypes,
  createPageType,
  updatePageType,
  deletePageType,
  getPaymentSystems,
  createPaymentSystem,
  updatePaymentSystem,
  deletePaymentSystem,
  getProServices,
  createProService,
  updateProService,
  deleteProService,
  WebsiteType,
  PageType,
  PaymentSystem,
  ProService
} from '../api/pricingApi';
import { getQuoteRequests } from '../api/quoteRequests';

export default function AdminPricingManagement() {
  // State for each data type
  const [websiteTypes, setWebsiteTypes] = useState<WebsiteType[]>([]);
  const [pageTypes, setPageTypes] = useState<PageType[]>([]);
  const [paymentSystems, setPaymentSystems] = useState<PaymentSystem[]>([]);
  const [proServices, setProServices] = useState<ProService[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
  const [selectedQuoteRequest, setSelectedQuoteRequest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'pricing' | 'quotes'>('pricing');
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newWebsiteType, setNewWebsiteType] = useState({ name: '', price: 0, includedPageIds: [] as string[] });
  const [newPageType, setNewPageType] = useState({ name: '', price: 0 });
  const [newPaymentSystem, setNewPaymentSystem] = useState({ name: '', price: 0 });
  const [newProService, setNewProService] = useState({ name: '', price: 0 });
  
  // Editing states
  const [editingItem, setEditingItem] = useState<{type: string, id: string, data: any} | null>(null);

  // Fetch all pricing data
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
        setError(null);
      } catch (err) {
        console.error('Error fetching pricing data:', err);
        setError('Failed to load pricing data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch quote requests
  useEffect(() => {
    const fetchQuoteRequests = async () => {
      try {
        const result = await getQuoteRequests();
        if (result.success) {
          setQuoteRequests(result.data || []);
        }
      } catch (err) {
        console.error('Error fetching quote requests:', err);
      }
    };

    if (activeTab === 'quotes') {
      fetchQuoteRequests();
    }
  }, [activeTab]);

  // Handle form submissions
  const handleCreateWebsiteType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await createWebsiteType(newWebsiteType);
      setWebsiteTypes([...websiteTypes, { ...newWebsiteType, id }]);
      setNewWebsiteType({ name: '', price: 0, includedPageIds: [] });
    } catch (err) {
      console.error('Error creating website type:', err);
      setError('Failed to create website type. Please try again.');
    }
  };

  const handleCreatePageType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await createPageType(newPageType);
      setPageTypes([...pageTypes, { ...newPageType, id }]);
      setNewPageType({ name: '', price: 0 });
    } catch (err) {
      console.error('Error creating page type:', err);
      setError('Failed to create page type. Please try again.');
    }
  };

  const handleCreatePaymentSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await createPaymentSystem(newPaymentSystem);
      setPaymentSystems([...paymentSystems, { ...newPaymentSystem, id }]);
      setNewPaymentSystem({ name: '', price: 0 });
    } catch (err) {
      console.error('Error creating payment system:', err);
      setError('Failed to create payment system. Please try again.');
    }
  };

  const handleCreateProService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = await createProService(newProService);
      setProServices([...proServices, { ...newProService, id }]);
      setNewProService({ name: '', price: 0 });
    } catch (err) {
      console.error('Error creating pro service:', err);
      setError('Failed to create pro service. Please try again.');
    }
  };

  // Handle updates
  const handleUpdate = async (type: string, id: string, data: any) => {
    try {
      switch (type) {
        case 'websiteType':
          await updateWebsiteType(id, data);
          setWebsiteTypes(websiteTypes.map(item => item.id === id ? { ...item, ...data } : item));
          break;
        case 'pageType':
          await updatePageType(id, data);
          setPageTypes(pageTypes.map(item => item.id === id ? { ...item, ...data } : item));
          break;
        case 'paymentSystem':
          await updatePaymentSystem(id, data);
          setPaymentSystems(paymentSystems.map(item => item.id === id ? { ...item, ...data } : item));
          break;
        case 'proService':
          await updateProService(id, data);
          setProServices(proServices.map(item => item.id === id ? { ...item, ...data } : item));
          break;
      }
      setEditingItem(null);
    } catch (err) {
      console.error(`Error updating ${type}:`, err);
      setError(`Failed to update ${type}. Please try again.`);
    }
  };

  // Handle deletes
  const handleDelete = async (type: string, id: string) => {
    try {
      switch (type) {
        case 'websiteType':
          await deleteWebsiteType(id);
          setWebsiteTypes(websiteTypes.filter(item => item.id !== id));
          break;
        case 'pageType':
          await deletePageType(id);
          setPageTypes(pageTypes.filter(item => item.id !== id));
          break;
        case 'paymentSystem':
          await deletePaymentSystem(id);
          setPaymentSystems(paymentSystems.filter(item => item.id !== id));
          break;
        case 'proService':
          await deleteProService(id);
          setProServices(proServices.filter(item => item.id !== id));
          break;
      }
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      setError(`Failed to delete ${type}. Please try again.`);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Toggle page inclusion for website type
  const toggleIncludedPage = (websiteTypeId: string, pageId: string) => {
    setWebsiteTypes(websiteTypes.map(websiteType => {
      if (websiteType.id === websiteTypeId) {
        const includedPageIds = websiteType.includedPageIds || [];
        const newIncludedPageIds = includedPageIds.includes(pageId)
          ? includedPageIds.filter(id => id !== pageId)
          : [...includedPageIds, pageId];
        return { ...websiteType, includedPageIds: newIncludedPageIds };
      }
      return websiteType;
    }));
  };

  // Toggle page inclusion for new website type form
  const toggleNewWebsiteTypePage = (pageId: string) => {
    const includedPageIds = newWebsiteType.includedPageIds || [];
    const newIncludedPageIds = includedPageIds.includes(pageId)
      ? includedPageIds.filter(id => id !== pageId)
      : [...includedPageIds, pageId];
    setNewWebsiteType({ ...newWebsiteType, includedPageIds: newIncludedPageIds });
  };

  // Toggle page inclusion for editing website type
  const toggleEditingWebsiteTypePage = (pageId: string) => {
    if (editingItem && editingItem.type === 'websiteType') {
      const includedPageIds = editingItem.data.includedPageIds || [];
      const newIncludedPageIds = includedPageIds.includes(pageId)
        ? includedPageIds.filter(id => id !== pageId)
        : [...includedPageIds, pageId];
      setEditingItem({
        ...editingItem,
        data: { ...editingItem.data, includedPageIds: newIncludedPageIds }
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pricing'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pricing Management
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotes'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quote Requests ({quoteRequests.length})
          </button>
        </nav>
      </div>

      {activeTab === 'pricing' ? (
        /* Pricing Management Tab */
        <div className="space-y-8">
          {/* Website Types Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Website Types</h3>
            
            {/* Create Form */}
            <form onSubmit={handleCreateWebsiteType} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newWebsiteType.name}
                    onChange={(e) => setNewWebsiteType({...newWebsiteType, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Birr)</label>
                  <input
                    type="number"
                    value={newWebsiteType.price}
                    onChange={(e) => setNewWebsiteType({...newWebsiteType, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add Website Type
                  </button>
                </div>
              </div>
              
              {/* Included Pages Selection */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Included Pages</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {pageTypes.map(page => (
                    <div key={page.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`new-website-page-${page.id}`}
                        checked={newWebsiteType.includedPageIds?.includes(page.id || '') || false}
                        onChange={() => toggleNewWebsiteTypePage(page.id || '')}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <label htmlFor={`new-website-page-${page.id}`} className="ml-2 text-sm text-gray-700">
                        {page.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            
            {/* List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Birr)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Included Pages</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {websiteTypes.map((item) => (
                    <tr key={item.id}>
                      {editingItem?.type === 'websiteType' && editingItem?.id === item.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingItem.data.name}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingItem.data.price}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(e.target.value)}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-1">
                              {pageTypes.map(page => (
                                <div key={page.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`edit-website-page-${page.id}`}
                                    checked={editingItem.data.includedPageIds?.includes(page.id || '') || false}
                                    onChange={() => toggleEditingWebsiteTypePage(page.id || '')}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                                  />
                                  <label htmlFor={`edit-website-page-${page.id}`} className="ml-1 text-xs text-gray-700">
                                    {page.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleUpdate('websiteType', item.id!, editingItem.data)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-1">
                              {item.includedPageIds?.map(pageId => {
                                const page = pageTypes.find(p => p.id === pageId);
                                return page ? (
                                  <span key={pageId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {page.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingItem({type: 'websiteType', id: item.id!, data: {...item}})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('websiteType', item.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Page Types Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Page Types</h3>
            
            {/* Create Form */}
            <form onSubmit={handleCreatePageType} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newPageType.name}
                    onChange={(e) => setNewPageType({...newPageType, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Birr)</label>
                  <input
                    type="number"
                    value={newPageType.price}
                    onChange={(e) => setNewPageType({...newPageType, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add Page Type
                  </button>
                </div>
              </div>
            </form>
            
            {/* List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Birr)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageTypes.map((item) => (
                    <tr key={item.id}>
                      {editingItem?.type === 'pageType' && editingItem?.id === item.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingItem.data.name}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingItem.data.price}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(e.target.value)}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleUpdate('pageType', item.id!, editingItem.data)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingItem({type: 'pageType', id: item.id!, data: {...item}})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('pageType', item.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Payment Systems Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Systems</h3>
            
            {/* Create Form */}
            <form onSubmit={handleCreatePaymentSystem} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newPaymentSystem.name}
                    onChange={(e) => setNewPaymentSystem({...newPaymentSystem, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Birr)</label>
                  <input
                    type="number"
                    value={newPaymentSystem.price}
                    onChange={(e) => setNewPaymentSystem({...newPaymentSystem, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add Payment System
                  </button>
                </div>
              </div>
            </form>
            
            {/* List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Birr)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentSystems.map((item) => (
                    <tr key={item.id}>
                      {editingItem?.type === 'paymentSystem' && editingItem?.id === item.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingItem.data.name}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingItem.data.price}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(e.target.value)}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleUpdate('paymentSystem', item.id!, editingItem.data)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingItem({type: 'paymentSystem', id: item.id!, data: {...item}})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('paymentSystem', item.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pro Services Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Pro Services</h3>
            
            {/* Create Form */}
            <form onSubmit={handleCreateProService} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newProService.name}
                    onChange={(e) => setNewProService({...newProService, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Birr)</label>
                  <input
                    type="number"
                    value={newProService.price}
                    onChange={(e) => setNewProService({...newProService, price: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                    min="0"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add Pro Service
                  </button>
                </div>
              </div>
            </form>
            
            {/* List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Birr)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {proServices.map((item) => (
                    <tr key={item.id}>
                      {editingItem?.type === 'proService' && editingItem?.id === item.id ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingItem.data.name}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, name: e.target.value}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={editingItem.data.price}
                              onChange={(e) => setEditingItem({...editingItem, data: {...editingItem.data, price: Number(e.target.value)}})}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                              min="0"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleUpdate('proService', item.id!, editingItem.data)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setEditingItem({type: 'proService', id: item.id!, data: {...item}})}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('proService', item.id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : selectedQuoteRequest ? (
        /* Quote Request Detail View */
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Quote Request Details</h3>
            <button
              onClick={() => setSelectedQuoteRequest(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to List
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Request Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted</p>
                  <p className="text-sm text-gray-900">
                    {selectedQuoteRequest.submittedAt 
                      ? new Date(selectedQuoteRequest.submittedAt).toLocaleString() 
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website Type</p>
                  <p className="text-sm text-gray-900">
                    {selectedQuoteRequest.websiteType?.name || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Price</p>
                  <p className="text-sm text-gray-900">
                    {selectedQuoteRequest.totalPrice?.toLocaleString() || 0} Birr
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Services</h4>
              <div className="space-y-3">
                {selectedQuoteRequest.paymentSystems?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Systems</p>
                    <ul className="text-sm text-gray-900 list-disc list-inside">
                      {selectedQuoteRequest.paymentSystems.map((system: any, index: number) => (
                        <li key={index}>{system.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedQuoteRequest.proServices?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pro Services</p>
                    <ul className="text-sm text-gray-900 list-disc list-inside">
                      {selectedQuoteRequest.proServices.map((service: any, index: number) => (
                        <li key={index}>{service.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Pages</h4>
            
            {selectedQuoteRequest.includedPages?.length > 0 && (
              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-700 mb-2">Included Pages</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedQuoteRequest.includedPages.map((page: any, index: number) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                    >
                      {page.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedQuoteRequest.additionalPages?.length > 0 && (
              <div className="mb-6">
                <h5 className="text-md font-medium text-gray-700 mb-2">Additional Pages</h5>
                <ul className="text-sm text-gray-900 list-disc list-inside">
                  {selectedQuoteRequest.additionalPages.map((page: any, index: number) => (
                    <li key={index}>{page.name}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedQuoteRequest.customAdditionalPages?.length > 0 && (
              <div>
                <h5 className="text-md font-medium text-gray-700 mb-2">Custom Additional Pages</h5>
                <div className="space-y-3">
                  {selectedQuoteRequest.customAdditionalPages.map((page: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h6 className="font-medium text-gray-900">{page.title}</h6>
                      <p className="text-sm text-gray-700 mt-1">{page.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Quote Requests List View */
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quote Requests</h3>
          
          {quoteRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No quote requests yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quoteRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.submittedAt 
                          ? new Date(request.submittedAt).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.websiteType?.name || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.totalPrice?.toLocaleString() || 0} Birr
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setSelectedQuoteRequest(request)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}