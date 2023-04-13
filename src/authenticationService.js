import { v4 as uuidv4 } from 'uuid';

export const authService = {
  init: () => {
    if (authService._getClientIpAddress() == undefined || authService._getClientIpAddress() == '') {
      authService._calculateClientIpAddress().then((ip) => {
        authService._setClientIpAddress(ip);
      });
    }
    authService._setupLogoutListener();
  },
  login: async (email, password, clientIpAddress) => {
    authService._validateCredentials(email, password);

    let response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        clientIpAddress
      })
    });

    if (!response.ok) {
      let data = await response.json()
      throw new Error(response.statusText + ":" + data.error)
    }

    let authData = await response.json();
    authService._setAuthenticationInfo(authData);

    return authData;
  },
  register: async (email, password, clientIpAddress) => {
    authService._validateCredentials(email, password);

    let response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        clientIpAddress
      })
    });

    if (!response.ok) {
      let data = await response.json()
      throw new Error(response.statusText + ":" + data.error)
    }

    let authData = await response.json();
    authService._setAuthenticationInfo(authData);

    return authData;
  },
  isLoggedIn: () => {
    // return authConfig.getAuthenticationToken() != null; // old way - using a session token
    return authService._getAuthenticationJwtToken() != null;
  },
  logout: () => {
    console.log('logout initiated...');

    let token = authService._getAuthenticationToken();
    let jwtToken = authService._getAuthenticationJwtToken();
    authService._clearAuthenticationInfo();

    // Inform backend of logout
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        jwtToken
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Successfully logged out:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        window.location.href = '/'
      });
  },
  //////////////////////////////////////////////
  /////////////// HELPER METHODS ///////////////
  _setupLogoutListener: () => {
    if (window.__is_app_logout_defined == undefined) {
      window.__is_app_logout_defined = true;
      document.addEventListener('logout', (e) => {
        authService.logout();
      });
    }
  },
  _validateCredentials: (email, password) => {
    if (email == undefined || email == '') {
      throw new Error('Email is required');
    }

    if (password == undefined || password == '') {
      throw new Error('Password is required');
    }

    return true;
  },
  _setAuthenticationInfo({ token, jwtToken, clientIpAddress }) {
    authService._setClientIpAddress(clientIpAddress);
    authService._setAuthenticationToken(token);
    authService._setAuthenticationJwtToken(jwtToken);
    authService._setCookies();
  },
  _clearAuthenticationInfo() {
    authService._removeAuthenticationToken();
    authService._removeAuthenticationJwtToken();
    authService._clearCookies();
  },
  _setCookies: () => {
    document.cookie = 'authenticationToken=' + authService._getAuthenticationToken() + ";SameSite=Strict";
    document.cookie = 'clientIpAddress=' + authService._getClientIpAddress() + ";SameSite=Strict";
    document.cookie = 'authenticationJwtToken=' + authService._getAuthenticationJwtToken() + ";SameSite=Strict";
  },
  _clearCookies: () => {
    document.cookie = 'authenticationToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'clientIpAddress=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'authenticationJwtToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  _calculateClientIpAddress: async () => {
    if (authService._getClientIpAddress() != null) return authService._getClientIpAddress(); // already generated

    let clientIpAddress = authService._getClientIpAddress() ?? uuidv4(); // default to a UUID

    // Attempt to replace the UUID with the client's IP address
    await fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
        clientIpAddress = data.ip;
      })
      .catch(err => console.log("getClientIpAddress Error: " + err))

    return clientIpAddress;
  },
  _setClientIpAddress: (ipAddress) => localStorage.setItem('clientIpAddress', ipAddress),
  _getClientIpAddress: () => localStorage.getItem('clientIpAddress'),
  _setAuthenticationToken: (token) => localStorage.setItem('authenticationToken', token),
  _getAuthenticationToken: () => localStorage.getItem('authenticationToken'),
  _removeAuthenticationToken: () => localStorage.removeItem('authenticationToken'),
  _getAuthenticationJwtToken: () => localStorage.getItem('authenticationJwt'),
  _setAuthenticationJwtToken: (jwt) => localStorage.setItem('authenticationJwt', jwt),
  _removeAuthenticationJwtToken: () => localStorage.removeItem('authenticationJwt'),
}