import { AuthGuardData, createAuthGuard } from "keycloak-angular";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { inject } from "@angular/core";
import Keycloak from "keycloak-js";
import { createLeoUser, Role } from "./leo-token";

const isAccessAllowed = async (route: ActivatedRouteSnapshot,
                               state: RouterStateSnapshot,
                               authData: AuthGuardData): Promise<boolean | UrlTree> => {
  const keycloak = inject(Keycloak);
  const { authenticated, grantedRoles } = authData;

  // Force the user to log in if currently unauthenticated.
  if (!authenticated) {
    await keycloak.login({
      redirectUri: window.location.origin + state.url
    });
  }

  // Get the roles required from the route.
  const requiredRoles: Role[] = route.data["roles"];

  // Allow the user to proceed if no additional roles are required to access the route.
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    return true;
  }

  const leoUser = await createLeoUser(keycloak.token);

  // Allow the user to proceed if all the required roles are present.
  return requiredRoles.some((role) => leoUser.hasRole(role));
};

export const keycloakGuard = createAuthGuard<CanActivateFn>(isAccessAllowed);
