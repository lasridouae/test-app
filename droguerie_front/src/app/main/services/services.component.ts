import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from 'app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Services } from '../models/service';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ServicesComponent implements OnInit {

  // Private
  private tempData = [];
  public services: Services[] = [];


  // public
  public contentHeader: object;
  public content_loaded: boolean;
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public sideBarComponent = 'service-sidebar-right';

  @ViewChild(DatatableComponent) table: DatatableComponent;
  /* Subscription */
  public ventSup: Subscription = new Subscription();
  
  constructor(private dataService: DataService, private toastr: ToastrService,private _coreSidebarService: CoreSidebarService,public exportData: ExportService) { }

  ngOnInit(): void {

    this.content_loaded = false;


    // content header
    this.contentHeader = {
      headerTitle: 'Services',
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
            name: 'services',
            isLink: false,
            // link: '/services/list'
          }
        ]
      }
    };
    this.getAllServices();
  }


  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.ventSup.unsubscribe();
  }

  async getAllServices() {

    this.ventSup = this.dataService
      .get('services')
      .subscribe(async (res: any) => {
        if (res.success) {

          this.services = await res.data;

          // Get First 4 words in column Adresse
          // for (let index = 0; index < this.fournisseurs.length; index++) {
          //   this.fournisseurs[index].adresse = this.fournisseurs[index].adresse.split(' ').slice(0,4).join(' ');
          // }

          this.tempData = await this.services;
          this.content_loaded = true;

          // console.log("clients:",this.fournisseurs);
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
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
        that.dataService.delete('services', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllServices();
            that.dataService.toastrInfo("service has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting service " + error);
          });

      }
    });

  }

  receiveAdd(event) {
    // this.dataFromChild = event;
    this.services = [
      event,
      ...this.services
    ];
  }
  receiveEdit(event) {
    // this.dataFromChild = event;
    this.getAllServices();
    // console.log("event:" ,event );
  }
  filterUpdate(event) {

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.services = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  createItemSideBar() {
    this.dataService.createNewObject('services');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }
  setItemSideBar(idRef) {
    this.dataService.setCurrentObject(idRef, "services", 'services');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

}
