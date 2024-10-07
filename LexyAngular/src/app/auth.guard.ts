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
    router.navigate([userRole == "terapista" ? "/terapista" : "/"]).then(() => {});
    return false;
  }

  // Se il ruolo dell'utente è incluso nei ruoli attesi
  if (expectedRoles.includes(userRole)) {
    if (navigatedByButton === undefined || !navigatedByButton) {
      if (userRole === "terapista" && !is_terapista_url()) {
        router.navigate(["/terapista"], {state: {navigatedByButton: true}}).then(() => {});
        return false;
      } else if (userRole !== "terapista" && is_terapista_url()) {
        router.navigate(["/"], {state: {navigatedByButton: true}}).then(() => {});
        return false;
      }
        router.navigate([userRole === "terapista" && is_terapista_url() ? "/terapista" : "/"], {
        state: {navigatedByButton: true}}).then(() => {});
        return false;
    }


    return true;
  } else {
    // Se il ruolo non corrisponde a quelli attesi, reindirizza
    router.navigate([userRole === "terapista" && !is_terapista_url() ? "/terapista" : "/"], {
       state: {navigatedByButton: true}}).then(() => {});
    return false;
  }

  // Funzione per verificare se l'URL è per la rotta 'terapista'
  function is_terapista_url() {
    const url = state.url.split("/")[1]; // Modifica qui per prendere correttamente la seconda parte dell'URL
    return url === "terapista";
  }
};


