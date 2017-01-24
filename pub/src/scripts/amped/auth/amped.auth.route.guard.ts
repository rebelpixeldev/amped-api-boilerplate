import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AmpedService} from '../common/amped.common.service';

import {Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AmpedAuthGuard implements CanActivate {
  
  constructor(private ampedService: AmpedService, private router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isUserLoggedIn(route, state);
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isUserLoggedIn(route, state);
  }
  
  private isUserLoggedIn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    return this.ampedService.getUser()
      .then((user: any) => typeof user.id === 'undefined')
      .then((user: any) => {
        if (user)
          this.router.navigate(['/login']); //encodeURIComponent(state.url)
        else
          return true;
      })
  }
}
