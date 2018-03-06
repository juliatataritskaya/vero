import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {NotificationService} from '../../../../services/notification.service';
import {RedirectService} from '../../../../services/redirect.service';

declare var $: any;

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
      console.log(this.listOfUsers);
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
        {
          "title": "",
          "data": 'userId',
          "render": function(data, type, row) {
            if (type === 'display') {
              return '<input id="check' + data +'" type="checkbox" class="watchlist-checkbox">';
            }
            return data;
          },
          "className": "dt-body-center"
        },
        {title: 'User name', data: 'name'},
        {title: 'Email', data: 'email'},
        {title: 'Role', data: 'role'},
        {title: 'Company', data: 'companyName'}
      ]
    };
    this.usersTable = $(this.el.nativeElement.querySelector('table'));
    this.tableWidget = this.usersTable.DataTable(tableOptions);
    this.tableWidget.on('select', (e, dt, type, indexes) => {
      console.log(indexes);
      this.selectedRowsId = this.tableWidget.rows('.selected')[0];
      if (indexes.length <= 1) {
        $('#check' + this.listOfUsers[indexes].userId).attr('checked', 'checked');
      }
    });
    this.tableWidget.on('deselect', (e, dt, type, indexes) => {
      this.selectedRowsId = this.tableWidget.rows('.selected')[0];
      if (indexes.length <= 1) {
        $('#check' + this.listOfUsers[indexes].userId).removeAttr('checked');
      }
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
        console.log(this.selectedRowsId.length);
        this.infoMessage = this.selectedRowsId.length > 1 ? 'Messages were sent' : 'Message was sent';
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
    $('#messageForNotification').modal('hide');
    this.title = '';
    this.message = '';
  }

  onSelectAll() {
    this.tableWidget.rows().select();
    $('input').attr('checked', 'checked');
    this.selectedRowsId = this.tableWidget.rows('.selected')[0];
  }

  onSelectNone() {
    this.tableWidget.rows().deselect();
    this.selectedRowsId = [];
    $('input').removeAttr('checked');
  }

  closeModal() {
    $('#infoBox').modal('hide');
    this.infoMessage = null;
  }

}
