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
import { Fournisseur } from 'app/main/models/fournisseur';
import { Order } from 'app/main/models/order';
import { Cash } from 'app/main/models/cash';
import { Cheque } from 'app/main/models/cheque';
import { Credit } from 'app/main/models/credit';
import { Traite } from 'app/main/models/traite';
import { TraiteDetail } from 'app/main/models/traiteDetail';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-quote',
  templateUrl: './edit-quote.component.html',
  styleUrls: ['./edit-quote.component.scss'],
  animations: [repeaterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class EditQuoteComponent implements OnInit {

  //Public 
  public dataFromChild: Client;
  public contentHeader: object;
  public quote: Invoice ;
  public order: Order ;
  public clients: Client[];
  public fournisseurs: Fournisseur[];
  public products: Product[] = [];
  public orderDetails: OrderDetail[] = [];
  public sub_total_order = 0;
  public total_order = 0;
  public discountOrder = 0;
  public taxOrder = 0;
  public setting: Setting = new Setting();
  public coreConfig: any;
  public paramId = "";
  public paramType = "";
  public paramInOut = "";
  public type_transaction = "";
  public appLogoImage = '';
  public dateOrderInvoice :string;
  public ID_invoice_order ;
  
  contentHeaderSecondeName = "";

  public customerSelected;
  // public productSelected = new Product();

  public isDataEmpty;
  public sideBarComponent = '';
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public content_loaded: boolean

  /*payment methods params*/
  public cash: Cash = new Cash();
  public cheque: Cheque = new Cheque();
  public credit: Credit = new Credit();
  public traite: Traite = new Traite();
  public traite_details: TraiteDetail[] = [];
  public paymentMethodSelected = '';
  public orderSelectedHasPM = false;

  public DefaultDatePaymentOptions: FlatpickrOptions = {
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    dateFormat: "Y-m-d H:i",
    defaultDate: new Date(),
    altInput: true,
    mode: 'single',

  };
  /* Subscription */
  private EditQuoteSup: Subscription = new Subscription();
  private AddItemSup: Subscription = new Subscription();
  private ListClientSup: Subscription = new Subscription();
  private ListFournisseurSup: Subscription = new Subscription();
  private ListProductsSup: Subscription = new Subscription();
  private CurrentSettingsSup: Subscription = new Subscription();
  private _unsubscribeAll: Subject<any>;
  public TransactionSup: Subscription = new Subscription();

  /* Subscription Pyament Method */
  public loadPyamentMethodSup: Subscription = new Subscription();
  public addPyamentMethodSup: Subscription = new Subscription();
  public addTraiteDetailSup: Subscription = new Subscription();
  public editTraiteDetailSup: Subscription = new Subscription();

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
    private modalService: NgbModal,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();

  }

  receiveData(event) {
    if(this.paramType == "sale" || this.paramType == "simple_sale" || this.paramType == "quote" || (this.paramType == "invoice" && this.paramInOut == 'out')){
      this.clients = [
        event,
        ...this.clients
      ];
    }else if(this.paramType == "purchase" || (this.paramType == "invoice" && this.paramInOut == 'in')) {
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
    this.EditQuoteSup.unsubscribe();
    this.AddItemSup.unsubscribe();
    this.ListClientSup.unsubscribe();
    this.ListFournisseurSup.unsubscribe();
    this.ListProductsSup.unsubscribe();
    this.CurrentSettingsSup.unsubscribe();
    this.TransactionSup.unsubscribe();

    this.loadPyamentMethodSup.unsubscribe();
    this.addPyamentMethodSup.unsubscribe();
    this.addTraiteDetailSup.unsubscribe();
    this.editTraiteDetailSup.unsubscribe();
    this.content_loaded = false;
  }



  async ngOnInit() {
    this.content_loaded = false;
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramType = this.route.snapshot.paramMap.get('type');
    this.paramInOut = this.route.snapshot.paramMap.get('in_out');
    // this.orderDetails.push(new OrderDetail());

    if((this.paramType == "invoice" && this.paramInOut == 'out')){
      this.contentHeaderSecondeName = ' for clients';
    }else if((this.paramType == "invoice" && this.paramInOut == 'in')){
      this.contentHeaderSecondeName = ' for fournisseurs';
    }

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
            name: 'Edit '+this.paramType + this.contentHeaderSecondeName,
            isLink: false,
            // link: '/transactions/'+this.paramType+'/edit/' + this.paramId
          }
        ]
      }
    };

    if (this.paramType == "quote" || (this.paramType == "invoice" && this.paramInOut == 'out')) {
      this.type_transaction = "invoice";
      this.sideBarComponent = 'client-sidebar-right';
      await this.getAllClients();
      await this.getTransactionInvoice();

    } else if (this.paramType == "sale" || this.paramType == "simple_sale" ) {
      this.type_transaction = "order";
      this.sideBarComponent = 'client-sidebar-right';
      await this.getAllClients();
      await this.getTransactionOrder();

    } else if (this.paramType == "purchase"){
      this.type_transaction = "order";
      this.sideBarComponent = 'fournisseur-sidebar-right';
      await this.getAllFournisseurs();
      await this.getTransactionOrder();

    } else if (this.paramType == "invoice" && this.paramInOut == 'in') {
      this.type_transaction = "invoice";
      this.sideBarComponent = 'fournisseur-sidebar-right';
      await this.getAllFournisseurs();
      await this.getTransactionInvoice();

    }  else if (this.paramType == "invoice" && !this.paramInOut ){
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    } else{
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    }

    
    await this.configApp();
    await this.getSettingApp();
    await this.getAllProducts();

    // Intialisation payment status of payments methodes
    this.cash.payment_status = 'unpaid';
    this.cheque.status = 'A DEPOSER';
    this.credit.payment_status = 'unpaid';
    this.traite.nbr_traites = 0;
    this.traite.amount_paid = 0;
  }

  async getTransactionInvoice() {

    this.TransactionSup = this.dataService
      .getByID('invoices', this.paramId)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.quote = await res.data[0];
          // this.dateOptions.defaultDate = [new Date(this.quote.transaction_date)];
          // this.dueDateOptions.defaultDate = this.quote.due_date ? [this.quote.due_date] : null;

          this.customerSelected = (this.paramType == "invoice" && this.paramInOut == 'in') ? this.quote.order[0].fournisseur : this.quote.order[0].client;
          this.orderDetails = this.quote.order[0].order_details;
          this.discountOrder = this.quote.order[0].discount;
          this.taxOrder = this.quote.order[0].tax;
          this.dateOrderInvoice =  this.quote.order[0].date;
          this.ID_invoice_order = this.quote.id;

          // if url changer manualy in paramInOut
          if(this.quote.in_out != this.paramInOut && this.paramType == 'invoice'){
            this.router.navigate(['/pages/miscellaneous/not-authorized']);
          }

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

          this.customerSelected = this.paramType == "purchase" ? this.order.fournisseur : this.order.client;
          this.orderDetails = this.order.order_details;
          this.discountOrder = this.order.discount;
          this.taxOrder = this.order.tax;
          this.dateOrderInvoice = this.order.date;
          this.ID_invoice_order = this.order.id;


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

  addItemDB(item, index) {
    if (item.product == null || item.quantity == null || item.product.unit_price == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Add Item!',
        text: 'Your cannot add item without Product and Quantity and Price',
        customClass: {
          confirmButton: 'btn btn-warning'
        }
      });
    } else {
      let orderToPost = new OrderDetail();
      orderToPost.order_id = this.quote ? this.quote.order[0].id : this.order.id;
      orderToPost.product_id = item.product.id;
      orderToPost.quantity = item.quantity;
      orderToPost.discount = item.discount;

      this.AddItemSup = this.dataService.post('order_details', orderToPost).subscribe(async (res: any) => {
        if (res.success) {

          // update OrderDetails list
          for (let i = 0; i < this.orderDetails.length; i++) {
            if (this.orderDetails.indexOf(this.orderDetails[i]) === index) {
              // let old_price_client_fidel = this.orderDetails[i].product.unit_price;
              this.orderDetails[i] = await res.data[0];
              // this.orderDetails[i].product.unit_price = old_price_client_fidel;
            }
          }
          this.calculTotalOrder();
          this.dataService.toastrSuccess("item has been created");
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while adding item, " + error);
        });
    }
  }

  updateItemDB(item, index) {
    if (item.product == null || item.quantity == null || item.product.unit_price == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Edit Item!',
        text: 'Your cannot add item without Product and Quantity and Price',
        customClass: {
          confirmButton: 'btn btn-warning'
        }
      });
    } else {
      let orderToPost = new OrderDetail();
      orderToPost.id = item.id;
      orderToPost.order_id =  this.quote ? this.quote.order[0].id : this.order.id;
      orderToPost.product_id = item.product.id;
      orderToPost.quantity = item.quantity;
      orderToPost.discount = item.discount;

      this.AddItemSup = this.dataService.put('order_details', orderToPost).subscribe(async (res: any) => {
        if (res.success) {

          // update OrderDetails list
          for (let i = 0; i < this.orderDetails.length; i++) {
            if (this.orderDetails.indexOf(this.orderDetails[i]) === index) {
              // let old_price_client_fidel = this.orderDetails[i].product.unit_price;
              this.orderDetails[i] = await res.data[0];
              // this.orderDetails[i].product.unit_price = old_price_client_fidel;
            }
          }

          this.calculTotalOrder();

          this.dataService.toastrSuccess("item has been updated");
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while adding item, " + error);
        });
    }
  }

  async deleteItemFromDB(id, that) {
    // Delete item from database -- Start
    const data = { id: id };
    that.dataService.delete('order_details', data).subscribe(async (res: any) => {
      if (res.success) {
        
        this.calculTotalOrder();

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your Item has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    },
      async (error: any) => {
        console.log(error)
        that.dataService.toastrDanger("Error while deleting client, " + error);
      });
    // Delete item from database -- End
  }

  async deleteItem(id) {
    let that = this;
    for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails.indexOf(this.orderDetails[i]) === id) {

        if (this.orderDetails[i].id) {

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

              await that.deleteItemFromDB(that.orderDetails[i].id, that);
              that.orderDetails.splice(i, 1);
            }
          });

        } else {
          this.orderDetails.splice(i, 1);
          break;
        }

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
    let flagAllItemUpdated = true;
    let flagAllItemAdded = true;

    if (this.customerSelected || this.paramType == 'simple_sale') {

      for (let i = 0; i < this.orderDetails.length; i++) {
        if (this.orderDetails[i].id == null) {
          flagAllItemAdded = false;
        }
        if (this.orderDetails[i].updated == true) {
          flagAllItemUpdated = false;
        }
      }

      if (flagAllItemUpdated == true) {

        if (flagAllItemAdded == true) {

          if (this.orderDetails.length != 0) {

            if (this.discountOrder >= this.sub_total_order || (this.taxOrder < 0 && this.taxOrder > 100)) {
              Swal.fire({
                icon: 'error',
                text: 'Please chose correct info for Discount and Tax info',
                confirmButtonColor: "#6FAAE2",
              })
            } else {

              if (this.formValidOrderDetails()) {

                // check if an item is empty and remove it 
                await this.checkEmptyItemsOrder(this.orderDetails);

                let payment_type = '';
                if(this.quote){
                  payment_type = this.quote.order[0].payment_type ? this.quote.order[0].payment_type : '' ;
                }else{
                  payment_type = this.order.payment_type ? this.order.payment_type : '' ;
                }

                let grand_total = ( this.sub_total_order - this.discountOrder ) + ( this.sub_total_order * this.taxOrder )/100;
                let postData = {
                  order: {
                    id: this.quote ? this.quote.order[0].id : this.order.id,
                    payment_type: payment_type,
                    payment_status: this.quote ? this.quote.order[0].payment_status : this.order.payment_status,
                    client_id: this.paramType == "sale" || this.paramType == "quote" || (this.paramType == "invoice" && this.paramInOut == 'out')? this.customerSelected.id : null,
                    fournisseur_id: this.paramType == "purchase" || (this.paramType == "invoice" && this.paramInOut == 'in')? this.customerSelected.id : null,
                    date: this.dateOrderInvoice ? new Date(this.dateOrderInvoice) : new Date(),
                    type_order: this.paramType,
                    discount: this.discountOrder ? this.discountOrder : 0,
                    tax: this.taxOrder ? this.taxOrder : 0,
                    // grand_total: grand_total
                  },
                  orderDetails: this.orderDetails
                };
                if(this.paramType == 'quote' || this.paramType == 'invoice'){
                  postData['invoice'] = {
                    id: this.quote.id,
                    order_id: this.quote.order_id,
                    transaction_date: this.dateOrderInvoice ? new Date(this.dateOrderInvoice) : new Date(),
                    due_date: this.quote.due_date ? new Date(this.quote.due_date[0]) : null,
                    notes: this.quote.notes ? this.quote.notes : '',
                    type_invoice: this.paramType,
                    in_out: this.paramType == 'invoice' ? this.paramInOut : 'out'
                  }
                  
                }

                this.EditQuoteSup = this.dataService.put('orders', postData).subscribe(async (res: any) => {
                  if (res.success) {
                    this.dataService.toastrSuccess(this.paramType+ " has been updated");
                    this.content_loaded = false;
                    setTimeout(async () => {
                      // Redirect to list

                      if(this.paramType == 'invoice'){
                        await this.router.navigate(['/transactions/' + this.paramType + '/list/'+this.paramInOut]);
    
                      }else{ // if (this.paramType == 'sale' || this.paramType == 'simple_sale' || this.paramType == 'purchase' || this.paramType == 'quote')
                        await this.router.navigate(['/transactions/' + this.paramType + '/list']);
    
                      }
                    }, 1500);
                  }
                },
                  async (error: any) => {
                    console.log(error)
                    this.dataService.toastrDanger("Error while creating the "+this.paramType+", " + error);
                  });
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Form Items not valid, Please check these infos',
                  confirmButtonColor: "#6FAAE2",
                })
              }
            } 
          } else {
            Swal.fire({
              icon: 'error',
              text: 'You cannot save the order without items ! You need one item at least to save.',
              confirmButtonColor: "#6FAAE2",
            })
          }

        } else {
          Swal.fire({
            icon: 'error',
            text: 'Please complete the creation of all items befor submitting',
            confirmButtonColor: "#6FAAE2",
          })
        }

      } else {
        Swal.fire({
          icon: 'error',
          text: 'Please complete the updating of all items befor submitting',
          confirmButtonColor: "#6FAAE2",
        })
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
      if (array[i].product == null || array[i].quantity == null || array[i].product.unit_price == null) {
        removeValFromIndex.push(i);
      }
    }

    for (var i = removeValFromIndex.length - 1; i >= 0; i--)
      array.splice(removeValFromIndex[i], 1);
  }

  calculTotalOrder() {
    this.sub_total_order = 0;
    for (let i = 0; i < this.orderDetails.length; i++) {
      this.sub_total_order += ( (this.orderDetails[i].product ? this.orderDetails[i].product.unit_price : 0) - this.orderDetails[i].discount ) * this.orderDetails[i].quantity;
    }

    this.total_order = (this.sub_total_order - this.discountOrder) + (this.sub_total_order * this.taxOrder) / 100;
  }

  onChangeItems(item, index) {
    this.calculTotalOrder();

    // show button update for orderDetail if changed
    if (item.id && !item.updated) {
      for (let i = 0; i < this.orderDetails.length; i++) {
        if (this.orderDetails.indexOf(this.orderDetails[i]) === index) {
          this.orderDetails[i].updated = true;
        }
      }
    }
  }

  changeDate(event) {
    this.dateOrderInvoice = event.target.value;
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


  /**
   *  Functions : Payments Methods  
   */



  onChangeSelectPM(event) {
    let value = event.target.value;
    this.paymentMethodSelected = value;
  }

  // Load Payment methods
  async showPaymentMethodModal(modalForm, row) {
    this.modalService.open(modalForm);
    if (row.payment_type == '') {
      this.orderSelectedHasPM = false;

    } else {
      this.orderSelectedHasPM = true;
      await this.loadPyamentMethod(row);
    }
  }
  async loadPyamentMethod(row) {
    // const data = { order_id: row.id };

    this.loadPyamentMethodSup = this.dataService
      .get('orders/loadPyamentMethod/' + row.id)
      .subscribe(async (res: any) => {
        if (res.success) {
          let result = await res.data[0];
          let type = await res.data[1];
          this.paymentMethodSelected = type
          switch (type) {
            case 'credit':
              this.credit = result[0];
              this.DefaultDatePaymentOptions.defaultDate = new Date(this.credit.approaching_date);
              break;
            case 'cash':
              this.cash = result[0];
              this.DefaultDatePaymentOptions.defaultDate = new Date(this.cash.date_payment);
              break;
            case 'cheque':
              this.cheque = result[0];
              this.cheque.date_decaissement ? this.DefaultDatePaymentOptions.defaultDate = new Date(this.cheque.date_decaissement) : this.DefaultDatePaymentOptions.defaultDate = new Date();
              this.cheque.date_encaissement ? this.DefaultDatePaymentOptions.defaultDate = new Date(this.cheque.date_encaissement) : this.DefaultDatePaymentOptions.defaultDate = new Date();

              break;
            case 'traite':
              let amount_paid = 0;
              this.traite = result[0];
              this.traite_details = this.traite.traite_details;
              this.traite_details.forEach(element => {
                element.updated = false;
                // element.date_payment = new Date(element.date_payment);

                if(element.payment_status == 'paid'){
                  amount_paid += element.amount;
                }
              });
              this.traite.nbr_traites = this.traite_details.length;
              this.traite.amount_paid = amount_paid;
              break;
            default:
              this.dataService.toastrDanger("Type of payment not valid");
          }
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
  }

  // Add or Edit Payment Method for order
  async savePaymentMethod(modalForm, form, row, type) {
    if (form.valid) {
      let postData = {};
      let that = this;
      switch (type) {

        case 'credit':
          postData = {
            id: this.credit.id ? this.credit.id : null,
            client_id: row.client_id ? row.client_id : null,
            fournisseur_id: row.fournisseur_id ? row.fournisseur_id : null,
            order_id: row.id,
            date_payment: this.credit.payment_status == 'paid' ? new Date() : null,
            approaching_date: this.credit.approaching_date ? new Date(this.credit.approaching_date[0]) : new Date(),
            amount: this.credit.amount,
            payment_status: this.credit.payment_status,
            payment_method: type
          };
          if ( this.credit.amount && this.credit.approaching_date){

            if(this.credit.amount == row.grand_total){
              await this.addPaymentMethod(modalForm, postData, type);
  
            }else{
              Swal.fire({
                title: 'Are you sure?',
                text: "The amount that you insered is not eqaule the grand total of order",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7367F0',
                cancelButtonColor: '#E42728',
                confirmButtonText: 'Yes, Save it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-danger ml-1'
                }
              }).then(async function (result) {
                if (await result.value) {
                  await that.addPaymentMethod(modalForm, postData, type);
                  
                }
              });
            }

          } else {
            Swal.fire({
              icon: 'error',
              text: 'Form Items not valid, Please check these infos',
              confirmButtonColor: "#6FAAE2",
            })
          }
          
          break;

        case 'cash':
          postData = {
            id: this.cash.id ? this.cash.id : null,
            client_id: row.client_id ? row.client_id : null,
            fournisseur_id: row.fournisseur_id ? row.fournisseur_id : null,
            order_id: row.id,
            amount: this.cash.amount,
            payment_method: type,
            // payment_status: 'paid',
            date_payment: this.cash.date_payment ? new Date(this.cash.date_payment[0]) : new Date(),
          };

          if ( this.cash.amount && this.cash.date_payment){

            if(this.cash.amount == row.grand_total){
              await this.addPaymentMethod(modalForm, postData, type);
  
            }else{
              Swal.fire({
                title: 'Are you sure?',
                text: "The amount that you insered is not eqaule the grand total of order",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7367F0',
                cancelButtonColor: '#E42728',
                confirmButtonText: 'Yes, Save it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-danger ml-1'
                }
              }).then(async function (result) {
                if (await result.value) {
                  await that.addPaymentMethod(modalForm, postData, type);
                  
                }
              });
            }

          } else {
            Swal.fire({
              icon: 'error',
              text: 'Form Items not valid, Please check these infos',
              confirmButtonColor: "#6FAAE2",
            })
          }
          break;

        case 'cheque':

          postData = {
            id: this.cheque.id ? this.cheque.id : null,
            client_id: row.client_id ? row.client_id : null,
            fournisseur_id: row.fournisseur_id ? row.fournisseur_id : null,
            order_id: row.id,
            date_decaissement: this.cheque.date_decaissement ? new Date(this.cheque.date_decaissement[0]) : null,
            date_encaissement: this.cheque.date_encaissement ? new Date(this.cheque.date_encaissement[0]) : null,
            name_bank: this.cheque.name_bank,
            num_cheque: this.cheque.num_cheque,
            amount: this.cheque.amount,
            status: this.cheque.status,
            payment_status: this.cheque.status == 'ENCAISSE' ? 'paid' : 'unpaid',
            payment_method: type
          };

          if ( this.cheque.amount && this.cheque.name_bank && this.cheque.num_cheque && (row.fournisseur_id  && this.cheque.date_decaissement) 
              || this.cheque.amount && this.cheque.name_bank && this.cheque.num_cheque && (row.client_id  && this.cheque.date_encaissement) ){
            
            if(this.cheque.amount == row.grand_total){
              await this.addPaymentMethod(modalForm, postData, type);
  
            }else{
              Swal.fire({
                title: 'Are you sure?',
                text: "The amount that you insered is not eqaule the grand total of order",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7367F0',
                cancelButtonColor: '#E42728',
                confirmButtonText: 'Yes, Save it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-danger ml-1'
                }
              }).then(async function (result) {
                if (await result.value) {
                  await that.addPaymentMethod(modalForm, postData, type);
                  
                }
              });
            }

          } else {
            Swal.fire({
              icon: 'error',
              text: 'Form Items not valid, Please check these infos',
              confirmButtonColor: "#6FAAE2",
            })
          }

            
          
          break;

        case 'traite':
          postData = {
            id: this.traite.id ? this.traite.id : null,
            client_id: row.client_id ? row.client_id : null,
            fournisseur_id: row.fournisseur_id ? row.fournisseur_id : null,
            order_id: row.id,
            nbr_traites: this.traite.nbr_traites ? this.traite.nbr_traites : 0,
            amount_paid: this.traite.amount_paid ? this.traite.amount_paid : 0,
            payment_status: null,
            // traite_details: this.traite.id ? null : this.traite_details,
            payment_method: type
          };

          await this.SavePaymentMethod_Traite_TraiteDetails(modalForm, postData, type);
          break;

        default:
          this.dataService.toastrDanger("Type of payment not valid");
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Form Items not valid, Please check these infos',
        confirmButtonColor: "#6FAAE2",
      })
    }
  }
  async addPaymentMethod(modal, postData, type) {
    this.addPyamentMethodSup = this.dataService
      .post('orders/addPyamentMethod', postData)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.ngOnInit();
          this.modalPMdismiss(modal);
          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Your payment method has been Saved.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
  }
  async SavePaymentMethod_Traite_TraiteDetails(modal, postData, type) {
    let flagAllItemUpdated = true;
    let flagAllItemAdded = true;

      if(this.traite.id != null){
        for (let i = 0; i < this.traite_details.length; i++) {
          if (this.traite_details[i].id == null) {
            flagAllItemAdded = false;
          }
          if (this.traite_details[i].updated == true) {
            flagAllItemUpdated = false;
          }
        }
      }
      

      if (flagAllItemUpdated == true) {

        if (flagAllItemAdded == true) {

          if (this.traite_details.length != 0) {


              if (this.formValidTraiteDetails()) {
                // check if an item is empty and remove it 
                await this.checkEmptyTraiteDetails(this.traite_details);
                
                if(this.traite.id){
                  postData["traite_details"] = null;
                } else {
                  this.traite_details.forEach(element => {
                    element.approaching_date = new Date(element.approaching_date[0]);
                  });
                  postData["traite_details"] = this.traite_details;
                }

                this.addPyamentMethodSup = this.dataService.post('orders/addPyamentMethod', postData).subscribe(async (res: any) => {
                  if (res.success) {
                    this.ngOnInit();
                     this.modalPMdismiss(modal);
                     Swal.fire({
                      icon: 'success',
                      title: 'Saved!',
                      text: 'Your payment method has been saved.',
                      customClass: {
                        confirmButton: 'btn btn-success'
                      }
                    });
                  }
                },
                  async (error: any) => {
                    console.log(error)
                    this.dataService.toastrDanger("Error while creating the payment methid traite" + error);
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
              text: 'You cannot save the payment method (Traite) without items ! You need one item at least to save.',
              confirmButtonColor: "#6FAAE2",
            })
          }

        } else {
          Swal.fire({
            icon: 'error',
            text: 'Please complete the creation of all items befor submitting',
            confirmButtonColor: "#6FAAE2",
          })
        }

      } else {
        Swal.fire({
          icon: 'error',
          text: 'Please complete the updating of all items befor submitting',
          confirmButtonColor: "#6FAAE2",
        })
      }


  }

  // Delete Payment Method for order
  async deletePaymentMethod(modal, rowPM, tableDB) {
    let that = this;
    if (rowPM.id == null) {
      this.paymentMethodSelected = '';
      this.orderSelectedHasPM = false;
    } else {

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

          const data = { id: rowPM.id };
          that.dataService.delete(tableDB, data).subscribe(async (res: any) => {
            if (res.success) {
              that.modalPMdismiss(modal);
              that.ngOnInit();

              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your payment method has been deleted.',
                customClass: {
                  confirmButton: 'btn btn-success'
                }
              });
            }
          },
            async (error: any) => {
              console.log(error)
              that.dataService.toastrDanger("Error while deleting client, " + error);
            });
        }
      });


    }

  }

  // Crud Traite Details
  addTraiteDetail() {
    let traiteDetail = new TraiteDetail();
    traiteDetail.payment_status = 'unpaid';
    this.traite_details.push(traiteDetail);

    if(this.traite.id == null){
      this.traite.nbr_traites ++;
    }
  }
  addTraiteDetailDB(item, index) {
    if (item.amount == null || item.approaching_date == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Add Item!',
        text: 'Your cannot add item without Amount and Approaching Date',
        customClass: {
          confirmButton: 'btn btn-warning'
        }
      });
    } else {
      let traiteToPost = new TraiteDetail();
      traiteToPost.traite_id = this.traite.id;
      traiteToPost.amount = item.amount;
      traiteToPost.approaching_date = new Date(item.approaching_date);
      traiteToPost.date_payment = item.payment_status == 'paid' ? new Date() : null;
      traiteToPost.payment_status = item.payment_status;

      this.addTraiteDetailSup = this.dataService.post('traite_details', traiteToPost).subscribe(async (res: any) => {
        if (res.success) {

          // update OrderDetails list
          for (let i = 0; i < this.traite_details.length; i++) {
            if (this.traite_details.indexOf(this.traite_details[i]) === index) {
              this.traite_details[i] = await res.data[0][0];
            }
          }

          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Your Traite item has been created.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });

          this.traite.nbr_traites ++;
          item.payment_status == 'paid' ? this.traite.amount_paid += this.traite.amount_paid : this.traite.amount_paid = this.traite.amount_paid;

          this.traite.amount_paid = res.data[1].amount_paid;
          this.traite.payment_status = res.data[1].payment_status;

          this.dataService.toastrSuccess("item has been created");
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while adding item, " + error);
      });
    }
  }
  updateTraiteDetailDB(item, index) {
    if (item.amount == null || item.approaching_date == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Edit Item!',
        text: 'Your cannot add item without Amount and Approaching Date',
        customClass: {
          confirmButton: 'btn btn-warning'
        }
      });
    } else {
      let traiteToPost = new TraiteDetail();
      traiteToPost.id = item.id;
      traiteToPost.traite_id = this.traite.id;
      traiteToPost.amount = item.amount;
      traiteToPost.approaching_date = new Date(item.approaching_date);
      traiteToPost.date_payment = item.payment_status == 'paid' ? new Date() : null;
      traiteToPost.payment_status = item.payment_status;

      this.editTraiteDetailSup = this.dataService.put('traite_details', traiteToPost).subscribe(async (res: any) => {
        if (res.success) {

          // update OrderDetails list
          for (let i = 0; i < this.traite_details.length; i++) {
            if (this.traite_details.indexOf(this.traite_details[i]) === index) {
              this.traite_details[i] = await res.data[0][0];
              this.traite_details[i].approaching_date = new Date(this.traite_details[i].approaching_date);
            }
          }

          
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Your Traite item has been updated.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });

          this.traite.amount_paid = res.data[1].amount_paid;
          this.traite.payment_status = res.data[1].payment_status;

          this.dataService.toastrSuccess("item has been updated");
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while adding item, " + error);
        });
    }
  }
  async deleteTraiteDetailFromDB(id, that) {
    // Delete item from database -- Start
    const data = { id: id };
    that.dataService.delete('traite_details', data).subscribe(async (res: any) => {
      if (res.success) {
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your Item has been deleted.',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    },
      async (error: any) => {
        console.log(error)
        that.dataService.toastrDanger("Error while deleting client, " + error);
      });
    // Delete item from database -- End
  }
  async deleteTraiteDetail(id) {
    let that = this;
    for (let i = 0; i < this.traite_details.length; i++) {
      if (this.traite_details.indexOf(this.traite_details[i]) === id) {

        if (this.traite_details[i].id) {

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

              that.traite.nbr_traites --;
              that.traite_details[i].payment_status == 'paid' ? that.traite.amount_paid -= that.traite_details[i].amount : that.traite.amount_paid = that.traite.amount_paid;
              await that.deleteTraiteDetailFromDB(that.traite_details[i].id, that);
              that.traite_details.splice(i, 1);
            }
          });

        } else {
          this.traite_details.splice(i, 1);
          this.traite.nbr_traites --;
          break;
        }

      }
    }
  }

  // Item Traite Details on change set updated = true
  onChangeTraiteDetails(item, index) {

    // show button update for orderDetail if changed
    if (item.id && !item.updated) {
      for (let i = 0; i < this.traite_details.length; i++) {
        if (this.traite_details.indexOf(this.traite_details[i]) === index) {
          this.traite_details[i].updated = true;
        }
      }
    }
  }

  // Check if TraiteDetails is clean 
  async checkEmptyTraiteDetails(array) {
    let removeValFromIndex = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].amount == null || array[i].approaching_date == null) {
        removeValFromIndex.push(i);
      }
    }

    for (var i = removeValFromIndex.length - 1; i >= 0; i--)
      array.splice(removeValFromIndex[i], 1);
  }

  modalPMdismiss(modal) {
    modal.dismiss('Cross click');
    this.cash = new Cash();
    this.cheque = new Cheque();
    this.credit = new Credit();
    this.traite = new Traite();
    this.traite_details = [];

    this.orderSelectedHasPM = false;
    this.paymentMethodSelected = '';
    this.DefaultDatePaymentOptions.defaultDate = new Date();

  }

  

  changeDateTraiteDetail(event,index) {
    for (let i = 0; i < this.traite_details.length; i++) {
      if (this.traite_details.indexOf(this.traite_details[i]) === index) {
        this.traite_details[i].approaching_date = event.target.value;
      }
    }

  }

  
  formValidTraiteDetails(){
    let valid = true;
    for (let i = 0; i < this.traite_details.length; i++) {
      if ( !this.traite_details[i].amount || !this.traite_details[i].approaching_date) {
        valid = false;
        break;
      }
    }
    return valid
  }
  
}
