import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { Invoice } from "app/main/models/invoice";

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DataTableComponent implements OnChanges {

  @Input() unpaidInvoce;
  @Input() in_out;
  @Input() title;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  private tempData: Invoice[] = [];
  constructor(private router: Router,) {}
  unpaidInvoces: any;
  content_loaded = false;
  ngOnChanges(): void {
    if (
      typeof this.unpaidInvoce !== "undefined" &&
      this.unpaidInvoce.length > 0
    ) {
      this.unpaidInvoces = this.unpaidInvoce;
      this.tempData = this.unpaidInvoce;
      this.content_loaded = true;
   
    }
  }
  go(){
    this.router.navigate(['transactions/invoice/list/' + this.in_out]);
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data

    const temp = this.tempData.filter((d) => {
      return d.order.some((item) => {
        if (item.client_id) {
          return item.client.name.toLowerCase().indexOf(val) !== -1 || !val;
        } else {
          return (
            item.fournisseur.name.toLowerCase().indexOf(val) !== -1 || !val
          );
        }
      });
    });

    // update the rows
    this.unpaidInvoces = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
