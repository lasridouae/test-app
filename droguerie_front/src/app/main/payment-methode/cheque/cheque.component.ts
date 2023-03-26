import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExportService } from "@core/services/export.service";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { DataService } from "app/services/data.service";
import { Cheque } from "../../models/cheque";

@Component({
  selector: "app-cheque",
  templateUrl: "./cheque.component.html",
  styleUrls: ["./cheque.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChequeComponent implements OnInit {
  private tempData = [];
  //public
  public contentHeader: object;
  public paramInOut = "";
  @ViewChild(DatatableComponent) table: DatatableComponent;
  contentHeaderSecondeName = "";
  cheques: Cheque[] = [];
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public content_loaded: boolean;
  constructor(
    private router: Router,
    public exportData: ExportService,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.ngOnInit();
    });
  }
  ngOnInit(): void {
    this.paramInOut = this.route.snapshot.paramMap.get("in_out");
    this.content_loaded = false;
    this.getAllCheques();
    if (this.paramInOut == "out") {
      this.contentHeaderSecondeName = " for clients";
    } else if (this.paramInOut == "in") {
      this.contentHeaderSecondeName = " for fournisseurs";
    }
    // content header
    this.contentHeader = {
      headerTitle: "Cheques",
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
  async getAllCheques() {
    let data = [{ in_out: this.paramInOut ? this.paramInOut : "out" }];

    this.dataService.getByParams("cheques", data).subscribe(
      async (res: any) => {
        if (res.success) {
          this.cheques = await res.data;
          this.tempData = this.cheques;
       
          this.content_loaded = true;
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger("Error while taking Data, " + error);
      }
    );
  }
  async updateStatus(cheque) {
    // update status user

    this.dataService.post("cheques/updateStatus", cheque).subscribe(
      async (res: any) => {
        if (res.success) {
          // this.traites = await res.data;
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
  calculate(status) {
    let add = 0;
    for (var i = 0; i < this.cheques.length; i++) {
      if (status == this.cheques[i].status) {
        add += this.cheques[i].amount;
      }
    }
    return add;
    // return this.cheques.reduce((accumulator, object) => {
  
    //   if (status == object.status) {
    //     return accumulator + object.amount;
    //   }
    // }, 0);
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
    this.cheques = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
