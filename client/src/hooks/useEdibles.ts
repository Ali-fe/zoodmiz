import { useNavigate } from 'react-router-dom';
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import Edible from '../types/edible';
import { showToast } from '../utils/toast';

// The single source of truth for edibles data
const ediblesQuery = {
    queryKey: ['edibles'],
    queryFn: async () => {
        const response = await customFetch.get('/edibles');
        return response.data.edibles as Edible[];
    },
};

// Hook for fetching all edibles (used by the Edibles page)
export const useEdibles = () => useQuery<Edible[]>(ediblesQuery);

// Hook for fetching only menu items (used by the Menu page)
// It uses the same query but selects/filters the data.
// TanStack Query will share the cache between them.
export const useMenu = () => {
    return useQuery({
        ...ediblesQuery,
        select: (edibles) => edibles.filter(e => e.menu),
    });
};

// Hook for fetching a single edible by ID
export const useEdible = (id?: string) => {
    return useQuery({
        queryKey: ['edibles', id],
        queryFn: async () => {
            const { data } = await customFetch.get(`/edibles/${id}`);
            return data.edible as Edible;
        },
        enabled: !!id, // Only run the query if an ID is provided
    });
};

export const useCreateEdible = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: Omit<Edible, '_id'>) => customFetch.post('/edibles', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('خوراکی جدید با موفقیت اضافه شد');
            navigate('/dashboard/edibles');
        },
        onError: () => {
            showToast.error('خطا در افزودن خوراکی جدید');
        }
    });
}; 


export const useDeleteEdible = (onSuccessCallback: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (edibleId: string) => customFetch.delete(`/edibles/${edibleId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('خوراکی با موفقیت حذف شد');
            onSuccessCallback();
        },
        onError: () => {
            showToast.error('خطا در حذف خوراکی');
            onSuccessCallback();
        }
    });
}; 

// Hook for updating an edible
export const useUpdateEdible = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Edible> }) =>
            customFetch.patch(`/edibles/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('خوراکی با موفقیت به‌روزرسانی شد');
            if (onSuccessCallback) {
                onSuccessCallback();
            }
        },
        onError: () => {
            showToast.error('خطا در به‌روزرسانی خوراکی');
        }
    });
};

// Hook for toggling menu status
export const useToggleMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ edibleId, menu }: { edibleId: string, menu: boolean }) =>
            customFetch.patch(`/edibles/${edibleId}`, { menu: !menu }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            const message = variables.menu ? 'از منو حذف شد' : 'به منو اضافه شد';
            showToast.success(message);
        },
        onError: () => {
            showToast.error('خطا در تغییر وضعیت منو');
        }
    });
};

// Hook for updating edible image
export const useUpdateEdibleImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, imageFile }: { id: string; imageFile: File }) => {
            const formData = new FormData();
            formData.append('image', imageFile);
            return customFetch.patch(`/edibles/${id}/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('تصویر با موفقیت به‌روزرسانی شد');
        },
        onError: () => {
            showToast.error('خطا در به‌روزرسانی تصویر');
        }
    });
};

// Hook for updating edible price
export const useUpdateEdiblePrice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, price }: { id: string; price: number }) =>
            customFetch.patch(`/edibles/${id}`, { price }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('قیمت با موفقیت به‌روزرسانی شد');
        },
        onError: () => {
            showToast.error('خطا در به‌روزرسانی قیمت');
        }
    });
};

// Hook for updating edible discount
export const useUpdateEdibleDiscount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, discount }: { id: string; discount: number }) =>
            customFetch.patch(`/edibles/${id}`, { discount }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            showToast.success('تخفیف با موفقیت به‌روزرسانی شد');
        },
        onError: () => {
            showToast.error('خطا در به‌روزرسانی تخفیف');
        }
    });
};

// Hook for updating edible availability
export const useUpdateEdibleAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, available }: { id: string; available: boolean }) =>
            customFetch.patch(`/edibles/${id}`, { available }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['edibles'] });
            const message = variables.available ? 'خوراکی در دسترس شد' : 'خوراکی غیرفعال شد';
            showToast.success(message);
        },
        onError: () => {
            showToast.error('خطا در تغییر وضعیت دسترسی');
        }
    });
}; 