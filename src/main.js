import * as msal from '@azure/msal-browser';
import { msalConfig, loginRequest, tokenRequest, apiConfig } from './config.js';

let msalInstance;
let currentAccount = null;

async function initializeMsal() {
    msalInstance = new msal.PublicClientApplication(msalConfig);
    await msalInstance.initialize();

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        currentAccount = accounts[0];
        updateUI();
    }

    msalInstance.addEventCallback((event) => {
        if (event.eventType === msal.EventType.LOGIN_SUCCESS && event.payload.account) {
            currentAccount = event.payload.account;
            msalInstance.setActiveAccount(currentAccount);
        }
    });
}

function updateUI() {
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const userInfoSection = document.getElementById('userInfoSection');
    const userInfo = document.getElementById('userInfo');
    const actionsSection = document.getElementById('actionsSection');

    if (currentAccount) {
        signInButton.classList.add('hidden');
        signOutButton.classList.remove('hidden');
        userInfoSection.classList.remove('hidden');
        actionsSection.classList.remove('hidden');

        userInfo.innerHTML = `
            <p><strong>Name:</strong> ${currentAccount.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${currentAccount.username || 'N/A'}</p>
            <p><strong>Account ID:</strong> ${currentAccount.localAccountId || 'N/A'}</p>
        `;
    } else {
        signInButton.classList.remove('hidden');
        signOutButton.classList.add('hidden');
        userInfoSection.classList.add('hidden');
        actionsSection.classList.add('hidden');
    }
}

async function signIn() {
    try {
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        currentAccount = loginResponse.account;
        msalInstance.setActiveAccount(currentAccount);
        updateUI();
        clearError();
    } catch (error) {
        showError(`Sign in failed: ${error.message}`);
        console.error('Sign in error:', error);
    }
}

function signOut() {
    const logoutRequest = {
        account: currentAccount,
        postLogoutRedirectUri: window.location.origin
    };

    msalInstance.logoutPopup(logoutRequest).then(() => {
        currentAccount = null;
        updateUI();
        clearResponse();
        clearError();
    }).catch(error => {
        showError(`Sign out failed: ${error.message}`);
        console.error('Sign out error:', error);
    });
}

async function getAccessToken() {
    if (!currentAccount) {
        throw new Error('No account signed in');
    }

    const request = {
        ...tokenRequest,
        account: currentAccount
    };

    try {
        const response = await msalInstance.acquireTokenSilent(request);
        return response.accessToken;
    } catch (error) {
        if (error instanceof msal.InteractionRequiredAuthError) {
            const response = await msalInstance.acquireTokenPopup(request);
            return response.accessToken;
        }
        throw error;
    }
}

async function callBackendService() {
    try {
        const token = await getAccessToken();

        const response = await fetch(apiConfig.debugEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showResponse(data, true);
        } else {
            showResponse(data, false);
        }

        clearError();
    } catch (error) {
        showError(`API call failed: ${error.message}`);
        console.error('API call error:', error);
    }
}

function showResponse(data, success) {
    const responseSection = document.getElementById('responseSection');
    const responseContent = document.getElementById('responseContent');
    const responseStatus = document.getElementById('responseStatus');

    responseSection.classList.remove('hidden');
    responseContent.textContent = JSON.stringify(data, null, 2);

    responseStatus.textContent = success ? 'Success' : 'Error';
    responseStatus.className = `status ${success ? 'success' : 'error'}`;
}

function clearResponse() {
    const responseSection = document.getElementById('responseSection');
    responseSection.classList.add('hidden');
}

function showError(message) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = message;
    errorSection.classList.remove('hidden');
}

function clearError() {
    const errorSection = document.getElementById('errorSection');
    errorSection.classList.add('hidden');
}

document.getElementById('signInButton').addEventListener('click', signIn);
document.getElementById('signOutButton').addEventListener('click', signOut);
document.getElementById('testApiButton').addEventListener('click', callBackendService);

initializeMsal().catch(error => {
    showError(`Initialization failed: ${error.message}`);
    console.error('MSAL initialization error:', error);
});
