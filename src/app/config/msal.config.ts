import {
IPublicClientApplication,
PublicClientApplication,
InteractionType,
LogLevel,
BrowserCacheLocation,
} from '@azure/msal-browser';
import {
MsalGuardConfiguration,
MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { environment } from '/workspaces/cloud-native-1.3.2/src/environment/environment.ts';

/**
* Crea la instancia de PublicClientApplication que MSAL Angular registrará
* como proveedor global (token MSAL_INSTANCE). Toda la app comparte esta
* misma instancia: nunca se debe crear un "new PublicClientApplication()"
* en otro lugar del código.
*/
export function msalInstanceFactory(): IPublicClientApplication {
return new PublicClientApplication({
auth: {
clientId: environment.azure.clientId,
authority: environment.azure.authority,
redirectUri: environment.azure.redirectUri,
postLogoutRedirectUri: environment.azure.postLogoutRedirectUri,
},
cache: {
// localStorage: la sesión persiste entre pestañas y recargas del navegador.
// Usar sessionStorage si se requiere que la sesión termine al cerrar la pestaña.
cacheLocation: BrowserCacheLocation.LocalStorage,
storeAuthStateInCookie: false, // solo true si se requiere IE11/Edge legacy
},
system: {
loggerOptions: {
loggerCallback: (level, message, containsPii) => {
// Nunca se debe registrar información que contenga datos personales (PII)
if (containsPii) {
return;
}
switch (level) {
case LogLevel.Error:
console.error(message);
return;
case LogLevel.Warning:
console.warn(message);
return;
default:
return;
}
},
// En producción solo mostramos errores; en desarrollo, también warnings
logLevel: environment.production ? LogLevel.Error : LogLevel.Warning,
piiLoggingEnabled: false,
},
},
});
}

/**
* Define cómo debe comportarse MsalGuard cuando una ruta protegida
* requiere autenticación: qué tipo de interacción usar y con qué scopes
* mínimos exigir al iniciar sesión.
*/
export function msalGuardConfigFactory(): MsalGuardConfiguration {
return {
// Redirect es más robusto que Popup: no depende de bloqueadores de pop-ups
// ni de que el usuario permita ventanas emergentes.
interactionType: InteractionType.Redirect,
authRequest: {
scopes: ['user.read'],
},
loginFailedRoute: '/login-failed',
};
}

/**
* Indica a MsalInterceptor qué endpoints deben recibir el header
* "Authorization: Bearer <token>" y con qué scopes solicitar ese token.
* Cualquier endpoint que NO esté en este mapa se enviará SIN token.
*/
export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
const protectedResourceMap = new Map<string, Array<string> | null>();
// Toda petición hacia nuestra propia API recibe el/los scope(s) configurados
protectedResourceMap.set(
`${environment.apiBaseUrl}/*`,
environment.azure.protectedResourceScopes
);
// Ejemplo adicional: Microsoft Graph (descomentar si se necesita)
// protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
return {
interactionType: InteractionType.Redirect,
protectedResourceMap,
};
}