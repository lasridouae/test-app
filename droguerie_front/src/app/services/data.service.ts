import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ToastrService, GlobalConfig } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  //Public 
  public currentObject;
  public ParentsCategoryCreateObject;
  public ParentsCategoryEditObject;

  // Info user in NavBar

  public onCurrentObjectChange: BehaviorSubject<any>;
  public onParentCategoryCreateRoute: BehaviorSubject<any>;
  public onParentCategoryEditRoute: BehaviorSubject<any>;
  public isDataLoaded: BehaviorSubject<any>;

  public userInfo_navbar: BehaviorSubject<any>;

  // public isRowInserted : boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.onCurrentObjectChange = new BehaviorSubject({});
    this.onParentCategoryCreateRoute = new BehaviorSubject({});
    this.onParentCategoryEditRoute = new BehaviorSubject({});
    this.isDataLoaded = new BehaviorSubject({});
    this.userInfo_navbar = new BehaviorSubject({});
  }

  // resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
  //   return new Promise<void>((resolve, reject) => {
  //     Promise.all([this.setCurrentObject()]).then(() => {
  //       resolve();
  //     }, reject);
  //   });
  // }

  /**
   * 
   * @param serviceName 
   * @param data 
   * @returns
   * 
   * General Service for All Components
   */
  post(serviceName: string, data: any) {

    const url = environment.apiUrl + serviceName;
    return this.http.post(url, data);
  }

  postByParams(serviceName: string, data: any) {
    const keys = Object.keys(data[0]);
    const values = Object.values(data[0]);
    let params_url = "";
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        params_url += `${key}=${values[index]}`;
      } else {
        params_url += `${key}=${values[index]}&`;
      }
    });
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const options = { headers: headers, withCredintials: false };
    const url = environment.apiUrl + serviceName + "?" + params_url;
    // console.log("____URL____: ",url);

    return this.http.post(url, []);
  }

  put(serviceName: string, data: any) {

    const url = environment.apiUrl + serviceName + "/" + data.id;

    return this.http.put(url, data);
  }

  getByID(serviceName: string, id: any): Observable<any> {

    const url = environment.apiUrl + serviceName + "/" + id;
    // return this.http.get(url, data);
    return this.http.get(url).pipe(map((res) => {
      return res;
    })
    );
  }

  getByParams(serviceName: string, data: any) {
    const keys = Object.keys(data[0]);
    const values = Object.values(data[0]);
    let params_url = "";
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        params_url += `${key}=${values[index]}`;
      } else {
        params_url += `${key}=${values[index]}&`;
      }
    });
    const url = environment.apiUrl + serviceName + "?" + params_url;
    // console.log("____URL____: ",url);

    return this.http.get(url).pipe(map((res) => {
      return res;
    })
    );
  }

  get(serviceName: string): Observable<any> {

    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const options = { headers: headers, withCredintials: false };
    const url = environment.apiUrl + serviceName;

    // return this.http.get(url, data);
    return this.http.get(url).pipe(map((res) => {
      return res;
    })
    );
  }

  delete(serviceName: string, data: any) {

    const url = environment.apiUrl + serviceName + "/" + data.id;

    return this.http.delete(url);
  }

  deleteByParam(serviceName: string, data: any) {

    const url = environment.apiUrl + serviceName ;

    return this.http.post(url, data);
  }

  uploadImage(serviceName: string, data: any, blobData, name, ext) {
    const formData = new FormData();
    formData.append('idAcc', data.id);
    formData.append('imageFile', blobData, `myimage.${ext}`);
    // formData.append('name', name);
    const url = environment.apiUrl + serviceName;

    return this.http.post(url, formData, { responseType: 'text' });
  }

  uploadImageFile(serviceName: string, file: File): Observable<HttpEvent<any>>{
    const ext = file.name.split('.').pop();
    const filename = file.name.split('.')[0];
    const formData = new FormData();
    // if(data.id != null){
    //   formData.append('idCat', data.id);
    // }
    // formData.append('id', data.id);
    formData.append('imageFile', file, `myimage.${ext}`);
    formData.append('name', filename);
    const url = environment.apiUrl + serviceName;

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
    // return this.http.post(url, formData, { reportProgress: true, responseType: 'json', });
  }


 /**
   ************** Search Functions -------------------------------------------- START
  */

   searchFunction(serviceName: string, data: any) {
    const keys = Object.keys(data[0]);
    const values = Object.values(data[0]);
    let params_url = "";
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        params_url += `${key}=${values[index]}`;
      } else {
        params_url += `${key}=${values[index]}&`;
      }
    });
    const url = environment.apiUrl + serviceName + "?" + params_url;

    return this.http.get(url).pipe(map((res) => {
      return res;
    })
    );
  }


   
   /**
   ************** Search Functions -------------------------------------------- START
  */




  /**
   ************** BehaviorSubject Methods -------------------------------------------- START
  ******************************************************************************************
  */

  async createNewObject(model = null) {
    this.currentObject = {};
    this.onCurrentObjectChange.next(this.currentObject);
    
    if(model == "categories"){
      await this.getAllParentCategoryCreate()
    }
    
  }

  async setCurrentObject(id, serviceName, model) {
    const url = environment.apiUrl + serviceName + "/" + id;
    
    return new Promise((resolve, reject) => {
      
      this.http.get(url).subscribe(async (res: any) => {
        
        this.currentObject = await res;
        this.onCurrentObjectChange.next(this.currentObject);
        
        if(model == "categories"){
          await this.getAllParentCategoryEdit(id)
        }
        
        resolve(this.currentObject);
      }, reject);
    });
  }



  // List of Models (Select Options)
  // -----------------------------------------------------------------------------------------------------
  
  // Parent Category (Route create)
  async getAllParentCategoryCreate() {
    const url = environment.apiUrl + "categories/create";
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(async (res: any) => {
        this.ParentsCategoryCreateObject = await res;
        this.onParentCategoryCreateRoute.next(this.ParentsCategoryCreateObject);
        resolve(this.ParentsCategoryCreateObject);
      }, reject);
    });
  }

  // Parent Category (Route edit)
  async getAllParentCategoryEdit(id) {
    const url = environment.apiUrl + "categories/edit/" + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(async (res: any) => {
        this.ParentsCategoryEditObject = await res;
        this.onParentCategoryEditRoute.next(this.ParentsCategoryEditObject);
        resolve(this.ParentsCategoryEditObject);
      }, reject);
    });
  }

  async updateData() {
    const data = {data : true}
    this.isDataLoaded.next(data);
  }

  async updateInfoUser_navbar(fullName_user , avatare_user) {
    const data = {
      fullName_user : fullName_user,
      avatare_user : avatare_user,
    }
    this.userInfo_navbar.next(data);
  }


  /**
   ************** BehaviorSubject Methods -------------------------------------------- END
  ******************************************************************************************
  */




  /**
   ************** Toast Methods ------------------------------------------------------- START
  ******************************************************************************************
  */

  // Success
  toastrSuccess(message) {
    this.toastr.success(message, 'Success!', {
      toastClass: 'toast ngx-toastr',
      closeButton: true
    });
  }

  // Info
  toastrInfo(message) {
    this.toastr.info(message, 'Info!', {
      toastClass: 'toast ngx-toastr',
      closeButton: true
    });
  }

  // Warning
  toastrWarning(message) {
    this.toastr.warning(message, 'Warning!', {
      toastClass: 'toast ngx-toastr',
      closeButton: true
    });
  }

  // Danger
  toastrDanger(message) {
    this.toastr.error(message, 'Error!', {
      toastClass: 'toast ngx-toastr',
      closeButton: true
    });
  }

  /**
   ************** Toast Methods ------------------------------------------------------- END
  ******************************************************************************************
  */

    /**
   ************** Compare Dates Methods ------------------------------------------------------- END
  ******************************************************************************************
  */
  compareDates(d1) {
    let date1 = new Date(d1).getTime();
    let date2 = new Date().getTime();
    if (date1 < date2) {
      // this.toastrDanger('khassou ytkhles nhar flani');
      return parseInt(this.getDaysDiffBetweenDates(date2, date1).toString());
    } else if (date1 > date2) {
      let x = parseInt(this.getDaysDiffBetweenDates(date2, date1).toString());
      return x;
    } else {
      // this.toastrDanger('khassou ytkhles lyoma');
      return "today";
    }
  }
  getDaysDiffBetweenDates = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / (1000 * 3600 * 24);
}
