import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

  // Private
  public users: User[] = []
  private tempData = [];
  private toastRef: any;
  private options: GlobalConfig;
  private currentUser: any;

  // public
  public contentHeader: object;
  public basicSelectedOption: number = 10;
  public SelectionType = SelectionType;
  public exportCSVData = [];
  public no_data_text = "Aucune Donnée Disponible"
  public ColumnMode = ColumnMode;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_USER_RSC + '/';
  public content_loaded: boolean

  /* Subscription */
  public usersSup: Subscription = new Subscription();
  public uodateStatusSup: Subscription = new Subscription();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router,public exportData: ExportService, private dataService: DataService, private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.usersSup.unsubscribe();
    this.uodateStatusSup.unsubscribe();
    this.content_loaded = false;
  }

  /**
   * On init
   */
  async ngOnInit() {

    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Users',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Users',
            isLink: false
          }
        ]
      }
    };

    await this.getAllUsers();
    // this.dataService.toastrSuccess("Users retrieveawait this.getAlld successfully");
  }

  async getAllUsers() {
    this.usersSup = this.dataService
      .get('user/')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.users = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;

          this.users.forEach(user => {

          });

          // Remove User connected from array users in table
          let id_user_connected = null;
          for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].id === this.currentUser.id) {
              id_user_connected = index;
            }
          }
          this.users.splice(id_user_connected, 1);

          // console.log("users : ",this.users)
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }



  async updateStatus(user, event) {

    // update status user 
    user.status = event.target.checked ? 1 : 0;
    this.usersSup = this.dataService
      .post('users/updateStatus', user)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.users = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;

          // Remove User connected from array users in table
          let id_user_connected = null;
          for (let index = 0; index < this.users.length; index++) {
            if (this.users[index].id === this.currentUser.id) {
              id_user_connected = index;
            }
          }
          this.users.splice(id_user_connected, 1);

          this.table.offset = 0;

          this.dataService.toastrSuccess("Status has been updated");

          // console.log("users : ",this.users)
        }
      }, async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteItem(id) {
    let that = this;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(async function (result) {
      if (await result.value) {

        // code
        const data = { id: id };
        that.dataService.delete('users', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllUsers();
            that.dataService.toastrInfo("User has been deleted")
            that.table.offset = 0;
          }
        }, async (error: any) => {
          console.log(error)
          that.dataService.toastrDanger("Error while deleting use, " + error);
        });

      }
    });


  }


}
