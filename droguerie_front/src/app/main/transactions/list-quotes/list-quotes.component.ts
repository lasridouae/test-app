import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from 'app/main/models/invoice';
import { Client } from 'app/main/models/client';
import { Product } from 'app/main/models/product';
import { environment } from 'environments/environment';
import { Order } from 'app/main/models/order';
import { Fournisseur } from 'app/main/models/fournisseur';
import { Cash } from 'app/main/models/cash';
import { Cheque } from 'app/main/models/cheque';
import { Credit } from 'app/main/models/credit';
import { Traite } from 'app/main/models/traite';
import { TraiteDetail } from 'app/main/models/traiteDetail';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-quotes',
  templateUrl: './list-quotes.component.html',
  styleUrls: ['./list-quotes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListQuotesComponent implements OnInit {

  // Private
  public quotes: Invoice[];
  public orders: Order[];
  public clients: Client[] = []
  public fournisseurs: Fournisseur[] = []
  public products: Product[] = []
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
  public content_loaded: boolean
  public dataFromChild: Invoice;
  public paramType = "";
  public paramInOut = "";

  contentHeaderSecondeName = "";

  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';

  /*search params*/
  customer;
  product;
  search: string;

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
  public quoteSup: Subscription = new Subscription();
  public clientSup: Subscription = new Subscription();
  public fournisseurSup: Subscription = new Subscription();
  public productSup: Subscription = new Subscription();
  public searchSup: Subscription = new Subscription();

  /* Subscription Pyament Method */
  public loadPyamentMethodSup: Subscription = new Subscription();
  public addPyamentMethodSup: Subscription = new Subscription();
  public addTraiteDetailSup: Subscription = new Subscription();
  public editTraiteDetailSup: Subscription = new Subscription();

  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    public exportData: ExportService,
    private modalService: NgbModal,
  ) {
    this.options = this.toastr.toastrConfig;
    this.route.paramMap.subscribe(async params => {
      await this.ngOnInit();
      
    });
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.quoteSup.unsubscribe();
    this.clientSup.unsubscribe();
    this.fournisseurSup.unsubscribe();
    this.productSup.unsubscribe();
    this.searchSup.unsubscribe();
    this.loadPyamentMethodSup.unsubscribe();
    this.addPyamentMethodSup.unsubscribe();
    this.addTraiteDetailSup.unsubscribe();
    this.editTraiteDetailSup.unsubscribe();
  }


  /**
  * On init
  */
  async ngOnInit() {
    // Initialisation of variables
    this.quotes = undefined;
    this.orders = undefined;
    this.clients = [];
    this.fournisseurs = [];
    this.products = [];
    this.tempData = [];
    this.paramType = "";
    this.paramInOut = "";

    /*payment methods params*/
    this.cash = new Cash();
    this.cheque = new Cheque();
    this.credit = new Credit();
    this.traite = new Traite();
    this.traite_details = [];
    this.paymentMethodSelected = '';
    this.orderSelectedHasPM = false;

    this.content_loaded = false;
    this.paramType = this.route.snapshot.paramMap.get('type');
    this.paramInOut = this.route.snapshot.paramMap.get('in_out');

    if ((this.paramType == "invoice" && this.paramInOut == 'out')) {
      this.contentHeaderSecondeName = ' for clients';
    } else if ((this.paramType == "invoice" && this.paramInOut == 'in')) {
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
            name: this.paramType + this.contentHeaderSecondeName,
            isLink: false,
            // link: '/transactions/'+this.paramType+'/list/'
          }
        ]
      }
    };

    if (this.paramType == "quote" || (this.paramType == "invoice" && this.paramInOut == 'out')) {
      await this.getAllQuotesInvoice(this.paramType);
      await this.getAllClient();

      // call the clients and fournisseurs under function getAllQuotesInvoice

    } else if (this.paramType == "sale" || this.paramType == "simple_sale") {
      await this.getAllOrders(this.paramType);
      await this.getAllClient();

    } else if (this.paramType == "purchase") {
      await this.getAllOrders(this.paramType);
      await this.getAllFournisseurs();

    } else if (this.paramType == "invoice" && this.paramInOut == 'in') {
      await this.getAllQuotesInvoice(this.paramType);
      await this.getAllFournisseurs();

    } else if (this.paramType == "invoice" && !this.paramInOut) {
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    } else {
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    }

    await this.getAllProducts();

    // Intialisation payment status of payments methodes
    this.cash.payment_status = 'unpaid';
    this.cheque.status = 'A DEPOSER';
    this.credit.payment_status = 'unpaid';
    this.traite.nbr_traites = 0;
    this.traite.amount_paid = 0;
  }

  async getAllQuotesInvoice(type) {

    let data = [{ type: type, in_out: this.paramInOut ? this.paramInOut : 'out' }];

    this.quoteSup = this.dataService
      .getByParams('invoices', data)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.quotes = await res.data;

          this.tempData = this.quotes;
          this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
  }

  async getAllOrders(type) {

    const data = [{ type: type }];
    this.quoteSup = this.dataService
      .getByParams('orders', data)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.orders = await res.data;

          this.tempData = this.orders;
          this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
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

          this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data client, " + error);
        });
  }

  async getAllFournisseurs() {
    this.fournisseurSup = this.dataService
      .get('fournisseurs')
      .subscribe(async (res: any) => {
        if (res.success) {
          this.fournisseurs = await res.data;

          // Get First 4 words in column Adresse
          for (let index = 0; index < this.fournisseurs.length; index++) {
            this.fournisseurs[index].adresse = this.fournisseurs[index].adresse.split(' ').slice(0, 4).join(' ');
          }

          this.content_loaded = true;
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data fournisseur, " + error);
        });
  }

  async getAllProducts() {
    this.productSup = this.dataService
      .get('products')
      .subscribe(async (res: any) => {
        if (res.success) {

          this.products = await res.data;
          // this.content_loaded = true;

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }

  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    let flag = false;
    let that = this;
    let rowDate = null;
    // filter our data
    const temp = this.tempData.filter(function (d) {
      that.quotes ? rowDate = d.order[0].date : null;
      that.orders ? rowDate = d.date : null;

      return rowDate.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.quotes ? this.quotes = temp : this.quotes = undefined;
    this.orders ? this.orders = temp : this.orders = undefined;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  deleteItem(row) {
    let data = {};
    let that = this;

    if (this.paramType == "quote" || this.paramType == "invoice") {
      data['order_id'] = row.order[0].id;
      data['invoice_id'] = row.id;

    } else if (this.paramType == "sale" || this.paramType == "simple_sale" || this.paramType == "purchase") {
      data['order_id'] = row.id;

    }

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
        that.dataService.deleteByParam('orders/delete', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;

            if (that.paramType == "quote" || that.paramType == "invoice") {
              await that.getAllQuotesInvoice(that.paramType);
            } else if (that.paramType == "sale" || that.paramType == "simple_sale" || that.paramType == "purchase") {
              await that.getAllOrders(that.paramType);
            }

            that.dataService.toastrInfo(that.paramType + " has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting quote, " + error);
          });
      }
    });


  }

  /** Generate Invoice from sale and purchase */
  generateInvoice(row, type) {
    if ((type == 'in' || type == 'out') && (this.paramType == 'sale' || this.paramType == 'purchase')) {

      const data = { order_id: row.id, in_out: type };
      this.dataService.post('orders/generateInvoice', data).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Invoice has been generated successfully");
          await this.router.navigate(['/transactions/invoice/preview/' + res.data.id]);
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while generating invoice, " + error);
        });
    }
  }

  /** Search function */
  async searchFunc(customer, product, search) {
    this.content_loaded = false;
    this.searchSup.unsubscribe()
    const data = [
      {
        type: this.paramType,
        search: search ? search : "",
        fournisseur: this.paramType == 'purchase' || (this.paramType == "invoice" && this.paramInOut == 'in') ? customer ? customer.id : "" : "",
        client: this.paramType == 'sale' || this.paramType == 'simple_sale' || this.paramType == 'quote' || (this.paramType == "invoice" && this.paramInOut == 'out') ? customer ? customer.id : "" : "",
        product: product ? product.id : ""
      }];

    this.searchSup = this.dataService
      .searchFunction("searchInvoicesOrders", data)
      .subscribe(async (res: any) => {
        if (res.success) {

          if (this.paramType == "quote" || this.paramType == "invoice") {
            this.quotes = await res.data;
            this.tempData = await res.data;
          } else if (this.paramType == "sale" || this.paramType == "simple_sale" || this.paramType == "purchase") {
            this.orders = await res.data;
            this.tempData = await res.data;
          }
          this.content_loaded = true;

          // console.log("products : ",this.products)
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
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

                if (element.payment_status == 'paid') {
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
          if (this.credit.amount && this.credit.approaching_date) {

            if (this.credit.amount == row.grand_total) {
              await this.addPaymentMethod(modalForm, postData, type);

            } else {
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

          if (this.cash.amount && this.cash.date_payment) {

            if (this.cash.amount == row.grand_total) {
              await this.addPaymentMethod(modalForm, postData, type);

            } else {
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

          if (this.cheque.amount && this.cheque.name_bank && this.cheque.num_cheque && (row.fournisseur_id && this.cheque.date_decaissement)
            || this.cheque.amount && this.cheque.name_bank && this.cheque.num_cheque && (row.client_id && this.cheque.date_encaissement)) {

            if (this.cheque.amount == row.grand_total) {
              await this.addPaymentMethod(modalForm, postData, type);

            } else {
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

          let amountOfTraiteDetails = 0
          for (let index = 0; index < this.traite_details.length; index++) amountOfTraiteDetails += this.traite_details[index].amount;

          if (amountOfTraiteDetails == row.grand_total) {
            await this.SavePaymentMethod_Traite_TraiteDetails(modalForm, postData, type);

          } else {
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
                await that.SavePaymentMethod_Traite_TraiteDetails(modalForm, postData, type);

              }
            });
          }

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

    if (this.traite.id != null) {
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

            // Update type approaching_date to new Date()
            if (this.traite.id) {
              postData["traite_details"] = null;
            } else {
              this.traite_details.forEach(element => {
                element.approaching_date = new Date(element.approaching_date);
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

    if (this.traite.id == null) {
      this.traite.nbr_traites++;
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
          this.ngOnInit();

          Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Your Traite item has been created.',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          });

          this.traite.nbr_traites++;
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

          await this.ngOnInit();
          this.traite.payment_status = await res.data[1].payment_status;
          this.traite.amount_paid = await res.data[1].amount_paid;

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
    that.content_loaded = false;

    const data = { id: id };
    that.dataService.delete('traite_details', data).subscribe(async (res: any) => {
      if (res.success) {
        that.content_loaded = true;
        this.ngOnInit();

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

              that.traite.nbr_traites--;
              that.traite_details[i].payment_status == 'paid' ? that.traite.amount_paid -= that.traite_details[i].amount : that.traite.amount_paid = that.traite.amount_paid;
              await that.deleteTraiteDetailFromDB(that.traite_details[i].id, that);
              that.traite_details.splice(i, 1);
            }
          });

        } else {
          this.traite_details.splice(i, 1);
          this.traite.nbr_traites--;
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



  changeDateTraiteDetail(event, index) {
    for (let i = 0; i < this.traite_details.length; i++) {
      if (this.traite_details.indexOf(this.traite_details[i]) === index) {
        this.traite_details[i].approaching_date = event.target.value;
      }
    }


  }


  formValidTraiteDetails() {
    let valid = true;
    for (let i = 0; i < this.traite_details.length; i++) {
      if (!this.traite_details[i].amount || !this.traite_details[i].approaching_date) {
        valid = false;
        break;
      }
    }
    return valid
  }
}
