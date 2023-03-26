import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Product } from '../models/product';
import { Category } from '../models/Category';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  // Private
  public products: Product[] = []
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
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public content_loaded: boolean

  /* Subscription */
  public productsSup: Subscription = new Subscription();
  public categoriesSup: Subscription = new Subscription();
  public searchSup: Subscription = new Subscription();

  /*search params*/
  category;
  search: string;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router,public exportData: ExportService, private dataService: DataService, private toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.productsSup.unsubscribe();
    this.categoriesSup.unsubscribe();
    this.searchSup.unsubscribe();
    this.content_loaded = false;
  }


  /**
   * On init
   */
  async ngOnInit() {

    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Products',
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
            name: 'Products',
            isLink: false
          }
        ]
      }
    };

    await this.getAllProducts();
    await this.getAllCategories();
    // this.dataService.toastrSuccess("Products retrieved successfully");
  }

  async getAllProducts() {
    this.productsSup = this.dataService
      .get('products')
      .subscribe(async (res: any) => {
        if (res.success) {

          this.products = await res.data;
          this.tempData = await res.data;
          // this.content_loaded = true;

          // console.log("products : ",this.products)
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }

  async getAllCategories() {
    this.categoriesSup = this.dataService
      .get('categories')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.categories = await res.data;
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
    let filterFlag = false;
    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.products = temp;
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
        that.content_loaded = false;

        // code
        const data = { id: id };
        that.dataService.delete('products', data).subscribe(async (res: any) => {
          if (res.success) {
            await that.getAllProducts();
            that.dataService.toastrInfo("Product has been deleted")
            that.content_loaded = true;

          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting product, " + error);
          });

      }
    });
    this.table.offset = 0;


  }


  /** Search function */
  async searchFunc(category, search) {
    this.content_loaded = false;
    this.searchSup.unsubscribe()
    const data = [{ search: search ? search : "", category: category ? category.id : "" }];

    this.searchSup = this.dataService
      .searchFunction("searchProducts", data)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.products = await res.data;
          this.tempData = await res.data;
          this.content_loaded = true;

          // console.log("products : ",this.products)
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }

}
