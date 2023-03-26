import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmployersComponent } from '../employers.component';
import { Employer } from 'app/main/models/employer';

@Component({
  selector: 'app-employer-sidebar-right',
  templateUrl: './employer-sidebar-right.component.html',
  styleUrls: ['./employer-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmployerSidebarRightComponent implements OnInit {

  @Output() addEvent = new EventEmitter<Employer>();
  @Output() editEvent = new EventEmitter<Employer>();


  //Public 
  public employers: Employer = new Employer();
  public isDataEmpty;
  public sideBarComponent = 'employers-sidebar-right';
  public content_loaded: boolean
  public dataCompleted: Employer;

  public AddEmployersSup: Subscription = new Subscription();
  public UpdateEmployersSup: Subscription = new Subscription();
  public CurrentObjectChangeSup: Subscription = new Subscription();

  @ViewChild(EmployersComponent) employerCom: EmployersComponent;

  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) { }

  /**
     * On Destroy
     */
  ngOnDestroy(): void {
    this.AddEmployersSup.unsubscribe();
    this.UpdateEmployersSup.unsubscribe();
    this.CurrentObjectChangeSup.unsubscribe();
    this.content_loaded = false;

  }

  // ngAfterViewInit() {
  //   // child is set
  //   this.fournisseurCom.ngOnInit();
  // }


  /**
     * Toggle the sidebar
     *
     * @param name
     */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    this.content_loaded = false;

  }

  emitAdd(){
    this.addEvent.emit(this.dataCompleted);
  }
  emitEdit(){
    this.editEvent.emit(this.dataCompleted);
  }
  ngOnInit(): void {
    this.content_loaded = false;
    
    this.CurrentObjectChangeSup = this.dataService.onCurrentObjectChange.subscribe(async response => {
      
      this.content_loaded = false;

      if(await response.success){
        this.employers = response.data;
        this.isDataEmpty = false;
        
      } else {
        this.employers = new Employer();
        this.isDataEmpty = true;
        
      }
      this.content_loaded = true;
    },
    async (error: any) => {
      console.log(error)
      this.dataService.toastrDanger("Error while taking Data, " + error);
    });
  }


  /**
   * Submit
   *
   * @param form
   */
  addEmployers(form) {
    if (form.valid) {
      this.employers.rest = this.employers.salary;
      this.employers.payment_status = 'unpaid';
  
      this.AddEmployersSup = this.dataService.post('employers', this.employers).subscribe(async (res: any) => {

        if (res.success) {
          this.dataService.toastrSuccess("employers has been created");
          // this.fournisseurCom.getAllFournisseur();
          
          this.dataCompleted = await res.data;
          
        
          this.emitAdd();
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while inerting employers, " + error);
      });
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  editEmployers(form) {
    if (form.valid) {

      this.UpdateEmployersSup = this.dataService.put('employers', this.employers).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("employers has been updated");
          this.dataCompleted = await res.data;
          
         this.emitEdit();
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();

        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while editing employers, " + error);
      });
    }
  }

}
