import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Client } from 'app/main/models/client';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
// import { ClientsComponent } from '../clients.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-sidebar-right',
  templateUrl: './client-sidebar-right.component.html',
  styleUrls: ['./client-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // standalone: true,
  // imports: [CommonModule]
})
export class ClientSidebarRightComponent implements OnInit {

  @Output() dataEvent = new EventEmitter<any>();


  //Public 
  public client: Client = new Client();
  public dataCompleted: Client;
  public sideBarComponent = 'client-sidebar-right';
  public content_loaded: boolean
  public isDataEmpty;

  public AddClientSup: Subscription = new Subscription();
  public UpdateClientSup: Subscription = new Subscription();
  public CurrentObjectChangeSup: Subscription = new Subscription();


  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService ) {}

  // public clientComponent = new ClientsComponent(this.router, this.dataService, this.toastr, this._coreSidebarService);

   /**
   * On Destroy
   */
   ngOnDestroy(): void {
    this.AddClientSup.unsubscribe();
    this.UpdateClientSup.unsubscribe();
    this.CurrentObjectChangeSup.unsubscribe();
    this.content_loaded = false;

  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    this.content_loaded = false;

  }

  emitData(operation){
    this.dataEvent.emit(this.dataCompleted);
  }

  /**
   * Submit
   *
   * @param form
   */
  addClient(form) {
    if (form.valid) {
      // console.log("Edit Client : " , form.value);

      this.AddClientSup = this.dataService.post('clients', this.client).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Client has been created");
          this.dataService.updateData();
          this.dataCompleted = await res.data;
          this.emitData("add");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
        } 
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while inserting client, " + error);
      });
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  editClient(form) {
    if (form.valid) {
      // console.log("Edit Client : " , form.value);

      this.UpdateClientSup = this.dataService.put('clients', this.client).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Client has been updated");
          // await this.clientComponent.getAllClient();
          this.dataCompleted = await res.data;
          this.emitData("update");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();

        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while editing client, " + error);
      });
    }
  }

  ngOnInit(): void {
    this.content_loaded = false;

    this.CurrentObjectChangeSup = this.dataService.onCurrentObjectChange.subscribe(async response => {
      this.content_loaded = false;

      if(await response.success){
        this.client = response.data;
        this.isDataEmpty = false;
      } else {
        this.client = new Client();
        this.isDataEmpty = true;
      }
      this.content_loaded = true;
    },
    async (error: any) => {
      console.log(error)
      this.dataService.toastrDanger("Error while taking Data client, " + error);
    });
  }


  

}
