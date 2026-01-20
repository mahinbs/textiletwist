// API Client Utility
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data: data as T, message: data.message };
  } catch (error) {
    console.error('API request failed:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Upload API helper (for file uploads)
async function uploadRequest<T>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'An error occurred' };
    }

    return { data: data as T, message: data.message };
  } catch (error) {
    console.error('Upload request failed:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Products API
export const productsApi = {
  getAll: async (filters?: { category_id?: string; is_active?: boolean; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.is_active !== undefined) params.append('is_active', String(filters.is_active));
    if (filters?.search) params.append('search', filters.search);

    return apiRequest<{ products: any[] }>(`/products?${params.toString()}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ product: any }>(`/products/${id}`);
  },

  create: async (product: any) => {
    return apiRequest<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: async (id: string, product: any) => {
    return apiRequest<{ product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (filters?: { featured?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.featured) params.append('featured', 'true');
    return apiRequest<{ categories: any[] }>(`/categories${params.toString() ? `?${params.toString()}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ category: any }>(`/categories/${id}`);
  },

  create: async (category: any) => {
    return apiRequest<{ category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (id: string, category: any) => {
    return apiRequest<{ category: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Cart API
export const cartApi = {
  getAll: async () => {
    return apiRequest<{ cart: any[] }>('/cart');
  },

  add: async (product_id: string, quantity: number = 1, size?: string) => {
    return apiRequest<{ cartItem: any }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity, size }),
    });
  },

  update: async (id: string, quantity: number) => {
    return apiRequest<{ cartItem: any }>(`/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (id: string) => {
    return apiRequest(`/cart/${id}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Wishlist API
export const wishlistApi = {
  getAll: async () => {
    return apiRequest<{ wishlist: any[] }>('/wishlist');
  },

  add: async (product_id: string) => {
    return apiRequest<{ wishlistItem: any }>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ product_id }),
    });
  },

  remove: async (product_id: string) => {
    return apiRequest(`/wishlist/${product_id}`, {
      method: 'DELETE',
    });
  },

  check: async (product_id: string) => {
    return apiRequest<{ inWishlist: boolean }>(`/wishlist/check/${product_id}`);
  },
};

// Coupons API
export const couponsApi = {
  getAll: async () => {
    return apiRequest<{ coupons: any[] }>('/coupons');
  },

  getById: async (id: string) => {
    return apiRequest<{ coupon: any }>(`/coupons/${id}`);
  },

  validate: async (code: string, subtotal: number, category_id?: string) => {
    return apiRequest<{ coupon: any; discount_amount: number; valid: boolean }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal, category_id }),
    });
  },

  create: async (coupon: any) => {
    return apiRequest<{ coupon: any }>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    });
  },

  update: async (id: string, coupon: any) => {
    return apiRequest<{ coupon: any }>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/coupons/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    return apiRequest<{ orders: any[] }>('/orders');
  },

  getById: async (id: string) => {
    return apiRequest<{ order: any }>(`/orders/${id}`);
  },

  create: async (orderData: any) => {
    return apiRequest<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest<{ order: any }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Enquiries API
export const enquiriesApi = {
  getAll: async (filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    return apiRequest<{ enquiries: any[] }>(`/enquiries?${params.toString()}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ enquiry: any }>(`/enquiries/${id}`);
  },

  create: async (enquiry: { name: string; email: string; subject: string; message: string }) => {
    return apiRequest<{ enquiry: any }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiry),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest<{ enquiry: any }>(`/enquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/enquiries/${id}`, {
      method: 'DELETE',
    });
  },

  sendReply: async (id: string, reply: { to: string; subject: string; message: string }) => {
    return apiRequest<{ message: string }>(`/enquiries/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify(reply),
    });
  },
};

// Auth API
export const authApi = {
  signup: async (email: string, password: string, fullName?: string) => {
    return apiRequest<{ user: any }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },

  refresh: async () => {
    return apiRequest<{ user: any }>('/auth/refresh', {
      method: 'POST',
    });
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Upload API
export const uploadApi = {
  uploadCategoryImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return uploadRequest<{ url: string }>('/upload/category', formData);
  },

  uploadProductImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return uploadRequest<{ urls: string[] }>('/upload/product', formData);
  },

  deleteImage: async (url: string, bucket?: string) => {
    return apiRequest('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ url, bucket }),
    });
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (filters?: { limit?: number; unread_only?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.unread_only) params.append('unread_only', 'true');
    return apiRequest<{ notifications: any[] }>(`/notifications?${params.toString()}`);
  },

  getUnreadCount: async () => {
    return apiRequest<{ count: number }>('/notifications/unread-count');
  },

  markAsRead: async (id: string) => {
    return apiRequest<{ notification: any }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllAsRead: async () => {
    return apiRequest<{ message: string }>('/notifications/read-all', {
      method: 'PUT',
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Reviews API
export const reviewsApi = {
  getByProduct: async (productId: string) => {
    return apiRequest<{ reviews: any[]; totalReviews: number; averageRating: number }>(`/reviews/product/${productId}`);
  },

  create: async (productId: string, rating: number, comment?: string) => {
    return apiRequest<{ review: any; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, rating, comment }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Product Sizes API
export const productSizesApi = {
  getByProduct: async (productId: string) => {
    return apiRequest<{ sizes: any[] }>(`/product-sizes/product/${productId}`);
  },

  create: async (productId: string, sizeName: string, quantity: number) => {
    return apiRequest<{ size: any; message: string }>('/product-sizes', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, size_name: sizeName, quantity }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/product-sizes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Product Details API
export const productDetailsApi = {
  getByProduct: async (productId: string) => {
    return apiRequest<{ details: any[] }>(`/product-details/product/${productId}`);
  },

  create: async (productId: string, heading: string, value: string, displayOrder?: number) => {
    return apiRequest<{ detail: any; message: string }>('/product-details', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, heading, value, display_order: displayOrder || 0 }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/product-details/${id}`, {
      method: 'DELETE',
    });
  },
};
