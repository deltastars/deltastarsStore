

import { mockProducts } from '../components/products';
import { Product } from '../types';
import { setFetcher } from './api';

const originalFetch = window.fetch;

// Make VIP users stateful to allow for registration
let mockVipUsers: {[key: string]: {password: string, name: string}} = {
    '966558828009': { password: 'vip', name: 'فندق دلتا التجريبي' }
};


const mockApi = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    // FIX: Correctly extract path from string, URL, or Request object.
    const path = typeof url === 'string' ? url : (url instanceof URL ? url.pathname : new URL(url.url).pathname);
    const method = options?.method || 'GET';

    // --- GET /api/products/ ---
    if (path === '/api/products/' && method === 'GET') {
        const response = new Response(JSON.stringify(mockProducts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        return Promise.resolve(response);
    }

    // --- POST /api/products/ ---
    if (path === '/api/products/' && method === 'POST') {
        if (options?.body) {
            const newProductData = JSON.parse(options.body as string);
            const newProduct: Product = {
                ...newProductData,
                id: Date.now(), // Simple unique ID
            };
            const response = new Response(JSON.stringify(newProduct), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
            return Promise.resolve(response);
        }
    }

    // --- PUT /api/products/:id/ ---
    const putMatch = path.match(/^\/api\/products\/(\d+)\/$/);
    if (putMatch && method === 'PUT') {
        if (options?.body) {
            const updatedProductData = JSON.parse(options.body as string);
            const response = new Response(JSON.stringify(updatedProductData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
            return Promise.resolve(response);
        }
    }

    // --- DELETE /api/products/:id/ ---
    const deleteMatch = path.match(/^\/api\/products\/(\d+)\/$/);
    if (deleteMatch && method === 'DELETE') {
        const response = new Response(null, {
            status: 204,
        });
        return Promise.resolve(response);
    }

    // --- AUTH MOCKS ---
    const ADMIN_AUTH_KEY = 'delta-stars-admin-auth';
    const getAdminAuth = () => {
        const data = localStorage.getItem(ADMIN_AUTH_KEY);
        if (data) return JSON.parse(data);
        const defaultAuth = { password: 'Admin123!', isDefault: true };
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(defaultAuth));
        return defaultAuth;
    };

    if (path === '/api/auth/token/' && method === 'POST') {
        if (options?.body) {
            const { username, password } = JSON.parse(options.body as string);
            const auth = getAdminAuth();
            if (username.toLowerCase() === 'deltastars777@gmail.com' && password === auth.password) {
                const response = new Response(JSON.stringify({ access: 'mock-admin-token-123' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
                return Promise.resolve(response);
            }
        }
        
        const response = new Response(JSON.stringify({ detail: 'No active account found with the given credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
        return Promise.resolve(response);
    }
    
    if (path === '/api/auth/admin/change-password/' && method === 'POST') {
         if (options?.body) {
            const { current_password, new_password } = JSON.parse(options.body as string);
            const auth = getAdminAuth();
            if (current_password === auth.password) {
                localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ password: new_password, isDefault: false }));
                return Promise.resolve(new Response(JSON.stringify({ message: 'Password changed successfully.' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Incorrect current password.' }), { status: 400 }));
    }


    if (path === '/api/auth/vip/token/' && method === 'POST') {
        if (options?.body) {
            const { phone, password } = JSON.parse(options.body as string);
            const user = mockVipUsers[phone];
            if (user && password === user.password) {
                const response = new Response(JSON.stringify({ access: 'mock-vip-token-456', name: user.name }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
                return Promise.resolve(response);
            }
        }

        const response = new Response(JSON.stringify({ detail: 'No active account found with the given credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
        return Promise.resolve(response);
    }

    if (path === '/api/auth/vip/change-password/' && method === 'POST') {
        if (options?.body) {
            const { phone, current_password, new_password } = JSON.parse(options.body as string);
            const user = mockVipUsers[phone];
            if (user && current_password === user.password) {
                mockVipUsers[phone] = { ...user, password: new_password };
                 return Promise.resolve(new Response(JSON.stringify({ message: 'Password changed successfully.' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Incorrect current password.' }), { status: 400 }));
    }
    
    if (path === '/api/auth/vip/reset-password/' && method === 'POST') {
        if(options?.body) {
            const { phone, new_password } = JSON.parse(options.body as string);
            if(mockVipUsers[phone]) {
                mockVipUsers[phone].password = new_password;
                return Promise.resolve(new Response(JSON.stringify({ message: 'Password reset successfully.' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'User not found.' }), { status: 404 }));
    }


    if (path === '/api/auth/vip/register/' && method === 'POST') {
        if (options?.body) {
            const { phone, company_name, password } = JSON.parse(options.body as string);
            if (mockVipUsers[phone]) {
                const response = new Response(JSON.stringify({ detail: 'This phone number is already registered.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
                return Promise.resolve(response);
            }
            mockVipUsers[phone] = { password, name: company_name };
            console.log('Mock VIP Users after registration:', mockVipUsers);
            const response = new Response(JSON.stringify({ message: 'User created successfully.' }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
            return Promise.resolve(response);
        }
         const response = new Response(JSON.stringify({ detail: 'Invalid request body.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
        return Promise.resolve(response);
    }

    if (path === '/api/auth/vip/check-phone/' && method === 'POST') {
        if (options?.body) {
            const { phone } = JSON.parse(options.body as string);
            if (mockVipUsers[phone]) {
                const response = new Response(JSON.stringify({ detail: 'This phone number is already registered.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
                return Promise.resolve(response);
            }
        }
        const response = new Response(JSON.stringify({ available: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        return Promise.resolve(response);
    }

    // Pass through to original fetch if no route matches
    return originalFetch(url, options);
};

export const setupMockApi = () => {
    setFetcher(mockApi);
    console.log('Mock API initialized to handle local development.');
};