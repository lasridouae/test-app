import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { DataService } from 'app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Employer, EmployerState } from '../models/employer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ExportService } from '@core/services/export.service';


@Component({
  selector: 'app-employers',
  templateUrl: './employers.component.html',
  styleUrls: ['./employers.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None,
})
export class EmployersComponent implements OnInit {
  paymentState_form: FormGroup;

  // Private
  private tempData = [];
  public employers: Employer[] = [];
  public employerStateData: EmployerState[] = [];



  // public
  public contentHeader: object;
  public content_loaded: boolean;
  public SelectionType = SelectionType;
  public ColumnMode = ColumnMode;
  public sideBarComponent = 'employers-sidebar-right';
  date_now = new Date();
  public DefaultDateOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: this.date_now,
    altInput: true
  };


  @ViewChild(DatatableComponent) table: DatatableComponent;
  /* Subscription */
  public ventSup: Subscription = new Subscription();
  public employerState: Subscription = new Subscription();

  constructor(private dataService: DataService, public exportData: ExportService,private datePipe: DatePipe, private fb: FormBuilder, private modalService: NgbModal, private toastr: ToastrService, private _coreSidebarService: CoreSidebarService) { }

  ngOnInit(): void {

    this.content_loaded = false;


    // content header
    this.contentHeader = {
      headerTitle: 'employers',
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
            name: 'employers',
            isLink: false,
            // link: '/employers/list'
          }
        ]
      }
    };
    this.getAllEmployers();
  }


  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.ventSup.unsubscribe();
  }

  async getAllEmployers() {

    this.ventSup = this.dataService
      .get('employers')
      .subscribe(async (res: any) => {
        if (res.success) {

          this.employers = await res.data;

          // Get First 4 words in column Adresse
          // for (let index = 0; index < this.fournisseurs.length; index++) {
          //   this.fournisseurs[index].adresse = this.fournisseurs[index].adresse.split(' ').slice(0,4).join(' ');
          // }

          this.tempData = await this.employers;
          this.content_loaded = true;

          // console.log("clients:",this.fournisseurs);
        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
        });
  }
  deleteItem(id) {
    let that = this;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(async function (result) {
      if (await result.value) {

        // code
        const data = { id: id };
        that.dataService.delete('employers', data).subscribe(async (res: any) => {
          if (res.success) {
            that.content_loaded = false;
            await that.getAllEmployers();
            that.dataService.toastrInfo("employers has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting employers " + error);
          });
      }
    });


  }

  receiveAdd(event) {
    // this.dataFromChild = event;
    this.employers = [
      event,
      ...this.employers
    ];
  }
  receiveEdit(event) {
    // this.dataFromChild = event;
    this.getAllEmployers();
    // console.log("event:" ,event );
  }
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.employers = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  createItemSideBar() {
    this.dataService.createNewObject('employers');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }
  setItemSideBar(idRef) {

    this.dataService.setCurrentObject(idRef, "employers", 'employers');
    this._coreSidebarService.getSidebarRegistry(this.sideBarComponent).toggleOpen();
  }

  getEmployerState(id) {
    this.paymentState_form = this.fb.group({
      amount: ['', Validators.compose([Validators.required])],
      date_payment: [this.date_now],
    });

    this.employerState = this.dataService.getByID('employer_state', id).subscribe(async (res: any) => {

      if (res.success) {

        this.employerStateData = await res.data;
      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }
  addEmplyerState(id) {
    let emplyerState = {
      employer_id: id,
      amount: this.paymentState_form.value.amount,
      // date_payment: this.datePipe.transform(this.paymentState_form.value.date_payment, 'Y-m-d H:i:s'),
      date_payment: new Date(this.paymentState_form.value.date_payment),
    }

    this.dataService.post('employer_state', emplyerState).subscribe(async (res: any) => {
      if (res.success) {
        // this.paymentState_form.value.amount = '';
        this.paymentState_form.controls['amount'].reset();
        this.employerStateData = [emplyerState ,...this.employerStateData];
        this.getAllEmployers();
      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }
  deleteItemSate(row) {
    let that = this;

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(async function (result) {
      if (await result.value) {

        // code
        const data = { id: row.id };

        that.dataService.delete('employer_state', data).subscribe(async (res: any) => {
          if (res.success) {
            that.getEmployerState(row.employer_id);
            that.getAllEmployers();

            that.dataService.toastrInfo("employer_state has been deleted")
            that.table.offset = 0;
          }
        },
          async (error: any) => {
            console.log(error)
            that.dataService.toastrDanger("Error while deleting employer_state " + error);
          });

      }
    });

  }

  // modal Open Form
  modalOpenForm(modalForm, id) {
    this.getEmployerState(id);
    this.modalService.open(modalForm);
  }
}
