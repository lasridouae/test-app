import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DataService } from "app/services/data.service";
import { Invoice } from "../models/invoice";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  constructor(private dataService: DataService) {}

  public contentHeader: object;
  public content_loaded: boolean;
  public content_loaded_invoice: boolean;
  public content_loaded_topProduct: boolean;
  public content_loaded_topCategory: boolean;
  public content_loaded_topClient: boolean;
  public SallesAndPurchase: any;
  public topProduct: any;
  public topCategory: any;
  public clientUnpaidInvoces: Invoice[] = [];
  public fournisseurUnpaidInvoces: Invoice[] = [];
  public topClient: any;
  chartColors1 = [
     "#ffe700",
    "#00d4bd",
     "#d05f9b",
    "#2b9bf4",
     "#FFA1A1",
];
  chartColors2 = [
     "#ec3f33",
    "#0c3622",
    "#e08788",
     "#c91c25",
     "#a87603",
    ];
  chartColors3 = [
    "#2a031e",
    "#006ed4",
    "#00885f",
    "#2c033d",
    "#11ee8f",
  ];
     
  

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.content_loaded = false;
    this.content_loaded_invoice = false;
    this.content_loaded_topCategory = false;
    this.content_loaded_topClient = false;
    this.content_loaded_topProduct = false;
    this.getSalesAndPurchases(30);
    this.getTopSellingProduct();
    this.unpaidInvoice();
    this.getTopClient();
    this.getTopCategory();
    this.contentHeader = {
      headerTitle: "Home",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Dashboard",
            isLink: false,
          },
        ],
      },
    };
  }

  async getSalesAndPurchases(event) {
    this.dataService
      .get(`get_sales_and_purchases_day/${event}`)
      .subscribe(
        async (res: any) => {
          if (res.success) {
            this.SallesAndPurchase = await res.data;

            this.content_loaded = true;
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
  async getTopSellingProduct() {
    this.dataService.get("get_top_product").subscribe(
      async (res: any) => {
        if (res.success) {
          this.topProduct = await res.data;
          this.content_loaded_topProduct = true;
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
  async getTopClient() {
    this.dataService.get("get_top_client").subscribe(
      async (res: any) => {
        if (res.success) {
          this.topClient = await res.data;
          this.content_loaded_topClient = true;
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
  async getTopCategory() {
    this.dataService.get("get_top_category").subscribe(
      async (res: any) => {
        if (res.success) {
          this.topCategory = await res.data;
          this.content_loaded_topCategory = true;
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
  async unpaidInvoice() {
    this.dataService.get("get_unpaid_invoice").subscribe(
      async (res: any) => {
        if (res.success) {
          await res.data.forEach((element) => {
            if (element.in_out == "out") {
              this.clientUnpaidInvoces.push(element);
            } else {
              this.fournisseurUnpaidInvoces.push(element);
            }
          });
          this.content_loaded_invoice = true;
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
}
