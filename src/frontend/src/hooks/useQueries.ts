import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SnackItem, CartItem, Order, BankAccount } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetAllSnackItems() {
  const { actor, isFetching } = useActor();

  return useQuery<SnackItem[]>({
    queryKey: ['snackItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSnackItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCart(userId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CartItem[]>({
    queryKey: ['cart', userId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, itemId, quantity }: { userId: string; itemId: string; quantity: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addToCart(userId, itemId, quantity);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
    },
  });
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      customerName,
      customerEmail,
      customerAddress,
      customerPhone,
    }: {
      userId: string;
      customerName: string;
      customerEmail: string;
      customerAddress: string;
      customerPhone: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkout(userId, customerName, customerEmail, customerAddress, customerPhone);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrder(orderId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['order', orderId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSnackItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      price,
      image,
    }: {
      id: string;
      name: string;
      description: string;
      price: bigint;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addSnackItem(id, name, description, price, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snackItems'] });
    },
    onError: (error) => {
      console.error('Failed to add snack item:', error);
      throw error;
    },
  });
}

export function useDeleteSnackItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteSnackItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snackItems'] });
    },
    onError: (error) => {
      console.error('Failed to delete snack item:', error);
      throw error;
    },
  });
}

export function useClearCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.clearCart(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['cart', userId] });
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
      throw error;
    },
  });
}

export function useAdminOrderManagement() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminOrderManagement();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBankAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery<BankAccount[]>({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBankAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBankAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      accountHolderName,
      bankName,
      accountNumber,
      routingNumber,
    }: {
      accountHolderName: string;
      bankName: string;
      accountNumber: string;
      routingNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addBankAccount(accountHolderName, bankName, accountNumber, routingNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
    onError: (error) => {
      console.error('Failed to add bank account:', error);
      throw error;
    },
  });
}
