'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Package, MessageSquare, X } from 'lucide-react';
import { Locale } from '@/i18n';

interface AdminPageProps {
  params: Promise<{ locale: Locale }>;
}

interface Product {
  _id: string;
  name: { en: string; hi: string; mr: string };
  description: { en: string; hi: string; mr: string };
  category: string;
  images: string[];
  customizationOptions: {
    sizes: string[];
    materials: string[];
  };
  basePrice?: number;
  featured: boolean;
  active: boolean;
}

interface Enquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  productName: { en: string; hi: string; mr: string };
  customization: {
    size?: string;
    material?: string;
    quantity?: number;
    notes?: string;
  };
  fileUrl?: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: string;
}

type Tab = 'enquiries' | 'products';

export default function AdminPage({ params }: AdminPageProps) {
  const t = useTranslations();
  const locale = params.then(p => p.locale).catch(() => 'en' as Locale);
  
  const [activeTab, setActiveTab] = useState<Tab>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    nameEn: '',
    nameHi: '',
    nameMr: '',
    descriptionEn: '',
    descriptionHi: '',
    descriptionMr: '',
    category: '',
    sizes: '',
    materials: '',
    basePrice: '',
    featured: false,
    active: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enquiriesRes, productsRes] = await Promise.all([
        fetch('/api/enquiries'),
        fetch('/api/products'),
      ]);
      const enquiriesData = await enquiriesRes.json();
      const productsData = await productsRes.json();
      setEnquiries(enquiriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
      setEnquiries(enquiries.filter((e) => e._id !== id));
    } catch (error) {
      console.error('Error deleting enquiry:', error);
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setEnquiries(enquiries.map((e) => (e._id === id ? { ...e, status } : e)));
    } catch (error) {
      console.error('Error updating enquiry:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      nameEn: product.name.en,
      nameHi: product.name.hi,
      nameMr: product.name.mr,
      descriptionEn: product.description.en,
      descriptionHi: product.description.hi,
      descriptionMr: product.description.mr,
      category: product.category,
      sizes: product.customizationOptions.sizes.join(', '),
      materials: product.customizationOptions.materials.join(', '),
      basePrice: product.basePrice?.toString() || '',
      featured: product.featured,
      active: product.active,
    });
    setShowProductModal(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      nameEn: '',
      nameHi: '',
      nameMr: '',
      descriptionEn: '',
      descriptionHi: '',
      descriptionMr: '',
      category: '',
      sizes: '',
      materials: '',
      basePrice: '',
      featured: false,
      active: true,
    });
    setShowProductModal(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: {
        en: productForm.nameEn,
        hi: productForm.nameHi,
        mr: productForm.nameMr,
      },
      description: {
        en: productForm.descriptionEn,
        hi: productForm.descriptionHi,
        mr: productForm.descriptionMr,
      },
      category: productForm.category,
      customizationOptions: {
        sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        materials: productForm.materials.split(',').map((m) => m.trim()).filter(Boolean),
      },
      basePrice: productForm.basePrice ? parseFloat(productForm.basePrice) : undefined,
      featured: productForm.featured,
      active: productForm.active,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        const updated = await res.json();
        setProducts(products.map((p) => (p._id === editingProduct._id ? updated : p)));
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        const created = await res.json();
        setProducts([...products, created]);
      }
      setShowProductModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 font-medium flex items-center space-x-2 ${
              activeTab === 'enquiries'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>{t('admin.enquiries')} ({enquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium flex items-center space-x-2 ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>{t('admin.products')} ({products.length})</span>
          </button>
        </div>

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customer')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.product')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.details')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {t('admin.noEnquiries')}
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry) => (
                      <tr key={enquiry._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{enquiry.name}</div>
                          <div className="text-sm text-gray-500">{enquiry.phone}</div>
                          <div className="text-sm text-gray-500">{enquiry.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {enquiry.productName.en}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {enquiry.customization.size && (
                            <div>Size: {enquiry.customization.size}</div>
                          )}
                          {enquiry.customization.material && (
                            <div>Material: {enquiry.customization.material}</div>
                          )}
                          {enquiry.customization.quantity && (
                            <div>Qty: {enquiry.customization.quantity}</div>
                          )}
                          {enquiry.fileUrl && (
                            <a
                              href={enquiry.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center mt-1"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download File
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={enquiry.status}
                            onChange={(e) =>
                              handleUpdateEnquiryStatus(
                                enquiry._id,
                                e.target.value as Enquiry['status']
                              )
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              enquiry.status
                            )} border-0 cursor-pointer`}
                          >
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteEnquiry(enquiry._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNewProduct}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>{t('admin.newProduct')}</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          {t('admin.noProducts')}
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name.en}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{product.name.en}</div>
                            {product.featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.basePrice ? `₹${product.basePrice}` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {product.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingProduct ? t('admin.editProduct') : t('admin.newProduct')}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.productName')}
                  </label>
                  <input
                    type="text"
                    value={productForm.nameEn}
                    onChange={(e) =>
                      setProductForm({ ...productForm, nameEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.productNameHi')}
                  </label>
                  <input
                    type="text"
                    value={productForm.nameHi}
                    onChange={(e) =>
                      setProductForm({ ...productForm, nameHi: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.productNameMr')}
                  </label>
                  <input
                    type="text"
                    value={productForm.nameMr}
                    onChange={(e) =>
                      setProductForm({ ...productForm, nameMr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.description')}
                  </label>
                  <textarea
                    value={productForm.descriptionEn}
                    onChange={(e) =>
                      setProductForm({ ...productForm, descriptionEn: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.descriptionHi')}
                  </label>
                  <textarea
                    value={productForm.descriptionHi}
                    onChange={(e) =>
                      setProductForm({ ...productForm, descriptionHi: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.descriptionMr')}
                  </label>
                  <textarea
                    value={productForm.descriptionMr}
                    onChange={(e) =>
                      setProductForm({ ...productForm, descriptionMr: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows={2}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.category')}
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="personal">Personal Designs</option>
                  <option value="acrylic">Acrylic Name Plates</option>
                  <option value="led">LED Signages</option>
                  <option value="standees">Standees</option>
                  <option value="stickers">Stickers</option>
                  <option value="hoardings">Hoardings</option>
                  <option value="banners">Banners</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.sizes')}
                  </label>
                  <input
                    type="text"
                    value={productForm.sizes}
                    onChange={(e) =>
                      setProductForm({ ...productForm, sizes: e.target.value })
                    }
                    placeholder="Small, Medium, Large"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.materials')}
                  </label>
                  <input
                    type="text"
                    value={productForm.materials}
                    onChange={(e) =>
                      setProductForm({ ...productForm, materials: e.target.value })
                    }
                    placeholder="Matte, Glossy, Premium"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.basePrice')}
                </label>
                <input
                  type="number"
                  value={productForm.basePrice}
                  onChange={(e) =>
                    setProductForm({ ...productForm, basePrice: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) =>
                      setProductForm({ ...productForm, featured: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('admin.featured')}
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) =>
                      setProductForm({ ...productForm, active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t('admin.active')}
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
