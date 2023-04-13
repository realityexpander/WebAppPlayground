export const globalProp = "version-1.2.3.3";

export const authConfig = {
  setClientIpAddress: (ipAddress) => localStorage.setItem('clientIpAddress', ipAddress),
  getClientIpAddress: () => localStorage.getItem('clientIpAddress'),
  setAuthenticationToken: (token) => localStorage.setItem('token', token),
  getAuthenticationToken: () => localStorage.getItem('token'),
  removeAuthenticationToken: () => localStorage.removeItem('token'),
  getAuthenticationJWT: () => localStorage.getItem('jwt'),
  setAuthenticationJWT: (jwt) => localStorage.setItem('jwt', jwt),
  removeAuthenticationJWTToken: () => localStorage.removeItem('jwt'),
  setupLogoutListener: () => {
    if (window.__is_app_logout_defined == undefined) {
      window.__is_app_logout_defined = true;
      document.addEventListener('logout', (e) => {
        authConfig.logout();
      });
    }
  },
  logout: () => {
    console.log('logout initiated...');

    let token = authConfig.getAuthenticationToken();
    authConfig.removeAuthenticationToken();
    authConfig.removeAuthenticationJWTToken();
    authConfig.clearCookies();

    // Inform backend of logout
    fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token
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
  setAuthenticationInfo({ token, jwtToken, clientIpAddress }) {
    authConfig.setClientIpAddress(clientIpAddress);
    authConfig.setAuthenticationToken(token);
    authConfig.setAuthenticationJWT(jwtToken);
    authConfig.setCookies();
  },
  setCookies: () => {
    document.cookie = 'authenticationToken=' + authConfig.getAuthenticationJWT() + ";SameSite=Strict";
    document.cookie = 'clientIpAddress=' + authConfig.getClientIpAddress() + ";SameSite=Strict";
    document.cookie = 'authenticationJwt=' + authConfig.getAuthenticationJWT() + ";SameSite=Strict";
  },
  clearCookies: () => {
    document.cookie = 'authenticationToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'clientIpAddress=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'authenticationJwt=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  isLoggedIn: () => {
    return authConfig.getAuthenticationToken() != null;
  }
}

export const user = {
  id: "",
  username: "",
  email: "",
}

export const endpointConfig = {
  database: {
    host: 'localhost',
    port: 3000,
  },
  server: {
    host: 'localhost',
    port: 8081,
  },
  getUrl: function (host, port) {
    return `http://${host}:${port}`;
  },
  getDatabaseUrl: function () {
    return endpointConfig.getUrl(endpointConfig.database.host, endpointConfig.database.port)
  },
  getServerUrl: function () {
    return endpointConfig.getUrl(endpointConfig.server.host, endpointConfig.server.port)
  }

}
