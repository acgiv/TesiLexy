import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AccessService} from "./access.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AccessService);
  const router = inject(Router);
  const expectedRoles = route.data['expectedRole'] as string[];
  const userRole = authService.getRuolo();
  const navigation = router.getCurrentNavigation();
  const navigatedByButton = navigation?.extras.state;


     // Se l'utente è autenticato ma tenta di accedere a pagine come login o registrazione, reindirizza alla home appropriata
    if (userRole != '' &&
      (state.url === '/login' ||
       state.url === '/terapista/registrati' ||
       state.url === '/terapista/login'  ||
       state.url === "/recuperoPassword"  ||
       state.url === "/terapista/recuperoPassword")) {
    router.navigate([userRole == "terapista" ? "/terapista" : "/"],{state: {navigatedByButton: true}}).then(() => {});
    return false;
  }

  if (expectedRoles.includes(userRole)) {
    if (navigatedByButton === undefined || !navigatedByButton) {
       return is_rule_terapisturl();
    }

    return true;
  } else {
    router.navigate([userRole === "terapista" && !is_terapista_url() ? "/terapista" : "/"], {
       state: {navigatedByButton: true}}).then(() => {});
    return false;
  }

  function is_rule_terapisturl():boolean {
    if (userRole === "terapista" && !is_terapista_url()) {
        router.navigate(["/terapista"], {state: {navigatedByButton: true}}).then(() => {});
      } else if (userRole !== "terapista" && is_terapista_url()) {
        router.navigate([is_terapista_url() ? "/terapista" : "/"], {state: {navigatedByButton: true}}).then(() => {});
      }
        router.navigate([userRole === "terapista" && is_terapista_url() ? "/terapista" : "/"], {
        state: {navigatedByButton: true}}).then(() => {});
       return false
  }

  function is_terapista_url() {
    const url = state.url.split("/")[1]; // Modifica qui per prendere correttamente la seconda parte dell'URL
    return url === "terapista";
  }
};


