import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExportService } from "@core/services/export.service";
import { ColumnMode, DatatableComponent, SelectionType } from "@swimlane/ngx-datatable";
import { DataService } from "app/services/data.service";
import { Credit } from '../../models/credit';
import Swal from 'sweetalert2';

@Component({
  selector: "app-credit",
  templateUrl: "./credit.component.html",
  styleUrls: ["./credit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CreditComponent implements OnInit {
  //public
  public contentHeader: object;
  public content_loaded: boolean;
  public paramInOut = "";
  public credits: Credit[] = [];
  private tempData = [];
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  contentHeaderSecondeName = "";
  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    public exportData: ExportService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.paramInOut = this.route.snapshot.paramMap.get("in_out");
    this.content_loaded = false;
    this.getAllCredits();
    if (this.paramInOut == "out") {
      this.contentHeaderSecondeName = " for clients";
    } else if (this.paramInOut == "in") {
      this.contentHeaderSecondeName = " for fournisseurs";
    }
    // content header
    this.contentHeader = {
      headerTitle: "Cridets",
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
            name: this.contentHeaderSecondeName,
            isLink: false,
          },
        ],
      },
    };
  }
  async getAllCredits() {
    let data = [{ in_out: this.paramInOut ? this.paramInOut : "out" }];

    this.dataService.getByParams("credits", data).subscribe(
      async (res: any) => {
        if (res.success) {
          this.credits = await res.data;
        
          this.tempData = this.credits;
          this.content_loaded = true;

        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger("Error while taking Data, " + error);
      }
    );
  }
  async updateStatus(credit,event) {
    // update status user 

    //     event.preventDefault();
    // let that = this;
    // // update status user
    // Swal.fire({
    //   title: "Are you sure?",
    //   text: "You wnat change status!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#7367F0",
    //   cancelButtonColor: "#E42728",
    //   confirmButtonText: "Yes, chnage it!",
    //   customClass: {
    //     confirmButton: "btn btn-primary",
    //     cancelButton: "btn btn-danger ml-1",
    //   },
    // }).then(async function (result) {
    //   if (await result.value) {
        
    //     credit.payment_status = event.target.checked ? 'paid' : 'unpaid';
    // that.dataService
    //   .post('credits/updateStatus' , credit )
    //   .subscribe(async (res: any) => {
    //     if (res.success) {
    //       // that.creditses = await res.data;
    //       that.dataService.toastrSuccess("Status has been updated");
    //     }
    //   },
    //   async (error: any) => {
    //     console.log(error);
    //     that.dataService.toastrDanger(
    //       "Error while taking - Check your info input, " + error
    //     );
    //   }
    // );
    //   }
    // });
    credit.payment_status = event.target.checked ? 'paid' : 'unpaid';
    this.dataService
      .post('credits/updateStatus' , credit )
      .subscribe(async (res: any) => {
        if (res.success) {
          // that.creditses = await res.data;
          this.dataService.toastrSuccess("Status has been updated");
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
  filterUpdate(event) {
    
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      if (d.client_id) {
        return d.client.name.toLowerCase().indexOf(val) !== -1 || !val;
      }else{
        return d.fournisseur.name.toLowerCase().indexOf(val) !== -1 || !val;
      }
    });

    // update the rows
    this.credits = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
