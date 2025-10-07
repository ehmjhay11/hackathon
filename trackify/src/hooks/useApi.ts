import { useState, useEffect, useCallback } from 'react';
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
import {
  usersApi,
  toolsApi,
  paymentsApi,
  donationsApi,
  componentsApi
} from '@/lib/api-client';

// Generic hook for API operations
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// Users hooks
export function useUsers() {
  const [state, setState] = useState<UseApiListState<IUser>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await usersApi.getAll();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: [], loading: false, error: response.error || 'Failed to fetch users' });
      }
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: UserFormData) => {
    try {
      const response = await usersApi.create(userData);
      if (response.success) {
        await fetchUsers(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create user');
    } catch (error) {
      throw error;
    }
  };

  return { ...state, refetch: fetchUsers, createUser };
}

export function useUser(id: string) {
  const [state, setState] = useState<UseApiState<IUser>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await usersApi.getById(id);
        
        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: response.error || 'Failed to fetch user' });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    };

    fetchUser();
  }, [id]);

  return state;
}

// Tools hooks
export function useTools() {
  const [state, setState] = useState<UseApiListState<ITool>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchTools = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await toolsApi.getAll();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: [], loading: false, error: response.error || 'Failed to fetch tools' });
      }
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const createTool = async (toolData: ToolFormData) => {
    try {
      const response = await toolsApi.create(toolData);
      if (response.success) {
        await fetchTools(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create tool');
    } catch (error) {
      throw error;
    }
  };

  return { ...state, refetch: fetchTools, createTool };
}

// Payments hooks
export function usePayments() {
  const [state, setState] = useState<UseApiListState<IPayment>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchPayments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await paymentsApi.getAll();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: [], loading: false, error: response.error || 'Failed to fetch payments' });
      }
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const createPayment = async (paymentData: PaymentFormData) => {
    try {
      const response = await paymentsApi.create(paymentData);
      if (response.success) {
        await fetchPayments(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create payment');
    } catch (error) {
      throw error;
    }
  };

  return { ...state, refetch: fetchPayments, createPayment };
}

// Donations hooks
export function useDonations() {
  const [state, setState] = useState<UseApiListState<IDonation>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchDonations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await donationsApi.getAll();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: [], loading: false, error: response.error || 'Failed to fetch donations' });
      }
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const createDonation = async (donationData: DonationFormData) => {
    try {
      const response = await donationsApi.create(donationData);
      if (response.success) {
        await fetchDonations(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create donation');
    } catch (error) {
      throw error;
    }
  };

  return { ...state, refetch: fetchDonations, createDonation };
}

// Components hooks
export function useComponents() {
  const [state, setState] = useState<UseApiListState<IComponent>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchComponents = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await componentsApi.getAll();
      
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState({ data: [], loading: false, error: response.error || 'Failed to fetch components' });
      }
    } catch (error) {
      setState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  useEffect(() => {
    fetchComponents();
  }, [fetchComponents]);

  const createComponent = async (componentData: ComponentFormData) => {
    try {
      const response = await componentsApi.create(componentData);
      if (response.success) {
        await fetchComponents(); // Refresh the list
        return response;
      }
      throw new Error(response.error || 'Failed to create component');
    } catch (error) {
      throw error;
    }
  };

  return { ...state, refetch: fetchComponents, createComponent };
}

// Generic mutation hook for create/update/delete operations
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
    data: null as TData | null,
  });

  const mutate = async (variables: TVariables) => {
    try {
      setState({ loading: true, error: null, data: null });
      const response = await mutationFn(variables);
      
      if (response.success && response.data) {
        setState({ loading: false, error: null, data: response.data });
        return response;
      } else {
        const errorMessage = response.error || 'Mutation failed';
        setState({ loading: false, error: errorMessage, data: null });
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({ loading: false, error: errorMessage, data: null });
      throw error;
    }
  };

  const reset = () => {
    setState({ loading: false, error: null, data: null });
  };

  return { ...state, mutate, reset };
}