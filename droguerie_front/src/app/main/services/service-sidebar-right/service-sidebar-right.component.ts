import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Services } from 'app/main/models/service';
import { ServicesComponent } from '../services.component';

@Component({
  selector: 'app-service-sidebar-right',
  templateUrl: './service-sidebar-right.component.html',
  styleUrls: ['./service-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceSidebarRightComponent implements OnInit {

  @Output() addEvent = new EventEmitter<Services>();
  @Output() editEvent = new EventEmitter<Services>();


  //Public 
  public services: Services = new Services();
  public isDataEmpty;
  public sideBarComponent = 'service-sidebar-right';
  public content_loaded: boolean
  public dataCompleted: Services;

  public AddServicesSup: Subscription = new Subscription();
  public UpdateServicesSup: Subscription = new Subscription();
  public CurrentObjectChangeSup: Subscription = new Subscription();

  @ViewChild(ServicesComponent) serviceCom: ServicesComponent;

  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) { }

  /**
     * On Destroy
     */
  ngOnDestroy(): void {
    this.AddServicesSup.unsubscribe();
    this.UpdateServicesSup.unsubscribe();
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
        this.services = response.data;
        this.isDataEmpty = false;
        
      } else {
        this.services = new Services();
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
  addService(form) {
    if (form.valid) {
    
      this.AddServicesSup = this.dataService.post('services', this.services).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("service has been created");
          // this.fournisseurCom.getAllFournisseur();
          
          this.dataCompleted = await res.data;
          
          this.emitAdd();
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while inerting service, " + error);
      });
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  editService(form) {
    if (form.valid) {

      this.UpdateServicesSup = this.dataService.put('services', this.services).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("service has been updated");
          this.dataCompleted = await res.data;
         this.emitEdit();
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();

        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while editing service, " + error);
      });
    }
  }

}
