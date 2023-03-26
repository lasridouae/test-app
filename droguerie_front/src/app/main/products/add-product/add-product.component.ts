import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { Product } from 'app/main/models/product';
import { Category } from 'app/main/models/Category';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddProductComponent implements OnInit {

  //Public 
  public contentHeader: object;
  public product: Product = new Product();
  public categories: Category[] = []
  public isDataEmpty;
  public sideBarComponent = 'category-sidebar-right';
  public selectedFiles?: FileList;
  public currentFile?: File;
  public progress = 0;
  public message = '';
  public preview = '';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public NoParentCategoryInstant = new Category();
  public parent_id_forSelectOption = 0;
  public optionsCategeries = '';
  public content_loaded: boolean
  selectedOptionParent: any;

  public selected = "";
  public underscore = "";
  public uploading = false;

  /* Subscription */
  public AddCategorySup: Subscription = new Subscription();
  public ParentCategorySup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private _coreSidebarService: CoreSidebarService
  ) { }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.AddCategorySup.unsubscribe();
    this.ParentCategorySup.unsubscribe();
    this.content_loaded = false;
  }

  /**
   * Submit
   *
   * @param form
   */
  addProduct(form) {
    if (form.valid) {

      this.selectedOptionParent ? this.product.category_id = this.selectedOptionParent.value : this.product.category_id = 0;

      this.AddCategorySup = this.dataService.post('products', this.product).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Product has been created");
          this.content_loaded = false;
          setTimeout(async () => {
            // Redirect to list
            await this.router.navigate(['/products/list']);
          }, 1500);
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while adding Products, " + error);
        });
    }
  }

  ngOnInit(): void {
    this.content_loaded = false;
    this.selectedOptionParent = undefined;

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
            name: 'Add Product',
            isLink: false
          }
        ]
      }
    };

    this.ParentCategorySup = this.dataService
      .get('categories/create')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.categories = await res.data;

          // initialization of empty object of category (-No Parent-) 
          this.NoParentCategoryInstant.id = 0;
          this.NoParentCategoryInstant.name = "No Parent";

          this.categories = this.categories.filter(item => item.id !== 0);
          this.categories = [this.NoParentCategoryInstant, ...this.categories];

          this.categories = this.recursiveFormat(this.categories);
          this.selectedOptionParent = this.getSelectedCategoryParent(this.categories, 0  );
          this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });

  }

  // When Select file from input
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.uploading = true;

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);

        this.upload();
      }
    }
  }

  // Uploade image to Server
  upload(): void {
    let data = null;
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.dataService.uploadImageFile('products/uploadImage', this.currentFile,).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            if (event instanceof HttpResponse) {
              data = event.body.data
              this.message = event.body.msg
              if (data.result = "ok") {
                this.uploading = false;
                Swal.fire({
                  icon: 'success',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                this.product.photos = data.filename;
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              }

              this.selectedFiles = undefined;
              this.currentFile = undefined;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }
            Swal.fire({
              icon: 'error',
              text: this.message,
              confirmButtonColor: "#6FAAE2",
            })
            this.progress = 0;
            this.selectedFiles = undefined;
            this.currentFile = undefined;
            setTimeout(() => {
              Swal.close()
            }, 3000);

          },
        });
      }

    }
  }

  createItemSideBar() {
    this.dataService.createNewObject('clients');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

  // Seconde Method for category parent
  formatOption(category: any, prefix: string = ''): string {
    return prefix + ' ' + category.name;
  }

  recursiveFormat(categories: any[], prefix: string = ''): any[] {
    let options = [];
    for (let category of categories) {
      options.push({
        label: this.formatOption(category, prefix),
        value: category.id
      });

      if (category.category_children && category.category_children.length) {
        options = options.concat(this.recursiveFormat(category.category_children, prefix + '--'));
      }
    }
    return options;
  }

  getSelectedCategoryParent(categories: any[], category_parent: number = 0): any {
    let option = categories.find(x => x.value === category_parent);
    return option
  }

}
