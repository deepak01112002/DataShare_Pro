import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  getDocs, 
  query, 
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { deleteImage } from '../utils/imageUpload';

export interface Product {
  id: string;
  title: string;
  size: string;
  color: string;
  price: number;
  category: string;
  image: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  categories: string[];
  categoryObjects: Category[];
  addCategory: (name: string) => Promise<boolean>;
  updateCategory: (id: string, name: string) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryUsageCount: (categoryName: string) => number;
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive categories array from categoryObjects
  const categories = categoryObjects.map(cat => cat.name);

  // Load products from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'products'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          productsData.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load categories from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'categories'), orderBy('createdAt', 'asc')),
      (snapshot) => {
        const categoriesData: Category[] = [];
        snapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() } as Category);
        });
        setCategoryObjects(categoriesData);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      }
    );

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      setError(null);
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Omit<Product, 'id'>) => {
    try {
      setError(null);
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedProduct,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      const productRef = doc(db, 'products', id);
      const productSnapshot = await getDoc(productRef);

      // Attempt to delete associated image before removing the product doc
      const productData = productSnapshot.data() as Product | undefined;
      if (productData && productData.image) {
        try {
          await deleteImage(productData.image);
        } catch (imageErr) {
          // Not critical; continue with product deletion
          console.warn('Failed to delete product image from storage:', imageErr);
        }
      }

      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
      throw error;
    }
  };

  const addCategory = async (name: string): Promise<boolean> => {
    try {
      setError(null);
      const trimmedName = name.trim();
      if (!trimmedName) return false;
      
      // Check if category already exists (case-insensitive)
      const exists = categoryObjects.some(cat => 
        cat.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (exists) return false;
      
      await addDoc(collection(db, 'categories'), {
        name: trimmedName,
        createdAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
      return false;
    }
  };

  const updateCategory = async (id: string, name: string): Promise<boolean> => {
    try {
      setError(null);
      const trimmedName = name.trim();
      if (!trimmedName) return false;
      
      // Check if new name already exists in other categories
      const exists = categoryObjects.some(cat => 
        cat.id !== id && cat.name.toLowerCase() === trimmedName.toLowerCase()
      );
      
      if (exists) return false;
      
      const oldCategory = categoryObjects.find(cat => cat.id === id);
      if (!oldCategory) return false;
      
      // Update category
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        name: trimmedName,
        updatedAt: new Date().toISOString()
      });
      
      // Update all products that use this category
      const productsQuery = query(
        collection(db, 'products'),
        where('category', '==', oldCategory.name)
      );
      
      const productsSnapshot = await getDocs(productsQuery);
      const updatePromises = productsSnapshot.docs.map(productDoc => 
        updateDoc(doc(db, 'products', productDoc.id), {
          category: trimmedName,
          updatedAt: new Date().toISOString()
        })
      );
      
      await Promise.all(updatePromises);
      
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const category = categoryObjects.find(cat => cat.id === id);
      if (!category) return false;
      
      // Check if category is being used by any products
      const isUsed = products.some(product => product.category === category.name);
      if (isUsed) return false;
      
      await deleteDoc(doc(db, 'categories', id));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
      return false;
    }
  };

  const getCategoryUsageCount = (categoryName: string): number => {
    return products.filter(product => product.category === categoryName).length;
  };

  return (
    <ProductContext.Provider value={{
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
      loading,
      error
    }}>
      {children}
    </ProductContext.Provider>
  );
};