import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {NotificationService} from '../../../../services/notification.service';
import {RedirectService} from '../../../../services/redirect.service';

@Component({
  selector: 'app-notification-tab',
  templateUrl: './notification-tab.component.html',
  styleUrls: ['./notification-tab.component.css']
})
export class NotificationTabComponent implements OnInit {
  listOfUsers = [];
  private usersTable: any;
  private tableWidget: any;
  public selectedRowsId: any = [];
  title: string;
  message: string;
  infoMessage: string;

  constructor (private router: Router, private fb: FormBuilder, private el: ElementRef, private userService: UserService,
               private notificationService: NotificationService, private redirectService: RedirectService) {
  }

  ngOnInit () {
    this.getAllUsers(() => {
      this.loadUsers();
    });
  }

  public getAllUsers(callback) {
    this.userService.getAllUserWithoutFilter().then((result) => {
      this.listOfUsers = result['userList'];
      callback();
    }, (error) => {
      if (error.status === 401) {
        if (error.status === 401) {
          this.redirectService.redirectOnLoginPage();
        } else {
          this.infoMessage = 'Something wrong, please try again.';
        }
      }
    });

  }

  public loadUsers(): void {
    if (this.tableWidget) {
      this.tableWidget.destroy();
    }
    const tableOptions: any = {
      data: this.listOfUsers,
      responsive: true,
      lengthMenu: [5, 10, 15],
      select: {
        style: 'multi'
      },
      paging: true,
      columns: [
        {title: 'User name', data: 'name'},
        {title: 'Email', data: 'email'},
        {title: 'Role', data: 'role'},
        {title: 'Company', data: 'companyName'}
      ]
    };
    this.usersTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.usersTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      this.selectedRowsId = this.tableWidget.rows('.selected')[0];
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRowsId = this.tableWidget.rows('.selected')[0];
    });
  }

  onSend() {
    $('#infoBox').modal('show');
    if (this.selectedRowsId.length == 0) {
      this.infoMessage = 'Select at least one user to sending messages';
    } else if (!this.title || !this.message) {
      this.infoMessage = 'Title and text message are mandatory fields!';
    } else {
      const notificationData = new FormData();
      if (this.selectedRowsId.length > 0 && this.selectedRowsId.length !== this.listOfUsers.length) {
        this.selectedRowsId.forEach((idx) => {
          notificationData.append('emails', this.listOfUsers[idx].email);
        });
      }

      notificationData.append('title', this.title);
      notificationData.append('message', this.message);

      this.notificationService.postNotification(notificationData).then(() => {
        this.infoMessage = 'Messages were sent';
        this.resetForm();
      }, error => {
        if (error.status === 401) {
          this.redirectService.redirectOnLoginPage();
        } else {
          this.infoMessage = 'Something wrong, please try again.';
        }
      });
    }
  }

  resetForm() {
    this.title = '';
    this.message = '';
  }

  onSelectAll() {
    this.tableWidget.rows().select();
    this.selectedRowsId = this.tableWidget.rows('.selected')[0];
  }

  onSelectNone() {
    this.tableWidget.rows().deselect();
    this.selectedRowsId = [];
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

}
