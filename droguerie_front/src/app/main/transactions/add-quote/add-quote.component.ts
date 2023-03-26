import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';

import { repeaterAnimation } from '../transactions.animation';
import { Client } from 'app/main/models/client';
import { Invoice } from 'app/main/models/invoice';
import { Product } from 'app/main/models/product';
import { OrderDetail } from 'app/main/models/orderDetail';
import { Setting } from 'app/main/models/setting';
import { coreConfig } from 'app/app-config';
import { CoreConfigService } from '@core/services/config.service';
import { Order } from 'app/main/models/order';
import { Fournisseur } from 'app/main/models/fournisseur';

@Component({
  selector: 'app-add-quote',
  templateUrl: './add-quote.component.html',
  styleUrls: ['./add-quote.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class AddQuoteComponent implements OnInit {

  //Public 
  public contentHeader: object;
  public quote: Invoice = new Invoice();
  public order: Order = new Order();
  public clients: Client[];
  public fournisseurs: Fournisseur[];
  public products: Product[] = []
  public orderDetails: OrderDetail[] = []
  public sub_total_order = 0;
  public total_order = 0;
  public discountOrder = 0;
  public taxOrder = 0;
  public setting: Setting = new Setting();
  public coreConfig: any;
  public paramType = "";
  public type_transaction = "";
  public appLogoImage = '';



  public customerSelected;
  // public productSelected = new Product();

  public isDataEmpty;
  public sideBarComponent = '';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public content_loaded: boolean


  /* Subscription */
  private AddQuoteSup: Subscription = new Subscription();
  private ListClientSup: Subscription = new Subscription();
  private ListFournisseurSup: Subscription = new Subscription();
  private ListProductsSup: Subscription = new Subscription();
  private CurrentSettingsSup: Subscription = new Subscription();
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private route: ActivatedRoute,

  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  receiveData(event) {
    if (this.paramType == "sale" || this.paramType == "simple_sale" || this.paramType == "quote") {
      this.clients = [
        event,
        ...this.clients
      ];
    } else if (this.paramType == "purchase") {
      this.fournisseurs = [
        event,
        ...this.fournisseurs
      ];
    }

  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.AddQuoteSup.unsubscribe();
    this.ListClientSup.unsubscribe();
    this.ListFournisseurSup.unsubscribe();
    this.ListProductsSup.unsubscribe();
    this.CurrentSettingsSup.unsubscribe();
    this.content_loaded = false;
  }


  // ng2-flatpickr options
  public dateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: [new Date()],
    altFormat: 'Y-n-j'
  };
  public dueDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    defaultDate: ['2020-05-17'],
    altFormat: 'Y-n-j',
    disableMobile: true
  };

  async ngOnInit() {
    this.content_loaded = false;
    this.paramType = this.route.snapshot.paramMap.get('type');

    this.orderDetails.push(new OrderDetail());

    // content header
    this.contentHeader = {
      headerTitle: 'Transactions',
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
            name: 'Add ' + this.paramType,
            isLink: false,
            // link: 'transactions/'+this.paramType+'/add'
          }
        ]
      }
    };

    if (this.paramType == "quote") {
      this.type_transaction = "invoice";
      this.sideBarComponent = 'client-sidebar-right';
      await this.getAllClients();

    } else if (this.paramType == "sale" || this.paramType == "simple_sale") {
      this.type_transaction = "order";
      this.sideBarComponent = 'client-sidebar-right';
      await this.getAllClients();

    } else if (this.paramType == "purchase") {
      this.type_transaction = "order";
      this.sideBarComponent = 'fournisseur-sidebar-right';
      await this.getAllFournisseurs();

    } else {
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    }

    await this.configApp();
    await this.getSettingApp();
    await this.getAllProducts();

  }


  async getAllClients() {
    this.ListClientSup = this.dataService
      .get('clients')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.clients = await res.data;
          // this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data of clients, " + error);
        });
  }

  async getAllFournisseurs() {
    this.ListFournisseurSup = this.dataService
      .get('fournisseurs')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.fournisseurs = await res.data;
          // this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data of fournisseurs, " + error);
        });
  }

  async getAllProducts() {
    this.ListClientSup = this.dataService
      .get('products')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.products = await res.data;
          this.content_loaded = true;
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data of Products, " + error);
        });
  }

  async getSettingApp() {
    this.CurrentSettingsSup = this.dataService.get('settings').subscribe(async (res: any) => {
      let data = null;
      if (res.success) {
        data = await res.data;
        this.setting = data;
      } else {
        console.log('Error while taking - Check your info input');
      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }

  async configApp() {
    // Subscribe to the config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
      this.appLogoImage = this.coreConfig.app.appLogoImage

    });
  }

  addItem() {
    this.orderDetails.push(new OrderDetail());
  }
  deleteItem(id) {
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails.indexOf(this.orderDetails[i]) === id) {
        this.orderDetails.splice(i, 1);
        break;
      }
    }
  }

  createItemSideBar() {
    this.dataService.createNewObject();
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

  /**
   * Submit
   *
   * @param form
   */
  async submitOrder(form) {
    if (this.customerSelected || this.paramType == 'simple_sale') {
      if (this.discountOrder >= this.sub_total_order || (this.taxOrder < 0 && this.taxOrder > 100)) {
        Swal.fire({
          icon: 'error',
          text: 'Please chose correct info for Discount and Tax info and check you info of product',
          confirmButtonColor: "#6FAAE2",
        })
      } else {
        if (this.orderDetails.length != 0) {
          if (this.formValidOrderDetails()) {

            // check if an item is empty and remove it 
            await this.checkEmptyItemsOrder(this.orderDetails);

            let postData = {
              order: {
                client_id: this.paramType == "sale" || this.paramType == "quote" ? this.customerSelected.id : null,
                fournisseur_id: this.paramType == "purchase" ? this.customerSelected.id : null,
                date: this.order.date ? new Date(this.order.date[0]) : new Date(),
                type_order: this.paramType,
                discount: this.discountOrder ? this.discountOrder : 0,
                tax: this.taxOrder ? this.taxOrder : 0,
              },
              orderDetails: this.orderDetails
            };
            if (this.paramType == 'quote') {
              postData['invoice'] = {
                transaction_date: this.order.date ? new Date(this.order.date[0]) : new Date(),
                notes: this.quote.notes ? this.quote.notes : '',
                type_invoice: this.paramType,
                in_out: 'out'
              }

            }

            this.AddQuoteSup = this.dataService.post('orders', postData).subscribe(async (res: any) => {
              if (res.success) {
                this.dataService.toastrSuccess(this.paramType + " has been created");
                this.content_loaded = false;
                setTimeout(async () => {
                  // Redirect to list
                  await this.router.navigate(['/transactions/' + this.paramType + '/list']);
                }, 1500);
              }
            },
              async (error: any) => {
                console.log(error)
                this.dataService.toastrDanger("Error while creating the " + this.paramType + ", " + error);
              });
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Form Items not valid, Please check these infos',
              confirmButtonColor: "#6FAAE2",
            })
          }
        } else {
          Swal.fire({
            icon: 'error',
            text: 'You cannot save the order without items ! You need one item at least to save.',
            confirmButtonColor: "#6FAAE2",
          })
        }

      }

    } else {
      Swal.fire({
        icon: 'error',
        text: 'Please fill in client information',
        confirmButtonColor: "#6FAAE2",
      })
    }

  }

  async checkEmptyItemsOrder(array) {
    let removeValFromIndex = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].product == null && array[i].quantity == null && array[i].product.unit_price == null) {
        removeValFromIndex.push(i);
      }
    }

    for (var i = removeValFromIndex.length - 1; i >= 0; i--)
      array.splice(removeValFromIndex[i], 1);
  }

  onChangeItems() {
    this.sub_total_order = 0;
    for (let i = 0; i < this.orderDetails.length; i++) {
      this.sub_total_order += ( (this.orderDetails[i].product ? this.orderDetails[i].product.unit_price : 0) - this.orderDetails[i].discount ) * this.orderDetails[i].quantity;
    }

    this.total_order = (this.sub_total_order - this.discountOrder) + (this.sub_total_order * this.taxOrder) / 100;
  }
  
  formValidOrderDetails(){
    let valid = true;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if ( !this.orderDetails[i].product || !this.orderDetails[i].quantity || !this.orderDetails[i].product.unit_price) {
        valid = false;
        break;
      }
    }
    return valid
  }
}




