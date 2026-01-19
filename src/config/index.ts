// API Configuration with environment variables
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '');
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const config = {
    apiUrl: API_BASE_URL,
    socketUrl: SOCKET_URL,
    appName: import.meta.env.VITE_APP_NAME || 'FundNest',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
};

// API endpoints
export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        signup: `${API_BASE_URL}/api/auth/signup`,
        logout: `${API_BASE_URL}/api/auth/logout`,
    },
    ideas: `${API_BASE_URL}/api/ideas`,
    startups: `${API_BASE_URL}/api/startups`,
    requests: `${API_BASE_URL}/api/students/requests`,
    transactions: `${API_BASE_URL}/api/transactions`,
    bookmarks: `${API_BASE_URL}/api/bookmarks`,
    funds: `${API_BASE_URL}/api/funds`,
    portfolio: `${API_BASE_URL}/api/portfolio`,
    messages: `${API_BASE_URL}/api/messages`,
    actions: `${API_BASE_URL}/api/actions`,
    calls: `${API_BASE_URL}/api/calls`,
    pitch: `${API_BASE_URL}/api/pitch`,
    investor: `${API_BASE_URL}/api/investor`,
    blockchain: `${API_BASE_URL}/api/blockchain`,
};

export default config;
