import { appConfig } from './app/app.config';
import { App } from './app/app';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import {
HTTP_INTERCEPTORS,
provideHttpClient,
withInterceptorsFromDi,
} from '@angular/common/http';
import {
MSAL_GUARD_CONFIG,
MSAL_INSTANCE,
MSAL_INTERCEPTOR_CONFIG,
MsalInterceptor,
MsalGuard,
MsalService,
MsalBroadcastService,
} from '@azure/msal-angular';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import {
msalInstanceFactory,
msalGuardConfigFactory,
msalInterceptorConfigFactory,
} from './app/config/msal.config';
// Definición de rutas: HomeComponent queda protegida por MsalGuard
const routes: Routes = [
{ path: '', component: HomeComponent, canActivate: [MsalGuard] },
{ path: '**', redirectTo: '' },
];
bootstrapApplication(AppComponent, {
providers: [
provideRouter(routes),
provideHttpClient(withInterceptorsFromDi()),
// Instancia global de MSAL, usada por MsalService y MsalGuard
{ provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
// Configuración de interacción para rutas protegidas por MsalGuard
{ provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
// Configuración de recursos protegidos para MsalInterceptor
{ provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },
// Interceptor HTTP que agrega "Authorization: Bearer <token>" automáticamente
{ provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
MsalGuard,
MsalService,
MsalBroadcastService,
],
}).catch((err) => console.error('Error al iniciar la aplicación:', err));