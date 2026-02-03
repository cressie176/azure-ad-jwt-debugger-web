export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || 'YOUR_CLIENT_ID',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || 'YOUR_TENANT_ID'}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [import.meta.env.VITE_AZURE_SCOPE || 'api://your-app-id/your-scope/access']
};

export const tokenRequest = {
    scopes: [import.meta.env.VITE_AZURE_SCOPE || 'api://your-app-id/your-scope/access'],
};

export const apiConfig = {
    debugEndpoint: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/debug/token'
};
