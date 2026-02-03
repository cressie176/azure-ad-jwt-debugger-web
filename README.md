# Azure AD JWT Debugger - Web Client

A simple web application for testing Azure AD authentication with MSAL. This app allows you to sign in with Azure AD and test authenticated requests to the backend service.

## Prerequisites

- Node.js 18 or higher
- An Azure AD application registration
- The backend service running at `../azure-ad-jwt-debugger`

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Azure AD credentials:

```
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_SCOPE=api://your-app-id/your-scope/access
VITE_API_URL=http://localhost:3000/api/debug/token
```

### 3. Configure Azure AD Application

In the Azure Portal, configure your app registration:

1. Go to Azure Portal > Azure Active Directory > App registrations
2. Select your application
3. Under "Authentication":
   - Add a Single-page application (SPA) platform
   - Set Redirect URI to `http://localhost:5173` (Vite's default port)
   - Enable "Access tokens" and "ID tokens" under Implicit grant
4. Under "API permissions":
   - Add delegated permissions for your API
5. Under "Expose an API":
   - Add a scope called `access_as_user`
   - Note the Application ID URI (format: `api://{client-id}`)

### 4. Start the Backend Service

The backend service must be running for API calls to work:

```bash
cd ../azure-ad-jwt-debugger
npm install
npm start
```

### 5. Start the Web Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Click "Sign In" to authenticate with Azure AD
2. After signing in, your user information will be displayed
3. Click "Call Backend Service" to make an authenticated request to the backend
4. The response from the backend service will be displayed, showing your decoded JWT token information

## Features

- Azure AD authentication using MSAL.js
- Popup-based sign-in flow
- Automatic token acquisition and refresh
- Bearer token authentication for API calls
- User information display
- API response visualization
- Error handling and display

## Development

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tech Stack

- Vite - Build tool and dev server
- MSAL.js - Microsoft Authentication Library for JavaScript
- Vanilla JavaScript - No framework dependencies
- ES Modules - Modern JavaScript modules

## Troubleshooting

### Sign-in fails with CORS error
- Ensure the redirect URI in Azure AD matches your local development URL
- Check that SPA platform is configured, not Web platform

### Token acquisition fails
- Verify the scope format: `api://{client-id}/access_as_user`
- Ensure API permissions are granted in Azure AD

### Backend API call fails
- Confirm the backend service is running
- Check that `VITE_API_URL` points to the correct backend endpoint
- Verify the backend is configured with the same tenant and client IDs

## License

MIT
