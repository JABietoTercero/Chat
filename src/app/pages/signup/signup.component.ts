import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from './../../classes/alert';
import { AlertService } from './../../services/alert.service';
import { AlertType } from './../../enums/alert-type.enum';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm: FormGroup;

  constructor(private fb: FormBuilder, private alertService: AlertService, private loadingService: LoadingService) {
    this.createForm();
  }

  private createForm(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]]
    });
  }


  public submit(): void {

    this.loadingService.isLoading.next(true);
    if (this.signupForm.valid) {
      // TODO call the auth service
      const { email, password, firstname, lastname } = this.signupForm.value;
      console.log(`Email: ${email}, Password: ${password},FirstName: ${firstname},LastName: ${lastname}`);
      this.loadingService.isLoading.next(false);
    } else {
      const failedLoginAlert = new Alert('Your email, password, First Name or Last Name, is not completed, try again', AlertType.Danger);
      setTimeout(() => {
        this.loadingService.isLoading.next(false);
        this.alertService.alert.next(failedLoginAlert);
      }, 2000);
    }

  }
  ngOnInit() {
  }

}
