import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Category } from 'app/main/models/Category';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CategoriesComponent } from '../categories.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-sidebar-right',
  templateUrl: './category-sidebar-right.component.html',
  styleUrls: ['./category-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // standalone: true,
  // imports: [CommonModule]

})
export class CategorySidebarRightComponent implements OnInit {

  @Output() dataEvent = new EventEmitter<any>();


  //Public 
  public category: Category = new Category();
  // public currentCategoryEdit: Category = new Category();;
  public categories: Category[] = []
  public isDataEmpty;
  public sideBarComponent = 'category-sidebar-right';
  public selectedFiles?: FileList;
  public currentFile?: File;
  public progress = 0;
  public message = '';
  public preview = '';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_CATEGORY_RSC + '/';
  public NoParentCategoryInstant = new Category();
  public parent_id_forSelectOption = 0;
  public optionsCategeries: any;
  public content_loaded: boolean
  public dataCompleted: Category;

  public selected = "";
  public underscore = "";

  /* Subscription */
  public AddCategorySup: Subscription = new Subscription();
  public UpdateCategorySup: Subscription = new Subscription();
  public ParentCategorySup: Subscription = new Subscription();
  public CurrentObjectChangeSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();
  selectedOptionParent: any;


  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) { }


  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.AddCategorySup.unsubscribe();
    this.UpdateCategorySup.unsubscribe();
    this.ParentCategorySup.unsubscribe();
    this.CurrentObjectChangeSup.unsubscribe();
    this.content_loaded = false;

  }

  emitData(operation) {
    this.selectedOptionParent = undefined;
    const data = {
      object: this.dataCompleted,
      operation: operation,
    }
    this.dataEvent.emit(data);
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    this.content_loaded = false;

  }

  /**
   * Submit
   *
   * @param form
   */
  addCategory(form) {
    if (form.valid) {

      this.selectedOptionParent ? this.category.parent_id = this.selectedOptionParent.value : 0;
      this.AddCategorySup = this.dataService.post('categories', this.category).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Category has been created");
          this.dataCompleted = await res.data;
          this.emitData("add");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while inserting User, " + error);
        });
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  editCategory(form) {
    if (form.valid) {


      this.selectedOptionParent ? this.category.parent_id = this.selectedOptionParent.value : this.category.parent_id = 0;
      this.UpdateCategorySup = this.dataService.put('categories', this.category).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Category has been updated");
          this.dataCompleted = await res.data;
          this.emitData("update");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while editing User, " + error);
        });
    }
  }

  ngOnInit(): void {

    this.content_loaded = false;

    // initialization of empty object of category (-No Parent-) 
    this.NoParentCategoryInstant.id = 0;
    this.NoParentCategoryInstant.name = "No Parent";

    this.CurrentObjectChangeSup = this.dataService.onCurrentObjectChange.subscribe(async response => {

      this.content_loaded = false;
      this.categories = [];
      this.category = new Category();

      if (await response.success) {
        this.category = response.data;
        this.isDataEmpty = false;

        // set list of category in select (**Edit** route)
        this.ParentCategorySup = this.dataService.onParentCategoryEditRoute.subscribe(async response => {
          if (await response.success) {
            this.categories = await response.data[0];
            this.category = await response.data[1];

            this.categories = this.categories.filter(item => item.id !== 0);
            this.categories = [this.NoParentCategoryInstant, ...this.categories];

            this.categories = this.recursiveFormat(this.categories);
            this.selectedOptionParent = this.getSelectedCategoryParent(this.categories, this.category);

            this.content_loaded = true;

          }
        },
          async (error: any) => {
            console.log(error)
            this.dataService.toastrDanger("Error while taking Data parents categories, " + error);
          });



      } else {
        this.category = new Category();
        this.category.parent_id = 0;
        this.parent_id_forSelectOption = 0;
        this.isDataEmpty = true;

        // set list of category in select (*Create** route)
        this.ParentCategorySup = this.dataService.onParentCategoryCreateRoute.subscribe(async response => {
          if (await response.success) {
            this.categories = response.data;

            this.categories = this.categories.filter(item => item.id !== 0);
            this.categories = [this.NoParentCategoryInstant, ...this.categories];

            this.categories = this.recursiveFormat(this.categories);
            this.content_loaded = true;



          }
        },
          async (error: any) => {
            console.log(error)
            this.dataService.toastrDanger("Error while taking Data parents categories, " + error);
          });

      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking Data category, " + error);
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

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }


  // When click button Uploade image to Server
  upload(): void {
    let data = null;
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.dataService.uploadImageFile('catagories/uploadImage', this.currentFile,).subscribe({
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
                Swal.fire({
                  icon: 'success',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                this.category.icon = data.filename;
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

  getSelectedCategoryParent(categories: any[], category: any): any {
    let option = categories.find(x => x.value === category.parent_id);
    return option
  }


}
