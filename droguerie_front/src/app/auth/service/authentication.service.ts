import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isManager() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Manager;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}login`, { email, password })
      .pipe(
        map(result => {
          let user = result.data.user;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                user.role +
                ' user to our App. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.name + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User Register
   *
   * @param username
   * @param email
   * @param password
   * @returns user
   */
  register(username: string, email: string, password: string) {
    let postData = {
      name: username,
      email: email,
      password: password,
      role: 'manager'
    }
    return this._http
      .post<any>(`${environment.apiUrl}register`, postData)
      .pipe(
        map(result => {
          let user = result.data.user;

          if (user) {
            // Display Success Register message!
            setTimeout(() => {
              this._toastrService.success(
                'User register successfully. Enjoy! 🎉' +
                'Please Login withyour credentials',
                '👋 Welcome, ' + user.name + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            this.router.navigate(['/authentication/login']);

            // notify
            // this.currentUserSubject.next(user);
          }
          // login successful if there's a jwt token in the response
          // if (user && user.token) {
          //   // store user details and jwt token in local storage to keep user logged in between page refreshes
          //   localStorage.setItem('currentUser', JSON.stringify(user));

          //   // Display welcome toast!
          //   setTimeout(() => {
          //     this._toastrService.success(
          //       'You have successfully logged in as an ' +
          //         user.role +
          //         ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
          //       '👋 Welcome, ' + user.name + '!',
          //       { toastClass: 'toast ngx-toastr', closeButton: true }
          //     );
          //   }, 2500);

          //   // notify
          //   this.currentUserSubject.next(user);
          // }

          // return user;
        })
      );
  }


  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
