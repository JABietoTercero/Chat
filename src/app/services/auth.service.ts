import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { Alert } from '../classes/alert';
import { AlertService } from './alert.service';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: Observable<User | null>;

  constructor(private router: Router,
    private alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {

    //TODO obtener el user de firebase 
    this.currentUser = this.afAuth.authState.pipe(switchMap((user) => {
      if (user) {
        return this.db.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }))
  }


  public signup(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    //Firebase create a user with email And password
    return from(
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.user.uid}`);
          const updatedUser = {
            id: user.user.uid,
            email: user.user.email,
            firstName,
            lastName,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-4d2ed.appspot.com/o/pexels-photo-1805164%20Cropped.jpg?alt=media&token=282dde75-5c4f-4047-aedb-9b9908075f03'
          }
          userRef.set(updatedUser);
          return true;
        })
        .catch((err) => false)
    );
  }

  public login(email: string, password: string): Observable<boolean> {
    // return true if the email and password match with the firebase data
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => true)
        .catch((err) => false)
    )
  }
  public logout(): void {
    //TODO call signup function
    this.afAuth.auth.signOut().then(() => {

      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been signed out'));

    });

  }
}
