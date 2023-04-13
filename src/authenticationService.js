import { v4 as uuidv4 } from 'uuid';

export const authService = {
  init: () => {
    if (authService.getClientIpAddress() == undefined || authService.getClientIpAddress() == '') {
      authService.calculateClientIpAddress().then((ip) => {
        authService.setClientIpAddress(ip);
      });
    }
    authService.setupLogoutListener();
  },
  setupLogoutListener: () => {
    if (window.__is_app_logout_defined == undefined) {
      window.__is_app_logout_defined = true;
      document.addEventListener('logout', (e) => {
        authService.logout();
      });
    }
  },
  login: async (email, password, clientIpAddress) => {
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
    authService.setAuthenticationInfo(authData);

    return authData;
  },
  register: async (email, password, clientIpAddress) => {
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
    authService.setAuthenticationInfo(authData);

    return authData;
  },
  setAuthenticationInfo({ token, jwtToken, clientIpAddress }) {
    authService.setClientIpAddress(clientIpAddress);
    authService.setAuthenticationToken(token);
    authService.setAuthenticationJwtToken(jwtToken);
    authService.setCookies();
  },
  isLoggedIn: () => {
    // return authConfig.getAuthenticationToken() != null; // old way - using a session token
    return authService.getAuthenticationJwtToken() != null;
  },
  logout: () => {
    console.log('logout initiated...');

    let token = authService.getAuthenticationToken();
    let jwtToken = authService.getAuthenticationJwtToken();
    authService.clearAuthenticationInfo();

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
  clearAuthenticationInfo() {
    authService.removeAuthenticationToken();
    authService.removeAuthenticationJwtToken();
    authService.clearCookies();
  },
  setCookies: () => {
    document.cookie = 'authenticationToken=' + authService.getAuthenticationToken() + ";SameSite=Strict";
    document.cookie = 'clientIpAddress=' + authService.getClientIpAddress() + ";SameSite=Strict";
    document.cookie = 'authenticationJwtToken=' + authService.getAuthenticationJwtToken() + ";SameSite=Strict";
  },
  clearCookies: () => {
    document.cookie = 'authenticationToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'clientIpAddress=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'authenticationJwtToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  calculateClientIpAddress: async () => {
    if (authService.getClientIpAddress() != null) return authService.getClientIpAddress(); // already generated

    let clientIpAddress = authService.getClientIpAddress() ?? uuidv4(); // default to a UUID

    // Attempt to replace the UUID with the client's IP address
    await fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
        clientIpAddress = data.ip;
      })
      .catch(err => console.log("getClientIpAddress Error: " + err))

    return clientIpAddress;
  },
  setClientIpAddress: (ipAddress) => localStorage.setItem('clientIpAddress', ipAddress),
  getClientIpAddress: () => localStorage.getItem('clientIpAddress'),
  setAuthenticationToken: (token) => localStorage.setItem('authenticationToken', token),
  getAuthenticationToken: () => localStorage.getItem('authenticationToken'),
  removeAuthenticationToken: () => localStorage.removeItem('authenticationToken'),
  getAuthenticationJwtToken: () => localStorage.getItem('authenticationJwt'),
  setAuthenticationJwtToken: (jwt) => localStorage.setItem('authenticationJwt', jwt),
  removeAuthenticationJwtToken: () => localStorage.removeItem('authenticationJwt'),
}