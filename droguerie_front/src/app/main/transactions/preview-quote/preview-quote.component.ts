import { Component, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { takeUntil } from 'rxjs/operators';
import { coreConfig } from 'app/app-config';
import { CoreConfigService } from '@core/services/config.service';

import { repeaterAnimation } from '../transactions.animation';
import { Invoice } from 'app/main/models/invoice';
import { Setting } from 'app/main/models/setting';
import { printDiv } from '../print-div';

@Component({
  selector: 'app-preview-quote',
  templateUrl: './preview-quote.component.html',
  animations: [repeaterAnimation],
  styleUrls: ['./preview-quote.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewQuoteComponent implements OnInit  {

  //Public 
  public contentHeader: object;
  public quote: any = {};
  public order: any = {};
  public orderDetails: any [] = [];
  public customer: any = {};
  public sub_total_order = 0;
  public total_order = 0;
  public discountOrder = 0;
  public taxOrder = 0;
  public paramId = "";
  public setting: Setting = new Setting();
  public coreConfig: any;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_PRODUCT_RSC + '/';
  public appLogoImage = '';
  public content_loaded: boolean;
  public paramType = "";
  public type_transaction = "";
  public dateOrderInvoice :string;
  public ID_invoice_order ;
  public avance : number = 0;

  public paramInOut ;
  contentHeaderSecondeName = "";

  /* Subscription */
  public TransactionSup: Subscription = new Subscription();
  private CurrentSettingsSup: Subscription = new Subscription();
  private _unsubscribeAll: Subject<any>;

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _coreConfigService: CoreConfigService,

  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

   /**
  * On Destroy
  */
   ngOnDestroy(): void {
    this.TransactionSup.unsubscribe();
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
    this.paramId = this.route.snapshot.paramMap.get('id');
    this.paramType = this.route.snapshot.paramMap.get('type');

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
            // link: '/transactions/'+this.paramType+'/edit/' + this.paramId
          }
        ]
      }
    };

    if (this.paramType == "quote" || this.paramType == "invoice" ) {
      this.type_transaction = "invoice";
      await this.getTransactionInvoice();

    } else if (this.paramType == "sale" || this.paramType == "simple_sale" ) {
      this.type_transaction = "order";
      await this.getTransactionOrder();

    } else if (this.paramType == "purchase"){
      this.type_transaction = "order";
      await this.getTransactionOrder();

    } else{
      this.router.navigate(['/pages/miscellaneous/not-authorized']);
    }


    await this.configApp();
    await this.getSettingApp();
  }

  async getTransactionInvoice() {

    this.TransactionSup = this.dataService
      .getByID('invoices' , this.paramId )
      .subscribe(async (res: any) => {
        if (res.success) {
          console.log(res.data);
            this.quote = await res.data[0];
            this.order = this.quote.order[0];
            if (this.order.payment_type == "traite") {
              await this.getAvance(this.order.id);
            }
            this.customer = this.quote.order[0].client;
            this.customer = this.quote.in_out == 'in' ? this.quote.order[0].fournisseur : this.quote.order[0].client;

            this.paramInOut = this.quote.in_out;
            this.orderDetails = this.order.order_details;
            this.ID_invoice_order = this.quote.id;
            this.dateOrderInvoice =  this.quote.order[0].date;
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking Data, " + error);
      });
  }

  async getTransactionOrder() {

    this.TransactionSup = this.dataService
      .getByID('orders' , this.paramId )
      .subscribe(async (res: any) => {
        if (res.success) {
            this.order = await res.data[0];
            this.customer = this.paramType == "purchase" ? this.order.fournisseur : this.order.client;
            this.orderDetails = this.order.order_details;
            this.ID_invoice_order = this.order.id;
            this.dateOrderInvoice =  this.order.date;

        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking Data, " + error);
      });
  }

  async getSettingApp() {
    this.CurrentSettingsSup = this.dataService.get('settings').subscribe(async (res: any) => {
      let data = null;
      if (res.success) {
        data = await res.data;
        this.setting = data;
        this.content_loaded = true;

      } else {
        console.log('Error while taking - Check your info input');
      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }

  async configApp(){
    // Subscribe to the config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config: any) => {
      this.coreConfig = config;
      this.appLogoImage = this.coreConfig.app.appLogoImage
    });
  }

  async getAvance(id) {
    this.dataService.get(`traites/avance/${id}`).subscribe(async (res: any) => {
       if (res.success) {
           this.avance = await res.data;
       }
     },
     async (error: any) => {
       console.log(error)
       this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
     });
 }



  printDiv(id){
    let invoice_id = this.type_transaction == 'invoice' ? this.quote.id : this.order.id;
     printDiv(invoice_id,this.setting ,this.customer, this.orderDetails, this.order, this.paramType,this.avance) 
    // printDiv(id);
  }
}
