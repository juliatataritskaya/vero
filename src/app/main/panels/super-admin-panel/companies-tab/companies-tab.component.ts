import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-companies-tab',
  templateUrl: './companies-tab.component.html',
  styleUrls: ['./companies-tab.component.css']
})
export class CompaniesTabComponent implements OnInit {
  private companiesTable: any;
  private tableWidget: any;
  @Input() companies: any;
  @Output() shipmentSelected: EventEmitter<any> = new EventEmitter();
  constructor(private el: ElementRef) { }

  ngOnInit () {
    this.companies = [
      {name: 'Test', address: 'St. Good', contact_details: 'phone: 1212121'},
      {name: 'Test2', address: 'St. Good1', contact_details: 'phone: 121212756'},
      {name: 'Test3', address: 'St. Good2', contact_details: 'phone: 121212345'},
      {name: 'Test4', address: 'St. Good3', contact_details: 'phone: 12121286'},
      {name: 'Test5', address: 'St. Good4', contact_details: 'phone: 1214564'},
      {name: 'Test6', address: 'St. Good5', contact_details: 'phone: 121534654212'},
      {name: 'Test7', address: 'St. Good6', contact_details: 'phone: 1212456312'},
      {name: 'Test8', address: 'St. Good7', contact_details: 'phone: 12154756212'},
      {name: 'Test9', address: 'St. Good8', contact_details: 'phone: 12123465412'}
    ];
    this.loadCompanies();
  }

  public loadCompanies(): void {
    // if (this.tableWidget) {
    //   this.tableWidget.destroy();
    // }
    const tableOptions: any = {
      data: this.companies,
      responsive: true,
      lengthMenu: [ 5, 10, 15],
      select: true,
      paging: true,
      columns: [
        { title: 'Company name', data: 'name' },
        { title: 'Company address', data: 'address' },
        { title: 'Company contact details', data: 'contact_details' }
      ]

    };
    this.companiesTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.companiesTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.shipmentSelected.emit(this.companies[indexes[0]]);
    });
  }


}
