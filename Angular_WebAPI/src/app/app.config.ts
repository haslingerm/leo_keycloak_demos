import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection
} from "@angular/core";
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition, includeBearerTokenInterceptor,
  provideKeycloak
} from "keycloak-angular";
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const authTokenCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:5050)(\/.*)?$/i
});
const keycloakProvider = provideKeycloak({
  config: {
    url: 'https://auth.htl-leonding.ac.at', // URL of the Keycloak server
    realm: 'htlleonding', // Realm to be used in Keycloak
    clientId: 'htlleonding-service' // Client ID for the application in Keycloak,
  },
  initOptions: {
    onLoad: 'check-sso', // Action to take on load
    //enableLogging: true, // Enables logging
    // IMPORTANT: implicit flow is no longer recommended, but using standard flow leads to a 401 at the keycloak server
    // when retrieving the token with the access code - we leave it like this for the moment until a solution is found
    flow: 'implicit'
  },
  providers: [
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [authTokenCondition] // Specify conditions for adding the Bearer token
    }
  ]
});

export const appConfig: ApplicationConfig = {
  providers: [
    keycloakProvider,
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync()
  ]
};
