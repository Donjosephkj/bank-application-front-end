import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import party from 'party-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  transferSuccesMsg: string = '';
  transferErrorMsg: string = '';
  isCollapse: boolean = true;
  username: string = '';
  currentAcno: number = 0;
  currentBalance: number = 0;
  depositSuccessMsg: string = '';
  depositErrorMsg: string = '';
  logOutdiv:boolean=false
  deleteConfirm:boolean=false
  deleteSpinnerdiv:boolean=false
  acno:any=''

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      alert('session Expired!..Please Login')
      this.router.navigateByUrl('')

    }

    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username') || '';
    }
  }
  transferForm = this.fb.group({
    amt: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    pswd: ['', [Validators.required, Validators.pattern('[0-9a-zA-Z]*')]],
  });

  amountForm = this.fb.group({
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
  });

  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  getBalance() {
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = JSON.parse(localStorage.getItem('currentAcno') || '');
    }
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      this.currentBalance = result.balance;
    });
  }
  deposit() {
    if (this.amountForm.valid) {
      let amount = this.amountForm.value.amount;
      this.currentAcno = JSON.parse(localStorage.getItem('currentAcno') || '');
      this.api.deposit(this.currentAcno, amount).subscribe(
        (result: any) => {
          console.log(result);
          this.depositSuccessMsg = result.message;
          setTimeout(() => {
            this.amountForm.reset();
            this.depositSuccessMsg = '';
          }, 3000);
        },
        (result: any) => {
          this.depositErrorMsg = result.error.message;
          setTimeout(() => {
            this.amountForm.reset();
            this.depositErrorMsg = '';
          }, 3000);
        }
      );
    } else {
      alert('invalid');
    }
  }
  //showconfetti
  showconfetti(source: any) {
    party.confetti(source);
  }

  //form reset after modal close
  transferFormReset() {
    this.transferForm.reset();
  }
  transfer(source: any) {
    if (this.transferForm.valid) {
      let toAcno = this.transferForm.value.acno;
      let pswd = this.transferForm.value.pswd;
      let amt = this.transferForm.value.amt;
      //api cal
      this.api.fundTransfer(toAcno, pswd, amt).subscribe(
        //success
        (result: any) => {
          this.transferSuccesMsg = result.message;
          party.confetti(source);
          setTimeout(() => {
            this.transferSuccesMsg = '';
            this.transferForm.reset();
          }, 3000);
        },
        //error
        (result: any) => {
          this.transferErrorMsg = result.error.message;
          setTimeout(() => {
            this.transferErrorMsg = '';
            this.transferForm.reset();
          }, 3000);
        }
      );
    } else {
      alert('Invalid Form');
    }
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('currentAcno');
    this.logOutdiv=true
    setTimeout(() => {
      //navigate to login
      this.router.navigateByUrl('')
      this.logOutdiv=false
    }, 2000);
  }

  //delete acount 

  deleteAccount(){
    this.acno=localStorage.getItem('currentAcno')
    this.deleteConfirm=true
  }
  onCancel(){
    this.acno=''
    this.deleteConfirm=false
  }
  onDelete(event:any){
    let deleteAcno=JSON.parse(event)
    this.api.deleteAccount(deleteAcno)
    .subscribe((result:any)=>{
      this.acno=''
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('currentAcno');
      this.deleteSpinnerdiv=true

      setTimeout(() => {
        //navigate to login
        this.router.navigateByUrl('')
        this.deleteSpinnerdiv=false

      }, 2000);
    },
    (result)=>{
      alert(result.error.message)
    })
  }
}
