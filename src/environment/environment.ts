export const environment = {
  production: false,
  azure: {
    clientId: '63951a03-718c-47b0-a658-0e2701b3f90a',
    tenantId: '66383555-7d72-4f9e-bce5-df3b77a94018',
    authority: 'https://login.microsoftonline.com/66383555-7d72-4f9e-bce5-df3b77a94018',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    protectedResourceScopes: ['api://TU_API_ID_URI/TU_SCOPE'],
  },
  apiBaseUrl: 'http://localhost:8080',
};