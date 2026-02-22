import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SnackItem, CartItem } from '../backend';
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
    }: {
      userId: string;
      customerName: string;
      customerEmail: string;
      customerAddress: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkout(userId, customerName, customerEmail, customerAddress);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.userId] });
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
  });
}
