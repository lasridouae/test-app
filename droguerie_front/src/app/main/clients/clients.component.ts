import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Client } from '../models/client';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ClientsComponent implements OnInit {


  // Private
  public clients: Client[] = []
  private tempData = [];
  private toastRef: any;
  private options: GlobalConfig;


  // public
  public contentHeader: object;
  public basicSelectedOption: number = 10;
  public SelectionType = SelectionType;
  public exportCSVData = [];
  public no_data_text = "Aucune Donnée Disponible"
  public ColumnMode = ColumnMode;
  public sideBarComponent = 'client-sidebar-right';
  public content_loaded: boolean
  public dataFromChild: Client;

  /* Subscription */
  public clientSup: Subscription = new Subscription();

  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor(private router: Router,public exportData: ExportService, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) {
    this.options = this.toastr.toastrConfig;
  }


  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.clientSup.unsubscribe();
  }




  receiveData(event) {
    this.dataFromChild = event.object;
    if (event.operation == 'add') {
      this.clients = [
        event.object,
        ...this.clients
      ];
    } else if (event.operation == 'update') {
      // const entries = Object.entries(event.object);
      const itemIndex = this.clients.map(c => c.id).indexOf(event.object.id);
      this.clients.splice(itemIndex, 1, event.object);
      this.clients = [...this.clients];
    }
  }


  /**
   * On init
   */
  async ngOnInit() {
    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Clients',
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
            name: 'Clients',
            isLink: false,
            // link: '/clients/list'
          }
        ]
      }
    };

    await this.getAllClient();
    // this.dataService.toastrSuccess("Clients retrieved successfully");

  }

  async getAllClient() {
    this.clientSup = this.dataService
      .get('clients')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.clients = await res.data;

          // Get First 4 words in column Adresse
          for (let index = 0; index < this.clients.length; index++) {
            this.clients[index].adresse = this.clients[index].adresse.split(' ').slice(0, 4).join(' ');
          }

          this.tempData = await this.clients;
          this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data client, " + error);
        });
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.clients = temp;
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
        that.dataService.delete('clients', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllClient();
            that.dataService.toastrInfo("Client has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting client, " + error);
          });

      }
    });


  }

  createItemSideBar() {
    this.dataService.createNewObject('clients');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }
  setItemSideBar(idRef) {
    this.dataService.setCurrentObject(idRef, "clients", 'clients');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }


}
