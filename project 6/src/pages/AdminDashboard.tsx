import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts, Product, Category } from '../contexts/ProductContext';
import { uploadImage, validateImageFile } from '../utils/imageUpload';
import { Plus, Edit, Trash2, LogOut, Save, X, Upload, Tag, AlertTriangle, Loader } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    categories,
    categoryObjects,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryUsageCount,
    loading: productsLoading,
    error: productsError
  } = useProducts();
  const navigate = useNavigate();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    size: '',
    color: '',
    price: '',
    category: '',
    image: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [categoryError, setCategoryError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      size: '',
      color: '',
      price: '',
      category: '',
      image: ''
    });
    setSelectedFile(null);
    setImagePreview('');
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '' });
    setEditingCategory(null);
    setCategoryError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCategoryFormData({ name: value });
    setCategoryError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setSubmitError(validationError);
        return;
      }
      
      setSubmitError(null);
      setSelectedFile(file);
      
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear the URL input when file is selected
      setFormData(prev => ({
        ...prev,
        image: ''
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const imageUrl = formData.image;
      
      // Check if we have an image URL
      if (!imageUrl) {
        throw new Error('Please provide an image URL');
      }
      
      const productData = {
        title: formData.title,
        size: formData.size,
        color: formData.color,
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl
      };
      
      setUploadProgress('Saving product...');
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      
      resetForm();
    } catch (error: any) {
      console.error('Error saving product:', error);
      setSubmitError(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError('');
    setIsSubmitting(true);
    
    try {
      let success = false;
      
      if (editingCategory) {
        success = await updateCategory(editingCategory.id, categoryFormData.name);
      } else {
        success = await addCategory(categoryFormData.name);
      }
      
      if (success) {
        resetCategoryForm();
      } else {
        setCategoryError('Category name already exists or is invalid');
      }
    } catch (error: any) {
      setCategoryError(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
    setFormData({
      title: product.title,
      size: product.size,
      color: product.color,
      price: product.price.toString(),
      category: product.category,
      image: product.image
    });
    setShowAddForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({ name: category.name });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
      } catch (error: any) {
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categoryObjects.find(cat => cat.id === id);
    if (!category) return;
    
    const usageCount = getCategoryUsageCount(category.name);
    if (usageCount > 0) {
      alert(`Cannot delete category "${category.name}" because it is used by ${usageCount} product(s). Please reassign or delete those products first.`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        await deleteCategory(id);
      } catch (error: any) {
        alert('Failed to delete category: ' + error.message);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Product Button */}
        <div className="mb-8">
          {productsError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-700 text-sm">{productsError}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={productsLoading}
              className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => setShowCategoryManager(true)}
              disabled={productsLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Tag className="h-5 w-5" />
              <span>Manage Categories</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  )}
                  
                  {uploadProgress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-2">
                      <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                      <p className="text-blue-700 text-sm">{uploadProgress}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter product title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Medium, Large, One Size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color *
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="e.g., Golden, Red & Gold, Multicolor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image *
                    </label>
                    <div className="space-y-4">
                      {/* Temporarily disabled file upload due to CORS issues */}
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 mb-2">
                          <strong>Note:</strong> File upload is temporarily disabled due to Firebase Storage configuration.
                        </p>
                        <p className="text-xs text-yellow-700">
                          Please use an image URL instead (recommended: Imgur, Cloudinary, or any direct image link).
                        </p>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setSelectedFile(null);
                              setFormData(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Image URL *
                        </label>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={(e) => {
                            handleInputChange(e);
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                              setSelectedFile(null);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          disabled={isSubmitting}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: Use direct image links from Imgur, Cloudinary, or any image hosting service.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>{editingProduct ? 'Update' : 'Add'} Product</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Products {productsLoading ? '(Loading...)' : `(${products.length})`}
            </h2>
          </div>

          {productsLoading ? (
            <div className="px-6 py-12 text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-600" />
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={product.image}
                            alt={product.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Size: {product.size}</div>
                        <div>Color: {product.color}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            disabled={isSubmitting}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">No products added yet.</p>
              <p className="text-gray-400 text-sm mt-2">
                Click "Add New Product" to get started.
              </p>
            </div>
          )}
        </div>
        {/* Category Manager Modal */}
        {showCategoryManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
                  <button
                    onClick={() => {
                      setShowCategoryManager(false);
                      resetCategoryForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Add/Edit Category Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    {categoryError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-sm">{categoryError}</p>
                      </div>
                    )}
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={handleCategoryInputChange}
                        required
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category name"
                      />
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="h-4 w-4 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>{editingCategory ? 'Update' : 'Add'}</span>
                          </>
                        )}
                      </button>
                      {editingCategory && (
                        <button
                          type="button"
                          onClick={resetCategoryForm}
                          disabled={isSubmitting}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Categories List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Existing Categories ({categoryObjects.length})
                  </h3>
                  {categoryObjects.length > 0 ? (
                    <div className="space-y-2">
                      {categoryObjects.map((category) => {
                        const usageCount = getCategoryUsageCount(category.name);
                        return (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="font-medium text-gray-900">{category.name}</span>
                                <span className="text-sm text-gray-500">
                                  ({usageCount} product{usageCount !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                Created: {new Date(category.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                                title="Edit category"
                                disabled={isSubmitting}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className={`p-2 rounded-full transition-colors duration-200 ${
                                  usageCount > 0 || isSubmitting
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                }`}
                                title={usageCount > 0 ? 'Cannot delete - category is in use' : 'Delete category'}
                                disabled={usageCount > 0 || isSubmitting}
                              >
                                {usageCount > 0 ? (
                                  <AlertTriangle className="h-4 w-4" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No categories available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;