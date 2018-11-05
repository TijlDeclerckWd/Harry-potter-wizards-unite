// src/app/auth/role-guard.service.ts
import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {AuthenticationService} from './auth.service';
import * as jwt_decode from 'jwt-decode';


@Injectable()
export class RoleGuardService implements CanActivate {

    constructor(public auth: AuthenticationService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // this will be passed from the route config
        // on the data property
        const expectedRole = route.data.expectedRole;
        const token = localStorage.getItem('token');
        // decode the token to get its payload
        let tokenPayload = null;
        if (token) {
            tokenPayload = this.auth.currentUser();
        }

        if (
            !this.auth.isLoggedIn() ||
            tokenPayload.user.role !== expectedRole
        ) {
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}