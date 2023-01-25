import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private api: ApiService,private router:Router) {}
  registerForm = this.fb.group({
    //array
    uname: ['', [Validators.required, Validators.pattern('[a-zA-Z]*')]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  Register() {
    if (this.registerForm.valid) {
      let uname = this.registerForm.value.uname;
      let acno = this.registerForm.value.acno;
      let pswd = this.registerForm.value.pswd;
      this.api.register(uname, acno, pswd).subscribe(
        (result: any) => {
          alert(result.message);
          //navigate to login
          this.router.navigateByUrl('')
        },
        (result: any) => {
          alert(result.error.message);
        }
      );
    } else {
      alert('invalid');
    }
  }
}
