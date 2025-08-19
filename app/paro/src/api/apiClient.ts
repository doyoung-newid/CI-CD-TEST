import axios from 'axios';

export const executor = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiClient = {
    get: <T>(path: string, params?: object) =>
        executor
            .get<T>(path, {
                params: {
                    ...params,
                },
            })
            .then((response) => {
                return response.data;
            }),
    post: <T>(path: string, data: object) =>
        executor
            .post<T>(path, {
                ...data,
            })
            .then((response) => {
                return response.data;
            }),
    patch: <T>(path: string, data: object) =>
        executor
            .patch<T>(path, {
                ...data,
            })
            .then((response) => {
                return response.data;
            }),
    delete: <T>(path: string, data: object) =>
        executor.delete<T>(path, { data: data }).then((response) => {
            return response.data;
        }),
};
