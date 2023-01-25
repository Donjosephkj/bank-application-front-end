import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mini-statement',
  templateUrl: './mini-statement.component.html',
  styleUrls: ['./mini-statement.component.css'],
})
export class MiniStatementComponent implements OnInit {
  AllTransaction: any;
  searchKey: string = '';

  constructor(private api: ApiService,private router:Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      alert('session Expired!..Please Login')
      this.router.navigateByUrl('')

    }

    this.api.getAllTransactions().subscribe((result: any) => {
      this.AllTransaction = result.transaction;
      console.log(this.AllTransaction);
    });
  }
  search(event: any) {
    this.searchKey = event.target.value;
  }

  //generatePdf
  generatePdf() {
    var pdf = new jspdf();
    let col = [
      'Transacton Type',
      'From Account Number',
      'To Account Number',
      'Amount',
    ];
    let row: any = [];
    pdf.setFontSize(16);
    pdf.text('TRANSACTION HISTORY', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);

    //convert AllTransacton to nested array
    var item = this.AllTransaction;
    for (let element of item) {
      var temp = [
        element.type,
        element.fromAcno,
        element.toAcno,
        element.amount,
      ];

      row.push(temp);
    }
    (pdf as any).autoTable(col, row, { startY: 10 });
    // Open PDF document in browser's new tab
    pdf.output('dataurlnewwindow');

    // Download PDF doc
    pdf.save('ministatement.pdf');
  }
}
