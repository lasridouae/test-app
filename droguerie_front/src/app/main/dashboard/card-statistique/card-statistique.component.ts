import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CardStatisticsService } from './card-statistics.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { colors } from 'app/colors.const';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexStroke, ApexTooltip } from 'ng-apexcharts';
import { DataService } from 'app/services/data.service';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
}
@Component({
  selector: 'app-card-statistique',
  templateUrl: './card-statistique.component.html',
  styleUrls: ['./card-statistique.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers : [CardStatisticsService]
})


export class CardStatistiqueComponent implements OnInit {
  // public
  public orders : number;
  public salles : number;
  public purchases : number;
  public products : number;
  public clients : number;
  public fournisseurs : number;
  public isMenuToggled = false;  
  public statisticsBar;
  public statisticsLine;
  public content_loaded:boolean;

  //colors
  private $barColor = '#f3f3f3';
  private $trackBgColor = '#EBEBEB';
  private $primary_light = '#A9A2F6';
  private $success_light = '#55DD92';
  private $warning_light = '#ffc085';


  // private
  private _unsubscribeAll: Subject<any>;

  @ViewChild('statisticsBarRef') statisticsBarRef: any;
  @ViewChild('statisticsLineRef') statisticsLineRef: any;
  @ViewChild('gainedChartoptionsRef') gainedChartoptionsRef: any;
  @ViewChild('revenueChartoptionsRef') revenueChartoptionsRef: any;
  @ViewChild('salesChartoptionsRef') salesChartoptionsRef: any;
  @ViewChild('orderChartoptionsRef') orderChartoptionsRef: any;
  @ViewChild('trafficChartoptionsRef') trafficChartoptionsRef: any;
  @ViewChild('userChartoptionsRef') userChartoptionsRef: any;
  @ViewChild('newsletterChartoptionsRef') newsletterChartoptionsRef: any;


    // public apexcharts variable
    public gainedChartoptions: Partial<ChartOptions>;
    public revenueChartoptions: Partial<ChartOptions>;
    public salesChartoptions: Partial<ChartOptions>;
    public orderChartoptions: Partial<ChartOptions>;
    public trafficChartoptions: Partial<ChartOptions>;
    public userChartoptions: Partial<ChartOptions>;
    public newsletterChartoptions: Partial<ChartOptions>;
    /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CardStatisticsService} _cardStatisticsService
   */
  constructor(private _cardStatisticsService: CardStatisticsService, private dataService: DataService, private _coreConfigService: CoreConfigService) { 
    this._unsubscribeAll = new Subject();
    this.statisticsBar = {
      chart: {
        height: 70,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: -15
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%',
          startingShape: 'rounded',
          colors: {
            backgroundBarColors: [this.$barColor, this.$barColor, this.$barColor, this.$barColor, this.$barColor],
            backgroundBarRadius: 5
          }
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      colors: [colors.solid.warning],
      series: [
        {
          name: '2020',
          data: [45, 85, 65, 45, 65]
        }
      ],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };
    this.statisticsLine = {
      chart: {
        height: 70,
        type: 'line',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      grid: {
        // show: true,
        borderColor: this.$trackBgColor,
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: false
          }
        },
        padding: {
          // left: 0,
          // right: 0,
          top: -30,
          bottom: -10
        }
      },
      stroke: {
        width: 3
      },
      colors: [colors.solid.info],
      series: [
        {
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      markers: {
        size: 2,
        colors: colors.solid.info,
        strokeColors: colors.solid.info,
        strokeWidth: 2,
        strokeOpacity: 1,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 5,
            fillColor: '#ffffff',
            strokeColor: colors.solid.info,
            size: 5
          }
        ],
        shape: 'circle',
        radius: 2,
        hover: {
          size: 3
        }
      },
      xaxis: {
        labels: {
          show: false,
          style: {
            fontSize: '0px'
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        show: false
      },
      tooltip: {
        x: {
          show: false
        }
      }
    };
  }

  ngOnInit(): void {
    this.content_loaded = false;
    this.getCountOrders();
    this.getCountSalles();
    this.getCountPurchases();
    this.getCountProducts();
    this.getCountClients();
    this.getCountFournisseurs();
    // this._cardStatisticsService.getDataTableRows().subscribe(res=> {
      
    //   this.data = res;
    // })
    
    // this._cardStatisticsService.onCardSatatsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {

    //   this.data = response;
    // });
  }
    /**
   * On destroy
   */
    ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
    }

      /**
   * After View Init
   */
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (
        (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) &&
        localStorage.getItem('currentUser')
      ) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = true;
           this.statisticsBar.chart.width = this.statisticsBarRef?.nativeElement.offsetWidth;
           this.statisticsLine.chart.width = this.statisticsLineRef?.nativeElement.offsetWidth;
          // this.gainedChartoptions.chart.width = this.gainedChartoptionsRef?.nativeElement.offsetWidth;
          // this.revenueChartoptions.chart.width = this.revenueChartoptionsRef?.nativeElement.offsetWidth;
          // this.salesChartoptions.chart.width = this.salesChartoptionsRef?.nativeElement.offsetWidth;
          // this.orderChartoptions.chart.width = this.orderChartoptionsRef?.nativeElement.offsetWidth;
          // this.trafficChartoptions.chart.width = this.trafficChartoptionsRef?.nativeElement.offsetWidth;
          // this.userChartoptions.chart.width = this.userChartoptionsRef?.nativeElement.offsetWidth;
          // this.newsletterChartoptions.chart.width = this.newsletterChartoptionsRef?.nativeElement.offsetWidth;
        }, 500);
      }
    });
  }
  async getCountOrders() {
     this.dataService
      .get('get_count_order')
      .subscribe(async (res: any) => {
        if (res.success) {
            this.orders = await res.data;
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }
  async getCountSalles() {
    this.dataService.get('get_count_salle').subscribe(async (res: any) => {
       if (res.success) {
           this.salles = await res.data;
       }
     },
     async (error: any) => {
       console.log(error)
       this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
     });
 }
 async getCountPurchases() {
  this.dataService.get('get_count_purchase').subscribe(async (res: any) => {
     if (res.success) {
         this.purchases = await res.data;
     }
   },
   async (error: any) => {
     console.log(error)
     this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
   });
}
async getCountProducts() {
  this.dataService.get('get_count_product').subscribe(async (res: any) => {
     if (res.success) {
         this.products = await res.data;
     }
   },
   async (error: any) => {
     console.log(error)
     this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
   });
}
async getCountClients() {
  this.dataService.get('get_count_client').subscribe(async (res: any) => {
     if (res.success) {
         this.clients = await res.data;
     }
   },
   async (error: any) => {
     console.log(error)
     this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
   });
}
async getCountFournisseurs() {
  this.dataService.get('get_count_fournisseurs').subscribe(async (res: any) => {
     if (res.success) {
         this.fournisseurs = await res.data;
         this.content_loaded = true;
     }
   },
   async (error: any) => {
     console.log(error)
     this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
   });
}

}
