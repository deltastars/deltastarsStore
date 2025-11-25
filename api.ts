
export class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const API_BASE_URL = '/api';

// Start with the global fetch, but allow it to be replaced for mocking.
let fetcher: typeof window.fetch = window.fetch.bind(window);

/**
 * Allows replacing the fetch implementation, primarily for mocking.
 * @param newFetcher The new fetch function to use.
 */
export const setFetcher = (newFetcher: typeof window.fetch) => {
    fetcher = newFetcher;
};


const getAuthToken = (): string | null => {
    return localStorage.getItem('delta-auth-token');
};

const handleErrorResponse = async (response: Response): Promise<never> => {
    let errorData: any;
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            errorData = await response.json();
            
            if (errorData) {
                if (typeof errorData === 'string') {
                    errorMessage = errorData;
                } else if (Array.isArray(errorData)) {
                     errorMessage = errorData.join(', ');
                } else if (typeof errorData === 'object') {
                    // Prioritize specific error keys found in different backend conventions
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.error) {
                        errorMessage = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
                    } else {
                        // Handle structured validation errors (e.g., { "field": ["error"] })
                        const messages: string[] = [];
                        Object.entries(errorData).forEach(([key, value]) => {
                            // Convert array of errors to string, or direct value to string
                            const valStr = Array.isArray(value) ? value.join(', ') : String(value);
                            
                            // Format nicely
                            if (key === 'non_field_errors' || key === '__all__' || key === 'detail') {
                                messages.push(valStr);
                            } else {
                                // Capitalize field name and replace underscores
                                const humanKey = key.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
                                messages.push(`${humanKey}: ${valStr}`);
                            }
                        });
                        
                        if (messages.length > 0) {
                            errorMessage = messages.join('. ');
                        } else {
                             // Fallback if empty object or unknown structure
                            errorMessage = JSON.stringify(errorData);
                        }
                    }
                }
            }
        } else {
            const textError = await response.text();
            if (textError && textError.length < 300) {
                errorMessage = textError;
            }
        }
    } catch (e) {
        // Response was not JSON or text reading failed
        // stick with the statusText
    }
    throw new ApiError(errorMessage, response.status, errorData);
};

const request = async (endpoint: string, options: RequestInit) => {
    try {
        const response = await fetcher(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            await handleErrorResponse(response);
        }
        // Handle responses that are successful but have no content
        if (response.status === 204) {
            return true;
        }
        // Try to parse JSON, but gracefully handle if body is empty or not JSON
        const text = await response.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return text; // Return as text if not valid JSON
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error; // Re-throw errors from handleErrorResponse and other ApiError instances
        }
        // Handle network errors (e.g., fetch itself fails)
        console.error("Network or fetch error:", error);
        throw new ApiError(
            "Network connection failed. Please check your internet connection.",
            0, // Status 0 indicates a network error, not an HTTP error
            { detail: "Network Error" }
        );
    }
};


const api = {
    async get(endpoint: string) {
        return request(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
    },

    async post(endpoint: string, data: any) {
        return request(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
    },

    async put(endpoint: string, data: any) {
        return request(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
    },

    async delete(endpoint: string) {
        return request(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
    }
};

export default api;
