import { Component, Input, ViewEncapsulation, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { DataService } from "app/services/data.service";
import { Subscription } from "rxjs";
import { Client } from "../models/client";
import { Fournisseur } from "../models/fournisseur";

@Component({
  selector: "app-filter",
  template: `<section id="input-group-basic-merged" class="basic-select card">
    <div class="row match-height card-body">
      <div class="col-12 col-md-3">
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon-search1"
              ><i data-feather="search"></i
            ></span>
          </div>
          <input
            [(ngModel)]="search"
            type="text"
            class="form-control search-product"
            id="input-search"
            placeholder="Search by : Total order"
            aria-label="Search..."
            aria-describedby="input-search"
            (ngModelChange)="searchFunc(customer, product, search)"
          />
        </div>
      </div>
      <!-- <div class="col-12 col-md-3">
        <div class="form-group">
          <ng-select
            [items]="products"
            [(ngModel)]="product"
            (change)="searchFunc(customer, product, search)"
            [ngModelOptions]="{ standalone: true }"
            placeholder="Search by product ..."
          >
    
          </ng-select>
        </div>
      </div> -->
      <div class="col-12 col-md-3">
        <div class="form-group">
          <ng-select
            [items]="paramInOut == 'in' ? fournisseurs : clients"
            bindLabel="name"
            [loading]="!content_loaded"
            [(ngModel)]="customer"
            (change)="searchFunc(customer, product, search)"
            placeholder="Search by {{
              paramInOut == 'in' ? 'fournisseur' : 'client'
            }} ..."
          >
          </ng-select>
        </div>
      </div>

      <div class="col-12 col-sm-12 col-md-3 col-lg-3 mb-1">
        <div class="subtext-text" style="text-align: center">
          <button
            (click)="searchFunc(customer, product, search)"
            type="button"
            class="btn btn-primary btn-block toggle-button"
            rippleEffect
          >
            <span [data-feather]="'filter'" [class]="'mr-25'"></span>Filter
          </button>
        </div>
      </div>
    </div>
  </section>`,
  encapsulation: ViewEncapsulation.None,
})
export class FilterComponent implements OnInit, OnChanges{
  @Input() paramInOut;
  @Input() content_loaded: boolean;
  constructor(private dataService: DataService) {}
  // public content_loaded: boolean
  public clients: Client[] = [];
  public fournisseurs: Fournisseur[] = [];
  /* Subscription */
  public sup: Subscription = new Subscription();
  public searchSup: Subscription = new Subscription();
    /*search params*/
    customer;
    product;
    search: string;

    ngOnInit(): void {
       if (this.paramInOut == 'in'){
        this.getAllFornisseurs();
       }else{
        this.getAllClient();
       }
        
    }

    ngOnChanges(changes: SimpleChanges): void {
       
        this.paramInOut = this.paramInOut;
    }

  /** Search function */
  async searchFunc(customer, product, search) {
    this.content_loaded = false;
    this.searchSup.unsubscribe();
    // const data = [
    //   {
    //     type: this.paramType,
    //     search: search ? search : "",
    //     fournisseur:
    //       this.paramType == "purchase" ||
    //       (this.paramType == "invoice" && this.paramInOut == "in")
    //         ? customer
    //           ? customer.id
    //           : ""
    //         : "",
    //     client:
    //       this.paramType == "sale" ||
    //       this.paramType == "simple_sale" ||
    //       this.paramType == "quote" ||
    //       (this.paramType == "invoice" && this.paramInOut == "out")
    //         ? customer
    //           ? customer.id
    //           : ""
    //         : "",
    //     product: product ? product.id : "",
    //   },
    // ];
    const data = [];

    this.searchSup = this.dataService
      .searchFunction("searchInvoicesOrders", data)
      .subscribe(
        async (res: any) => {
          if (res.success) {
            // if (this.paramType == "quote" || this.paramType == "invoice") {
            //   this.quotes = await res.data;
            //   this.tempData = await res.data;
            // } else if (
            //   this.paramType == "sale" ||
            //   this.paramType == "simple_sale" ||
            //   this.paramType == "purchase"
            // ) {
            //   this.orders = await res.data;
            //   this.tempData = await res.data;
            // }
            this.content_loaded = true;

            // console.log("products : ",this.products)
          }
        },
        async (error: any) => {
          console.log(error);
          this.dataService.toastrDanger(
            "Error while taking - Check your info input, " + error
          );
        }
      );
  }
  async getAllClient() {
  
    this.sup = this.dataService.get("clients").subscribe(
      async (res: any) => {
        if (res.success) {
          this.clients = await res.data;
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger(
          "Error while taking Data client, " + error
        );
      }
    );
  }
  async getAllFornisseurs() {

    this.sup = this.dataService.get("fournisseurs").subscribe(
      async (res: any) => {
        if (res.success) {
          this.fournisseurs = await res.data;
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger(
          "Error while taking Data client, " + error
        );
      }
    );
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.sup.unsubscribe();
  }
}
