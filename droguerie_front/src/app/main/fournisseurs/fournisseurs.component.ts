import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Router } from '@angular/router';
import { Fournisseur } from '../models/fournisseur';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FournisseursComponent implements OnInit {

  // Private
  public fournisseurs: Fournisseur[] = []
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
  public sideBarComponent = 'fournisseur-sidebar-right';
  public content_loaded: boolean
  public dataFromChild: Fournisseur;

  /* Subscription */
  public fournisseurSup: Subscription = new Subscription();

  @ViewChild(DatatableComponent) table: DatatableComponent;



  constructor(private router: Router,public exportData: ExportService, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) {
    this.options = this.toastr.toastrConfig;
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.fournisseurSup.unsubscribe();
  }

  /**
   * On init
   */
  async ngOnInit() {
    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Fournisseurs',
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
            name: 'Fournisseurs',
            isLink: false,
            // link: '/fournisseur/list'
          }
        ]
      }
    };

    await this.getAllFournisseur();
    // this.dataService.toastrSuccess("Fournisseur retrieved successfully");
  }


  receiveData(event) {
    this.dataFromChild = event.object;
    if (event.operation == 'add') {
      this.fournisseurs = [
        event.object,
        ...this.fournisseurs
      ];
    } else if (event.operation == 'update') {
      // const entries = Object.entries(event.object);
      const itemIndex = this.fournisseurs.map(c => c.id).indexOf(event.object.id);
      this.fournisseurs.splice(itemIndex, 1, event.object);
      this.fournisseurs = [...this.fournisseurs];
    }
  }


  async getAllFournisseur() {
    this.fournisseurSup = this.dataService
      .get('fournisseurs')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.fournisseurs = await res.data;

          // Get First 4 words in column Adresse
          for (let index = 0; index < this.fournisseurs.length; index++) {
            this.fournisseurs[index].adresse = this.fournisseurs[index].adresse.split(' ').slice(0, 4).join(' ');
          }

          this.tempData = await this.fournisseurs;
          this.content_loaded = true;

          // console.log("clients:",this.fournisseurs);
        }
      },
        async (error: any) => {
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
    this.fournisseurs = temp;
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
        that.dataService.delete('fournisseurs', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllFournisseur();
            that.dataService.toastrInfo("Fournisseur has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting Fournisseur " + error);
          });

      }
    });


  }

  createItemSideBar() {
    this.dataService.createNewObject('fournisseurs');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }
  setItemSideBar(idRef) {
    this.dataService.setCurrentObject(idRef, "fournisseurs", 'fournisseurs');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

}
