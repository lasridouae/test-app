import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnChanges,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { snippetCode } from "@core/components/card-snippet/card-snippet.component";
import { ExportService } from "@core/services/export.service";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { DataService } from "app/services/data.service";
import { ToastrService } from "ngx-toastr";
import { Traite } from "../../models/traite";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
@Component({
  selector: "app-traite",
  templateUrl: "./traite.component.html",
  styleUrls: ["./traite.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TraiteComponent implements OnInit {
  //private
  public traites: Traite[] = [];
  private tempData = [];
  //public
  public contentHeader: object;
  public content_loaded: boolean;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  public paramInOut = "";
  contentHeaderSecondeName = "";
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("tableRowDetails") tableRowDetails: any;
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
  /**
   * Row Details Toggle
   *
   * @param row
   */
  rowDetailsToggleExpand(row) {
    this.tableRowDetails.rowDetail.toggleExpandRow(row);
  }
  ngOnInit(): void {
    this.content_loaded = false;
    this.paramInOut = this.route.snapshot.paramMap.get("in_out");
    this.content_loaded = false;

    this.getAllTraites();
    if (this.paramInOut == "out") {
      this.contentHeaderSecondeName = " for clients";
    } else if (this.paramInOut == "in") {
      this.contentHeaderSecondeName = " for fournisseurs";
    }
    // content header
    this.contentHeader = {
      headerTitle: "Triates",
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
  async updateStatus(trait, event) {
    // update status user
    trait.payment_status = event.target.checked ? "paid" : "unpaid";
    this.dataService.post("traite_details/updateStatus", trait).subscribe(
      async (res: any) => {
        if (res.success) {
          let data_traite = await res.data[0];
          for (let i = 0; i < this.traites.length; i++) {
            if (this.traites[i].id === data_traite.id) {
              this.traites[i] = data_traite;
            }
          }
          this.traites = [...this.traites];
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
  async getAllTraites() {
    let data = [{ in_out: this.paramInOut ? this.paramInOut : "out" }];

    this.dataService.getByParams("traites", data).subscribe(
      async (res: any) => {
        if (res.success) {
          this.traites = await res.data;
      
          this.tempData = this.traites;

          this.content_loaded = true;
        }
      },
      async (error: any) => {
        console.log(error);
        this.dataService.toastrDanger("Error while taking Data, " + error);
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
    this.traites = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  

}
