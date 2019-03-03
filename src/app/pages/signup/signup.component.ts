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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;
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

  // Initialize the signupform and add its validators
  private createForm(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]]
    });
  }


  public submit(): void {

    // If the signup form is valid we take the values and we send it to the authservice to create an account
    if (this.signupForm.valid) {
      this.loadingService.isLoading.next(true);
      
      const { firstname, lastname, email, password } = this.signupForm.value;
      this.loadingService.isLoading.next(false);
      this.subscriptions.push(
        this.auth.signup(firstname, lastname, email, password).subscribe(success => {
          if (success) {
            this.router.navigateByUrl(this.returnUrl);
          }
          this.loadingService.isLoading.next(false);
        })
      );

    } else {
      const failedLoginAlert = new Alert('Your email, password, First Name or Last Name, is not completed, try again', AlertType.Danger);

      this.loadingService.isLoading.next(false);
      this.alertService.alerts.next(failedLoginAlert);

    }

  }
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/chat';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
