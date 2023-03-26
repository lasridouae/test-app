import { Cash } from './../../models/cash';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from '@core/services/export.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-cash',
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CashComponent implements OnInit {
  private tempData = [];
  //public
  public contentHeader: object;
  public paramInOut = "";
  public ColumnMode = ColumnMode;
  public SelectionType = SelectionType;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  contentHeaderSecondeName = "";
  cashes: Cash[] = []
  public content_loaded: boolean;
  constructor(private router: Router,
    private dataService: DataService,
    public exportData: ExportService,
    private route: ActivatedRoute,) { 
      this.route.paramMap.subscribe(params => {
        this.ngOnInit();
    });
    }

  ngOnInit(): void {
    this.content_loaded = false;
    this.paramInOut = this.route.snapshot.paramMap.get('in_out');
    this.content_loaded = false;
      this.getAllCashes();
      if (( this.paramInOut == 'out')) {
        this.contentHeaderSecondeName = ' for clients';
      } else if ( this.paramInOut == 'in') {
        this.contentHeaderSecondeName = ' for fournisseurs';
      }
        // content header
        this.contentHeader = {
          headerTitle: 'Cashes',
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
                name: this.contentHeaderSecondeName,
                isLink: false
              }
            ]
          }
        };
       
  }
  async getAllCashes() {

    let data = [{ in_out: this.paramInOut ? this.paramInOut : 'out' }];

     this.dataService
      .getByParams('cashes', data)
      .subscribe(async (res: any) => {
        if (res.success) {
          this.cashes = await res.data;

           this.tempData = this.cashes;
          this.content_loaded = true;
         
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking Data, " + error);
        });
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
    this.cashes = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
