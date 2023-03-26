import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Fournisseur } from 'app/main/models/fournisseur';
// import { FournisseursComponent } from '../fournisseurs.component';

@Component({
  selector: 'app-fournisseur-sidebar-right',
  templateUrl: './fournisseur-sidebar-right.component.html',
  styleUrls: ['./fournisseur-sidebar-right.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FournisseurSidebarRightComponent implements OnInit {

  @Output() dataEvent = new EventEmitter<any>();


  //Public 
  public fournisseur: Fournisseur = new Fournisseur();
  public isDataEmpty;
  public sideBarComponent = 'fournisseur-sidebar-right';
  public content_loaded: boolean
  public dataCompleted: Fournisseur;

  public AddFournisseurSup: Subscription = new Subscription();
  public UpdateFournisseurSup: Subscription = new Subscription();
  public CurrentObjectChangeSup: Subscription = new Subscription();

  // @ViewChild(FournisseursComponent) fournisseurCom: FournisseursComponent;

  constructor(private router: Router, private dataService: DataService, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) { }

  /**
     * On Destroy
     */
  ngOnDestroy(): void {
    this.AddFournisseurSup.unsubscribe();
    this.UpdateFournisseurSup.unsubscribe();
    this.CurrentObjectChangeSup.unsubscribe();
    this.content_loaded = false;

  }

  // ngAfterViewInit() {
  //   // child is set
    // this.fournisseurCom.ngOnInit();
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

  emitData(operation){
    this.dataEvent.emit(this.dataCompleted);
  }
  
  ngOnInit(): void {
    this.content_loaded = false;

    this.CurrentObjectChangeSup = this.dataService.onCurrentObjectChange.subscribe(async response => {
      this.content_loaded = false;

      if(await response.success){
        this.fournisseur = response.data;
        this.isDataEmpty = false;
      } else {
        this.fournisseur = new Fournisseur();
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
  addFournisseur(form) {
    if (form.valid) {

      this.AddFournisseurSup = this.dataService.post('fournisseurs', this.fournisseur).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Fournisseur has been created");
          // this.fournisseurCom.getAllFournisseur();
          
          this.dataCompleted = await res.data;
          this.emitData("add");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while inerting Fournisseur, " + error);
      });
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  editFournisseur(form) {
    if (form.valid) {

      this.UpdateFournisseurSup = this.dataService.put('fournisseurs', this.fournisseur).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("Fournisseur has been updated");
          this.dataCompleted = await res.data;
          this.emitData("update");
          this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();

        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while editing Fournisseur, " + error);
      });
    }
  }

}
