import {
  ApiResponse,
  IUser,
  ITool,
  IPayment,
  IDonation,
  IComponent,
  DonationFormData,
  PaymentFormData,
  UserFormData,
  ToolFormData,
  ComponentFormData
} from '@/types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api' 
  : 'http://localhost:3000/api';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Users API
  async getUsers(): Promise<ApiResponse<IUser[]>> {
    return this.request<ApiResponse<IUser[]>>('/users');
  }

  async getUserById(id: string): Promise<ApiResponse<IUser>> {
    return this.request<ApiResponse<IUser>>(`/users/${id}`);
  }

  async createUser(userData: UserFormData): Promise<ApiResponse<IUser>> {
    return this.request<ApiResponse<IUser>>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<UserFormData>): Promise<ApiResponse<IUser>> {
    return this.request<ApiResponse<IUser>>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Tools API
  async getTools(): Promise<ApiResponse<ITool[]>> {
    return this.request<ApiResponse<ITool[]>>('/tools');
  }

  async getToolById(id: string): Promise<ApiResponse<ITool>> {
    return this.request<ApiResponse<ITool>>(`/tools/${id}`);
  }

  async createTool(toolData: ToolFormData): Promise<ApiResponse<ITool>> {
    return this.request<ApiResponse<ITool>>('/tools', {
      method: 'POST',
      body: JSON.stringify(toolData),
    });
  }

  async updateTool(id: string, toolData: Partial<ToolFormData>): Promise<ApiResponse<ITool>> {
    return this.request<ApiResponse<ITool>>(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(toolData),
    });
  }

  async deleteTool(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/tools/${id}`, {
      method: 'DELETE',
    });
  }

  // Payments API
  async getPayments(): Promise<ApiResponse<IPayment[]>> {
    return this.request<ApiResponse<IPayment[]>>('/payments');
  }

  async getPaymentById(id: string): Promise<ApiResponse<IPayment>> {
    return this.request<ApiResponse<IPayment>>(`/payments/${id}`);
  }

  async createPayment(paymentData: PaymentFormData): Promise<ApiResponse<IPayment>> {
    return this.request<ApiResponse<IPayment>>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePayment(id: string, paymentData: Partial<PaymentFormData>): Promise<ApiResponse<IPayment>> {
    return this.request<ApiResponse<IPayment>>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Donations API
  async getDonations(): Promise<ApiResponse<IDonation[]>> {
    return this.request<ApiResponse<IDonation[]>>('/donations');
  }

  async getDonationById(id: string): Promise<ApiResponse<IDonation>> {
    return this.request<ApiResponse<IDonation>>(`/donations/${id}`);
  }

  async createDonation(donationData: DonationFormData): Promise<ApiResponse<IDonation>> {
    return this.request<ApiResponse<IDonation>>('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  }

  async updateDonation(id: string, donationData: Partial<DonationFormData>): Promise<ApiResponse<IDonation>> {
    return this.request<ApiResponse<IDonation>>(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donationData),
    });
  }

  async deleteDonation(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/donations/${id}`, {
      method: 'DELETE',
    });
  }

  // Components API
  async getComponents(): Promise<ApiResponse<IComponent[]>> {
    return this.request<ApiResponse<IComponent[]>>('/components');
  }

  async getComponentById(id: string): Promise<ApiResponse<IComponent>> {
    return this.request<ApiResponse<IComponent>>(`/components/${id}`);
  }

  async createComponent(componentData: ComponentFormData): Promise<ApiResponse<IComponent>> {
    return this.request<ApiResponse<IComponent>>('/components', {
      method: 'POST',
      body: JSON.stringify(componentData),
    });
  }

  async updateComponent(id: string, componentData: Partial<ComponentFormData>): Promise<ApiResponse<IComponent>> {
    return this.request<ApiResponse<IComponent>>(`/components/${id}`, {
      method: 'PUT',
      body: JSON.stringify(componentData),
    });
  }

  async deleteComponent(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/components/${id}`, {
      method: 'DELETE',
    });
  }

  // Database test API
  async testDatabaseConnection(): Promise<ApiResponse<{ status: string; message?: string }>> {
    return this.request<ApiResponse<{ status: string; message?: string }>>('/test/db');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const usersApi = {
  getAll: () => apiClient.getUsers(),
  getById: (id: string) => apiClient.getUserById(id),
  create: (data: UserFormData) => apiClient.createUser(data),
  update: (id: string, data: Partial<UserFormData>) => apiClient.updateUser(id, data),
  delete: (id: string) => apiClient.deleteUser(id),
};

export const toolsApi = {
  getAll: () => apiClient.getTools(),
  getById: (id: string) => apiClient.getToolById(id),
  create: (data: ToolFormData) => apiClient.createTool(data),
  update: (id: string, data: Partial<ToolFormData>) => apiClient.updateTool(id, data),
  delete: (id: string) => apiClient.deleteTool(id),
};

export const paymentsApi = {
  getAll: () => apiClient.getPayments(),
  getById: (id: string) => apiClient.getPaymentById(id),
  create: (data: PaymentFormData) => apiClient.createPayment(data),
  update: (id: string, data: Partial<PaymentFormData>) => apiClient.updatePayment(id, data),
  delete: (id: string) => apiClient.deletePayment(id),
};

export const donationsApi = {
  getAll: () => apiClient.getDonations(),
  getById: (id: string) => apiClient.getDonationById(id),
  create: (data: DonationFormData) => apiClient.createDonation(data),
  update: (id: string, data: Partial<DonationFormData>) => apiClient.updateDonation(id, data),
  delete: (id: string) => apiClient.deleteDonation(id),
};

export const componentsApi = {
  getAll: () => apiClient.getComponents(),
  getById: (id: string) => apiClient.getComponentById(id),
  create: (data: ComponentFormData) => apiClient.createComponent(data),
  update: (id: string, data: Partial<ComponentFormData>) => apiClient.updateComponent(id, data),
  delete: (id: string) => apiClient.deleteComponent(id),
};

export default apiClient;