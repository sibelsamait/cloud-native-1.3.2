// src/environments/environment.ts
export const environment = {
production: false,
azure: {
// ID de la aplicación (SPA) registrada en Microsoft Entra ID
clientId: '63951a03-718c-47b0-a658-0e2701b3f90a',
// ID del tenant (directorio) donde se registró la app
tenantId: '66383555-7d72-4f9e-bce5-df3b77a94018',
// Endpoint de autoridad: login.microsoftonline.com/<tenantId>
authority: 'https://login.microsoftonline.com/66383555-7d72-4f9e-bce5-df3b77a94018',
// Debe coincidir EXACTAMENTE con el Redirect URI (tipo SPA) configurado en Entra ID
redirectUri: 'http://localhost:4200',
// URI a la que MSAL redirige después de cerrar sesión
postLogoutRedirectUri: 'http://localhost:4200',
// Solo si se consumirá una API propia protegida con scopes
protectedResourceScopes: ['api://TU_API_ID_URI/TU_SCOPE'],
},
// Solo si el frontend consume un backend propio
apiBaseUrl: 'http://localhost:8080',
};