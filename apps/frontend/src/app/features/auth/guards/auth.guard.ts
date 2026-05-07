import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getUser();
  // Check for JWT token
  let token = cookieService.get('Authorization');
  if (token && user) {
    token = token.replace('Bearer ', ''); // Remove 'Bearer ' prefix if present
    try {
      const decodedToken: any = jwtDecode(token.trim());
      // Check if token is expired
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = new Date().getTime();
      if (expirationTime < currentTime) {
        authService.logout();
        return router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url },
        });
      } else {
        // Token is valid, allow access
        if (user.roles.includes('Writer')) {
          return true;
        } else {
          alert(
            'Unauthorized: You do not have permission to access this page.',
          );
          router.navigateByUrl('/');
          return false;
        }
      }
    } catch (error) {
      authService.logout();
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }
  } else {
    // Redirect to login page if not authenticated
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
