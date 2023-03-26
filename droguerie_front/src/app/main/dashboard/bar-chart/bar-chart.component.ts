import { Component, Input, OnInit, ViewEncapsulation, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { colors } from 'app/colors.const';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnChanges {
  @Input() data;
  @Output() dateSelected: EventEmitter<any> = new EventEmitter();

    
    public purchase = [];
    public salles = [];
    public salle_simple = [];

    // Color Variables
    private successColorShade = '#28dac6';
    private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
    private labelColor = '#6e6b7b';
    private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout

  // ng2-flatpickr options
  public DateRangeOptions = {
    altInput: true,
    mode: 'range',
    altInputClass: 'form-control flat-picker bg-transparent border-0 shadow-none flatpickr-input',
    defaultDate: ['2019-05-01', '2019-05-10'],
    altFormat: 'Y-n-j'
  };
    // Range selection Date Picker
    public hoveredDate: NgbDate | null = null;
    public fromDate: NgbDate | null;
    public toDate: NgbDate | null;
      // public _snippetCodeRangeSelectionDP = snippet.snippetCodeRangeSelectionDP;
    /**
   * Constructor
   *
   * @param {NgbCalendar} calendar
   * @param {NgbDateParserFormatter} formatter
   */
  constructor(private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 30);
    this.toDate = calendar.getToday();
   }
    // Bar Chart
    public barChart = {
      chartType: 'bar',
      datasets : [],

       labels: [],
      layout: {
        padding: {
          top: -15,
          bottom: -25,
          left: -15
        }
      },
      options: {
        
        scales: {
        //   y: {
        //     beginAtZero: true
        //   },
        //   x: {
        //     grid: {
        //       offset: false
        //     }
        // },
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                },
                ticks: {
                  min: 0
                }
            }],
            yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
        }
    },
      // options: {
      //   scales: {
      //     x: {
      //         type: 'time',
      //         time: {
      //             unit: 'month'
      //         }
      //     }
      // },
      //   // scales:{
      //   //   x:{
      //   //     type: 'timeseries'
      //   //   }

      //   // },
      //   elements: {
      //     rectangle: {
      //       borderWidth: 2,
      //       borderSkipped: 'bottom'
      //     }
      //   },
      //   responsive: true,
      //   maintainAspectRatio: false,
      //   responsiveAnimationDuration: 500,
    
      //   tooltips: {
      //     // Updated default tooltip UI
      //     shadowOffsetX: 1,
      //     shadowOffsetY: 1,
      //     shadowBlur: 8,
      //     shadowColor: this.tooltipShadow,
      //     backgroundColor: colors.solid.white,
      //     titleFontColor: colors.solid.black,
      //     bodyFontColor: colors.solid.black
      //   },
        // scales: {
        //   xAxes: [
        //     {
        //       barThickness: 15,
        //       display: true,
        //       gridLines: {
        //         display: true,
        //         color: this.grid_line_color,
        //         zeroLineColor: this.grid_line_color
        //       },
        //       scaleLabel: {
        //         display: true
        //       },
        //       ticks: {
        //         fontColor: this.labelColor
        //       }
        //     }
        //   ],
        //   yAxes: [
        //     {
        //       display: true,
        //       gridLines: {
        //         color: this.grid_line_color,
        //         zeroLineColor: this.grid_line_color
        //       },
        //       ticks: {
        //         stepSize: 100,
        //         min: 0,
        //         max: 400,
        //         fontColor: this.labelColor
        //       }
        //     }
        //   ]
        // }
      // },
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 25,
          boxWidth: 9
        }
      },
    };

  ngOnChanges(): void {
    this.purchase = [];
    this.salles = [];
    // this.salle_simple = [];
if (typeof this.data !== 'undefined') {
  Object.entries(this.data.purchases).forEach(([key, value], index) => {
    this.purchase.push({x: key,y: value})
    // console.log(key, value, index);
  });
  Object.entries(this.data.sales).forEach(([key, value], index) => {
    this.salles.push({x: key,y: value})
    // console.log(key, value, index);
  });
   
   console.log('Purchases: '+ this.purchase + 'Salles: '+ this.salles+ 'Sale simple: '+this.salle_simple)
      this.barChart.datasets = [
          {
            data: this.purchase,
            label: 'Purchases',
          },
          {
            data: this.salles,
            label: 'Salles',
          },
          // {
          //   data: this.salle_simple,
          //   label: 'Simple salles',
          // },
      
      ]
}
  }

  emitSelect(event){
    this.dateSelected.emit(event);
  }
  /**
   * Range selection Date Picker
   *
   * @param date
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }
  /**
   * Is Hovered
   *
   * @param date
   */
  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  /**
   * Is Inside
   *
   * @param date
   */
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  /**
   *  Is Range
   *
   * @param date
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
}
