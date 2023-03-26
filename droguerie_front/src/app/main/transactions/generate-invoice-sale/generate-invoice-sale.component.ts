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
  selector: 'app-generate-invoice-sale',
  templateUrl: './generate-invoice-sale.component.html',
  styleUrls: ['./generate-invoice-sale.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class GenerateInvoiceSaleComponent implements OnInit {

  //Public 
  public contentHeader: object;
  public quote: Invoice;
  public order: Order;
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
  public paramId = "";
  public paramType = "";
  public type_transaction = "";
  public appLogoImage = '';
  public paramInOut = "";
  public dateOrderInvoice :string;
  // public ID_invoice_order ;



  public customerSelected;
  // public productSelected = new Product();

  public isDataEmpty;
  public sideBarComponent = '';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public content_loaded: boolean
  contentHeaderSecondeName = "";


  /* Subscription */
  private GenerateSup: Subscription = new Subscription();
  private ListClientSup: Subscription = new Subscription();
  private ListFournisseurSup: Subscription = new Subscription();
  private ListProductsSup: Subscription = new Subscription();
  private CurrentSettingsSup: Subscription = new Subscription();
  public TransactionSup: Subscription = new Subscription();
  private _unsubscribeAll: Subject<any>;

  // ng2-flatpickr options
  public dateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    // defaultDate: [new Date()],
    altFormat: 'Y-n-j'
  };
  public dueDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    // defaultDate: ['2020-05-17'],
    altFormat: 'Y-n-j',
    disableMobile: true
  };

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
    // if(this.paramType == "sale" || (this.paramType == "invoice" && this.paramInOut == 'out')){
    if(this.paramType == "sale"){
        this.clients = [
        event,
        ...this.clients
      ];
    }
    // else if(this.paramType == "invoice" && this.paramInOut == 'in') {
    //   this.fournisseurs = [
    //     event,
    //     ...this.fournisseurs
    //   ];
    // }
  }

  /**
    * On Destroy
    */
  ngOnDestroy(): void {
    this.GenerateSup.unsubscribe();
    this.ListClientSup.unsubscribe();
    this.ListFournisseurSup.unsubscribe();
    this.ListProductsSup.unsubscribe();
    this.CurrentSettingsSup.unsubscribe();
    this.TransactionSup.unsubscribe();
    this.content_loaded = false;
  }
  
  async ngOnInit() {
    this.content_loaded = false;
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramType = this.route.snapshot.paramMap.get('type');
    this.paramInOut = this.route.snapshot.paramMap.get('in_out');

    // this.orderDetails.push(new OrderDetail());
    // if((this.paramType == "invoice" && this.paramInOut == 'out')){
    //   this.contentHeaderSecondeName = ' for clients';
    // }else if((this.paramType == "invoice" && this.paramInOut == 'in')){
    //   this.contentHeaderSecondeName = ' for fournisseurs';
    // }

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
            name: 'Generate '+this.paramType,
            isLink: false,
          }
        ]
      }
    };

    if (this.paramType == "sale") {
      this.type_transaction = "order";
      this.sideBarComponent = 'client-sidebar-right';
      await this.getAllClients();
      await this.getTransactionInvoice();

    } 
    // else if (this.paramType == "invoice" && this.paramInOut == 'out') {
    //   this.quote = new Invoice();
    //   this.type_transaction = "invoice";
    //   this.sideBarComponent = 'client-sidebar-right';
    //   await this.getAllClients();
    //   await this.getTransactionOrder();

    // } 
    // else if (this.paramType == "invoice" && this.paramInOut == 'in'){
    //   this.quote = new Invoice();
    //   this.type_transaction = "invoice";
    //   this.sideBarComponent = 'fournisseur-sidebar-right';
    //   await this.getAllFournisseurs();
    //   await this.getTransactionOrder();

    // } 
    else{
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    }

    await this.configApp();
    await this.getSettingApp();
    await this.getAllProducts();

  }

  async getTransactionInvoice() {

    this.TransactionSup = this.dataService
      .getByID('invoices', this.paramId)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.quote = await res.data[0];
          this.order = this.quote.order[0];
          // this.dateOptions.defaultDate = [new Date(this.quote.transaction_date)];
          // this.dueDateOptions.defaultDate = this.quote.due_date ? [this.quote.due_date] : null;

          this.customerSelected = (this.paramType == "invoice" && this.paramInOut == 'in') ? this.order.fournisseur : this.order.client;
          this.orderDetails = this.order.order_details;
          this.discountOrder = this.order.discount;
          this.taxOrder = this.order.tax;
          this.dateOrderInvoice =  this.order.date;
          // this.ID_invoice_order = this.quote.id;

          this.orderDetails.forEach(element => {
            element.updated = false;
          });


          this.calculTotalOrder();

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
  }

  async getTransactionOrder() {

    this.TransactionSup = this.dataService
      .getByID('orders', this.paramId)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.order = await res.data[0];

          // this.dateOptions.defaultDate = [new Date(this.quote.transaction_date)];
          // this.dueDateOptions.defaultDate = this.quote.due_date ? [this.quote.due_date] : null;

          this.customerSelected = (this.paramType == "invoice" && this.paramInOut == 'in') ? this.order.fournisseur : this.order.client;

          this.orderDetails = this.order.order_details;
          this.discountOrder = this.order.discount;
          this.taxOrder = this.order.tax;
          this.dateOrderInvoice = this.order.date;
          // this.ID_invoice_order = this.order.id;


          this.orderDetails.forEach(element => {
            element.updated = false;
          });


          this.calculTotalOrder();

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
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

  async deleteItem(id) {
    let that = this;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails.indexOf(this.orderDetails[i]) === id) {

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

            that.orderDetails.splice(i, 1);
          }
        });

      }
    }
  }

  createItemSideBar() {
    this.dataService.createNewObject();
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

  async checkEmptyItemsOrder(array) {
    let removeValFromIndex = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].product == null || array[i].quantity == null) {
        removeValFromIndex.push(i);
      }
    }

    for (var i = removeValFromIndex.length - 1; i >= 0; i--)
      array.splice(removeValFromIndex[i], 1);
  }

  calculTotalOrder() {
    this.sub_total_order = 0;
    for (let i = 0; i < this.orderDetails.length; i++) {
      this.sub_total_order += (this.orderDetails[i].product ? this.orderDetails[i].product.unit_price : 0) * this.orderDetails[i].quantity;
    }

    this.total_order = (this.sub_total_order - this.discountOrder) + (this.sub_total_order * this.taxOrder) / 100;
  }

  onChangeItems(item, index) {
    this.calculTotalOrder();

    // show button update for orderDetail if changed
    // if (item.id && !item.updated) {
    //   for (let i = 0; i < this.orderDetails.length; i++) {
    //     if (this.orderDetails.indexOf(this.orderDetails[i]) === index) {
    //       this.orderDetails[i].updated = true;
    //     }
    //   }
    // }
  }

  changeDate(event) {
    this.dateOrderInvoice = event.target.value;
  }

  /**
   * Submit
   *
   * @param form
   */
  async submitOrder(form) {
    if (this.customerSelected) {
      if (this.discountOrder >= this.sub_total_order || (this.taxOrder < 0 && this.taxOrder > 100)) {
        Swal.fire({
          icon: 'error',
          text: 'Please chose correct info for Discount and Tax info',
          confirmButtonColor: "#6FAAE2",
        })
      } else {
        if (this.orderDetails.length != 0) {
          if (this.formValidOrderDetails()) {

            // check if an item is empty and remove it 
            await this.checkEmptyItemsOrder(this.orderDetails);

            let postData = {
              order: {
                client_id: this.paramType == "sale" || (this.paramType == "invoice" && this.paramInOut == 'out') ? this.customerSelected.id : null,
                fournisseur_id: (this.paramType == "invoice" && this.paramInOut == 'in') ? this.customerSelected.id : null,
                date: this.dateOrderInvoice ? new Date(this.dateOrderInvoice) : new Date(),
                type_order: this.paramType,
                discount: this.discountOrder,
                tax: this.taxOrder
              },
              orderDetails: this.orderDetails
            };
            if (this.paramType == 'invoice') {
              postData['invoice'] = {
                transaction_date: this.dateOrderInvoice ? new Date(this.dateOrderInvoice) : new Date(),
                notes: this.quote.notes ? this.quote.notes : '',
                type_invoice: this.paramType,
                in_out: this.paramInOut
              }

            }

            this.GenerateSup = this.dataService.post('orders', postData).subscribe(async (res: any) => {
              if (res.success) {
                this.dataService.toastrSuccess(this.paramType + " has been created");
                this.content_loaded = false;
                setTimeout(async () => {
                  // Redirect to list
                  if(this.paramType == 'invoice'){
                    await this.router.navigate(['/transactions/' + this.paramType + '/list/'+this.paramInOut]);

                  }else if (this.paramType == 'sale'){
                    await this.router.navigate(['/transactions/' + this.paramType + '/list']);

                  }
                    
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

  formValidOrderDetails(){
    let valid = true;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if ( !this.orderDetails[i].product || !this.orderDetails[i].quantity) {
        valid = false;
        break;
      }
    }
    return valid
  }
  


}
