# Azure AD JWT Debugger - Web Client

A simple web application for testing Azure AD authentication with MSAL. This app allows you to sign in with Azure AD and test authenticated requests to the backend service.

## Quick Start with npx

You can run this application directly without cloning the repository:

```bash
npx azure-ad-jwt-debugger-web
```

**Note:** You still need to create a `.env.local` file with your Azure AD configuration before running (see Configuration section below).

## Prerequisites

- Node.js 18 or higher
- An Azure AD application registration
- The backend service running at `../azure-ad-jwt-debugger`

## Setup

### Configuration (Required for Both Methods)

Whether using npx or local development, you must configure your environment variables.

Create a `.env.local` file in the project directory:

```bash
# .env.local
VITE_AZURE_TENANT_ID=your-tenant-id
VITE_AZURE_CLIENT_ID=your-client-id
VITE_API_URL=http://localhost:3002/api/debug/token
```

### Azure AD Application Configuration

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

### Start the Backend Service

The backend service must be running for API calls to work:

```bash
cd ../azure-ad-jwt-debugger
npm install
npm start
```

## Running the Application

### Option 1: Using npx (Recommended)

```bash
npx azure-ad-jwt-debugger-web
```

The script will:
- Check for `.env.local` configuration
- Install dependencies if needed
- Start the Vite dev server
- Open the application at `http://localhost:5173`

### Option 2: Local Development

If you've cloned the repository:

```bash
# Install dependencies
npm install

# Start development server
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
