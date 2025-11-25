
import { mockProducts } from '../products';
import { Product, Invoice, VipClient, VipTransaction } from '../../types';
import { mockInvoices, mockVipClients, mockTransactions } from '../accounting';
import { setFetcher } from './api';

const originalFetch = window.fetch;

// --- PERSISTENCE HELPERS ---
const STORAGE_KEYS = {
    PRODUCTS: 'delta-products-db',
    INVOICES: 'delta-invoices-db',
    VIP_USERS: 'delta-vip-users-db',
    TRANSACTIONS: 'delta-transactions-db',
    VIP_CLIENTS: 'delta-clients-db'
};

// Initialize Data if empty
const initializeStorage = () => {
    try {
        if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts));
        }
        if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
            localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(mockInvoices));
        }
        if (!localStorage.getItem(STORAGE_KEYS.VIP_CLIENTS)) {
            localStorage.setItem(STORAGE_KEYS.VIP_CLIENTS, JSON.stringify(mockVipClients));
        }
        if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mockTransactions));
        }
        // Initial VIP Users
        if (!localStorage.getItem(STORAGE_KEYS.VIP_USERS)) {
            const initialVipUsers = {
                '966558828009': { password: 'vip', name: 'فندق دلتا التجريبي' }
            };
            localStorage.setItem(STORAGE_KEYS.VIP_USERS, JSON.stringify(initialVipUsers));
        }
    } catch (e) {
        console.error("LocalStorage initialization failed", e);
    }
};

initializeStorage();

const getStoredData = <T>(key: string): T => {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [] as T;
    }
};

const setStoredData = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        // Dispatch event for auto-updates in other tabs
        window.dispatchEvent(new Event('storage'));
    } catch (e) {
        console.error("LocalStorage write failed", e);
    }
};


const mockApi = (url: RequestInfo | URL, options?: RequestInit): Promise<Response> => {
    const path = typeof url === 'string' ? url : (url instanceof URL ? url.pathname : new URL(url.url).pathname);
    const method = options?.method || 'GET';

    // --- PRODUCTS ---
    
    // GET Products
    if (path === '/api/products/' && method === 'GET') {
        const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS);
        return Promise.resolve(new Response(JSON.stringify(products), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }));
    }

    // POST Product
    if (path === '/api/products/' && method === 'POST') {
        if (options?.body) {
            const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS);
            const newProductData = JSON.parse(options.body as string);
            const newProduct: Product = {
                ...newProductData,
                id: Date.now(),
            };
            products.push(newProduct);
            setStoredData(STORAGE_KEYS.PRODUCTS, products);
            
            return Promise.resolve(new Response(JSON.stringify(newProduct), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            }));
        }
    }

    // PUT Product
    const putMatch = path.match(/^\/api\/products\/(\d+)\/$/);
    if (putMatch && method === 'PUT') {
        if (options?.body) {
            const id = parseInt(putMatch[1]);
            const products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS);
            const updatedProductData = JSON.parse(options.body as string);
            
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProductData };
                setStoredData(STORAGE_KEYS.PRODUCTS, products);
                return Promise.resolve(new Response(JSON.stringify(products[index]), { status: 200 }));
            }
        }
    }

    // DELETE Product
    const deleteMatch = path.match(/^\/api\/products\/(\d+)\/$/);
    if (deleteMatch && method === 'DELETE') {
        const id = parseInt(deleteMatch[1]);
        let products = getStoredData<Product[]>(STORAGE_KEYS.PRODUCTS);
        products = products.filter(p => p.id !== id);
        setStoredData(STORAGE_KEYS.PRODUCTS, products);
        return Promise.resolve(new Response(null, { status: 204 }));
    }

    // --- AUTH ---

    const ADMIN_AUTH_KEY = 'delta-stars-admin-auth';
    const getAdminAuth = () => {
        try {
            const data = localStorage.getItem(ADMIN_AUTH_KEY);
            if (data) return JSON.parse(data);
        } catch(e) {}
        const defaultAuth = { password: 'Admin123!', isDefault: true };
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(defaultAuth));
        return defaultAuth;
    };

    if (path === '/api/auth/token/' && method === 'POST') {
        if (options?.body) {
            const { username, password } = JSON.parse(options.body as string);
            const auth = getAdminAuth();
            if (username.toLowerCase() === 'deltastars777@gmail.com' && password === auth.password) {
                return Promise.resolve(new Response(JSON.stringify({ access: 'mock-admin-token-123' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Invalid credentials' }), { status: 401 }));
    }
    
    if (path === '/api/auth/admin/change-password/' && method === 'POST') {
         if (options?.body) {
            const { current_password, new_password } = JSON.parse(options.body as string);
            const auth = getAdminAuth();
            if (current_password === auth.password) {
                localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ password: new_password, isDefault: false }));
                return Promise.resolve(new Response(JSON.stringify({ message: 'Success' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Invalid password' }), { status: 400 }));
    }

    // VIP Auth
    const getVipUsers = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIP_USERS) || '{}');
        } catch { return {}; }
    };

    if (path === '/api/auth/vip/token/' && method === 'POST') {
        if (options?.body) {
            const { phone, password } = JSON.parse(options.body as string);
            const users = getVipUsers();
            const user = users[phone];
            if (user && password === user.password) {
                return Promise.resolve(new Response(JSON.stringify({ access: 'mock-vip-token', name: user.name }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Invalid credentials' }), { status: 401 }));
    }

    if (path === '/api/auth/vip/register/' && method === 'POST') {
        if (options?.body) {
            const { phone, company_name, password } = JSON.parse(options.body as string);
            const users = getVipUsers();
            if (users[phone]) {
                return Promise.resolve(new Response(JSON.stringify({ detail: 'Phone already registered' }), { status: 400 }));
            }
            users[phone] = { password, name: company_name };
            localStorage.setItem(STORAGE_KEYS.VIP_USERS, JSON.stringify(users));
            
            // Also add to VIP Clients DB for dashboard visibility
            const clients = getStoredData<VipClient[]>(STORAGE_KEYS.VIP_CLIENTS);
            clients.push({
                id: phone,
                phone: phone,
                companyName: company_name,
                contactPerson: 'New User',
                shippingAddress: 'To be updated'
            });
            setStoredData(STORAGE_KEYS.VIP_CLIENTS, clients);

            return Promise.resolve(new Response(JSON.stringify({ message: 'Created' }), { status: 201 }));
        }
    }

    if (path === '/api/auth/vip/check-phone/' && method === 'POST') {
        if (options?.body) {
            const { phone } = JSON.parse(options.body as string);
            const users = getVipUsers();
            if (users[phone]) {
                return Promise.resolve(new Response(JSON.stringify({ detail: 'Exists' }), { status: 400 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ available: true }), { status: 200 }));
    }

     if (path === '/api/auth/vip/change-password/' && method === 'POST') {
        if (options?.body) {
            const { phone, current_password, new_password } = JSON.parse(options.body as string);
            const users = getVipUsers();
            const user = users[phone];
            if (user && current_password === user.password) {
                users[phone] = { ...user, password: new_password };
                localStorage.setItem(STORAGE_KEYS.VIP_USERS, JSON.stringify(users));
                 return Promise.resolve(new Response(JSON.stringify({ message: 'Password changed successfully.' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'Incorrect current password.' }), { status: 400 }));
    }
    
    if (path === '/api/auth/vip/reset-password/' && method === 'POST') {
        if(options?.body) {
            const { phone, new_password } = JSON.parse(options.body as string);
            const users = getVipUsers();
            if(users[phone]) {
                users[phone].password = new_password;
                localStorage.setItem(STORAGE_KEYS.VIP_USERS, JSON.stringify(users));
                return Promise.resolve(new Response(JSON.stringify({ message: 'Password reset successfully.' }), { status: 200 }));
            }
        }
        return Promise.resolve(new Response(JSON.stringify({ detail: 'User not found.' }), { status: 404 }));
    }

    return originalFetch(url, options);
};

export const setupMockApi = () => {
    setFetcher(mockApi);
    console.log('Persistent Mock API initialized.');
};
