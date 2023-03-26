import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { colors } from 'app/colors.const';
import { ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
export interface ChartOptions2 {
  // Apex-non-axis-chart-series
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  colors?: string[];
  legend?: ApexLegend;
  labels?: any;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  markers?: ApexMarkers[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  states?: ApexStates;
}
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {
  @Input() data;
  @Input() title;
  @Input() chartColors;
    // Color Variables
    private primaryColorShade = '#836AF9';
    private successColorShade = '#28dac6';
    private warningColorShade = '#ffe802';
    private infoColorShade = '#299AFF';
    private greyColor = '#4F5D70';

    private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
    public apexDonutChart: Partial<ChartOptions2>;
    public isMenuToggled = false;
    @ViewChild('apexDonutChartRef') apexDonutChartRef: any;
   // Color Variables
  
  constructor(private _coreConfigService: CoreConfigService) { 
  
    this.apexDonutChart = {
      series: [],
      labels: [],
      chart: {
        height: 600,
        type: 'donut'
      },
      colors: [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                fontSize: '2rem',
                fontFamily: 'Montserrat'
              },
              value: {
                fontSize: '1rem',
                fontFamily: 'Montserrat',
                formatter: function (val) {
                 if (typeof val !== 'undefined') {
                  return parseInt(val).toString();
                 }
                }
              },
              // total: {
              //   show: true,
              //   fontSize: '1.5rem',
              //   label: 'Operational',
              //   formatter: function (w) {
              //     return '31%';
              //   }
              // }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 450
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
 
  }

  ngOnChanges(): void {
   
  if (typeof this.data !== 'undefined') {
    let series = [];
    let labels = [];
    this.data.forEach(element => {
      series.push(element.total_sales?element.total_sales:element.total_purchase)
      labels.push(element.name)
    });
    this.apexDonutChart.series = series;
    this.apexDonutChart.labels = labels;
    this.apexDonutChart.colors = this.chartColors;
    
    // window.dispatchEvent(new Event('resize'))
  }
 

  }
   
    // // polar Area Chart
    // public polarAreaChart = {
    //   chartType: 'polarArea',
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: false,
    //     responsiveAnimationDuration: 500,
    //     legend: {
    //       position: 'right',
    //       labels: {
    //         usePointStyle: true,
    //         padding: 25,
    //         boxWidth: 10
    //       }
    //     },
    //     tooltips: {
    //       // Updated default tooltip UI
    //       shadowOffsetX: 1,
    //       shadowOffsetY: 1,
    //       shadowBlur: 8,
    //       shadowColor: this.tooltipShadow,
    //       backgroundColor: colors.solid.white,
    //       titleFontColor: colors.solid.black,
    //       bodyFontColor: colors.solid.black
    //     },
    //     scale: {
    //       scaleShowLine: true,
    //       scaleLineWidth: 1,
    //       ticks: {
    //         display: false
    //       },
    //       reverse: false,
    //       gridLines: {
    //         display: false
    //       }
    //     },
    //     animation: {
    //       animateRotate: false
    //     }
    //   },
  
    //   labels: ['Africa', 'Asia', 'Europe', 'America', 'Antarctica', 'Australia'],
    //   datasets: [
    //     {
    //       label: 'Population (millions)',
    //       backgroundColor: [
    //         this.primaryColorShade,
    //         this.warningColorShade,
    //         colors.solid.primary,
    //         this.infoColorShade,
    //         this.greyColor,
    //         this.successColorShade
    //       ],
    //       data: [19, 17.5, 15, 13.5, 11, 9],
    //       borderWidth: 0
    //     }
    //   ]
    // };
 /**
   * After View Init
   */
 ngAfterViewInit() {
  // Subscribe to core config changes
  this._coreConfigService.getConfig().subscribe(config => {
    // If Menu Collapsed Changes
    if (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) {
      setTimeout(() => {
        // Get Dynamic Width for Charts
        this.isMenuToggled = true;
        this.apexDonutChart.chart.width = this.apexDonutChartRef?.nativeElement.offsetWidth;
    
      }, 900);
    }
  });
}
}
