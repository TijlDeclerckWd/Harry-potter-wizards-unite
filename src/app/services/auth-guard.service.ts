import {Injectable} from "@angular/core";
import {CanActivate, NavigationExtras, Router} from "@angular/router";
import {AuthenticationService} from "./auth.service";

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthenticationService
    ){}

    canActivate(route){
        if (this.authService.isLoggedIn()) return true;

        let navigationExtras: NavigationExtras = {
            queryParams: { 'returnUrl': route.data.returnUrl }
        };


        if (route.data.returnUrl) {
            this.router.navigate(['/login'], navigationExtras);
            return false
        }
            // else {
        //     this.router.navigate('/login')
        // }


        return false;
    }
}