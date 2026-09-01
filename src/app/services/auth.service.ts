// src/app/services/auth.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
AccountInfo,
EventMessage,
EventType,
InteractionStatus,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
/**
* Encapsula MsalService y MsalBroadcastService para que el resto de la
* aplicación (componentes, guards, otros servicios) no dependa
* directamente de la librería de MSAL. Si en el futuro se cambia de
* proveedor de identidad, solo este archivo debería modificarse.
*/
@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
private readonly destroying$ = new Subject<void>();
constructor(
private readonly msalService: MsalService,
private readonly msalBroadcastService: MsalBroadcastService
) {
// Cuando el login es exitoso, fijamos la cuenta activa
this.msalBroadcastService.msalSubject$
.pipe(
filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
takeUntil(this.destroying$)
)
.subscribe(() => this.setActiveAccount());
// Cuando MSAL termina cualquier interacción en curso, revalidamos la cuenta activa
this.msalBroadcastService.inProgress$
.pipe(
filter((status: InteractionStatus) => status === InteractionStatus.None),
takeUntil(this.destroying$)
)
.subscribe(() => this.setActiveAccount());
}
/** Indica si existe al menos una cuenta autenticada en el cache de MSAL. */
isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
}
/** Devuelve la cuenta actualmente activa, o null si no hay sesión. */
getActiveAccount(): AccountInfo | null {
return this.msalService.instance.getActiveAccount();
}
/** Inicia el flujo de login mediante redirección a Microsoft Entra ID. */
login(): void {
this.msalService.loginRedirect();
}
/** Cierra la sesión y redirige a postLogoutRedirectUri. */
logout(): void {
this.msalService.logoutRedirect();
}
private setActiveAccount(): void {
const accounts = this.msalService.instance.getAllAccounts();
if (accounts.length > 0 && !this.msalService.instance.getActiveAccount()) {
// MSAL puede devolver varias cuentas si el usuario inició sesión con
// más de una identidad; aquí se activa la primera por simplicidad.
this.msalService.instance.setActiveAccount(accounts[0]);
}
}
ngOnDestroy(): void {
this.destroying$.next();
this.destroying$.complete();
}
}