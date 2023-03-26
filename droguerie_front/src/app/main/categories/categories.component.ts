import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Client } from '../models/client';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Router } from '@angular/router';
import { Category } from '../models/category';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CategoriesComponent implements OnInit {

  // Private
  public categories: Category[] = []
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
  public sideBarComponent = 'category-sidebar-right';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_CATEGORY_RSC + '/';
  public content_loaded: boolean
  public dataFromChild: Category;


  /* Subscription */
  public categoriesSup: Subscription = new Subscription();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) {
    this.options = this.toastr.toastrConfig;
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.categoriesSup.unsubscribe();
  }

  async receiveData(event) {
    await this.getAllCategories();
    // this.dataFromChild = event.object;
    // if(event.operation == 'add'){
    //   this.categories = [
    //     event.object,
    //     ...this.categories
    //   ];
    // }else if(event.operation == 'update'){
    //   // const entries = Object.entries(event.object);
    //   const itemIndex = this.categories.map(c => c.id).indexOf(event.object.id);
    //   this.categories.splice(itemIndex,1,event.object);
    //   this.categories = [...this.categories];
    // }
  }

  /**
   * On init
   */
  async ngOnInit() {

    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Categories',
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
            name: 'Categories',
            isLink: false,
            // link: '/categories/list'
          }
        ]
      }
    };

    await this.getAllCategories();
    // this.dataService.toastrSuccess("Categories retrieved successfully");

  }

  async getAllCategories() {
    this.categoriesSup = this.dataService
      .get('categories')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.categories = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;
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
    this.categories = temp;
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

        const data = { id: id };
        that.dataService.delete('categories/destroy', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllCategories();
            that.dataService.toastrInfo("Category has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting category, " + error);
          });
      }
    });


  }

  createItemSideBar() {
    this.dataService.createNewObject("categories");
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }
  setItemSideBar(idRef) {
    this.dataService.setCurrentObject(idRef, "categories", "categories");
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }


}
