import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from './../../classes/alert';
import { AlertService } from './../../services/alert.service';
import { AlertType } from './../../enums/alert-type.enum';
import { LoadingService } from 'src/app/services/loading.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  private subscriptions: Subscription[] = [];
  private returnUrl: string;

  constructor(private fb: FormBuilder,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

    this.createForm();
  }

  // Initilize loginform
  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }


  public submit(): void {

    // if the login form is valid we will login and it will redirect us to the chat page
    this.loadingService.isLoading.next(true);
     
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.subscriptions.push(
        this.auth.login(email, password).subscribe(success => {
          if (success) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.displayFailedLoginAlert();
          }
          this.loadingService.isLoading.next(false);
        })
      );
    } else {
      this.loadingService.isLoading.next(false);
      this.displayFailedLoginAlert();

    }
  }



  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Method to display a failed alert

  private displayFailedLoginAlert(): void {
    const failedLoginAlert = new Alert('Your email or password were invalid, try again', AlertType.Danger);


    this.alertService.alerts.next(failedLoginAlert);
  }
}

