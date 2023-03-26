import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { Setting } from '../models/setting';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  //Public 
  public contentHeader: object;
  public setting: Setting = new Setting();

  public selectedFilesLogo?: FileList;
  public currentFileLogo?: File;
  public progressLogo = 0;
  public messageLogo = '';
  public previewLogo = null;
  public uploadingLogo = false;

  public selectedFilesBg?: FileList;
  public currentFileBg?: File;
  public progressBg = 0;
  public messageBg = '';
  public previewBg = null;
  public uploadingBg = false;

  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_SETTING_RSC + '/';
  public content_loaded: boolean;

  private currentSettingLocalStorage: any;


  /* Subscription */
  public EditSettingsSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();
  public CurrentSettingsSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    public _coreConfigService: CoreConfigService,

  ) {
    // this.currentSettingLocalStorage = JSON.parse(localStorage.getItem('settingsApp'));
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.EditSettingsSup.unsubscribe();
    this.UploadeImageSup.unsubscribe();
    this.CurrentSettingsSup.unsubscribe();
    this.content_loaded = false;
  }

  ngOnInit(): void {
    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Setting',
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
            name: 'Edit Setting',
            isLink: false,
            // link: '/settings'
          }
        ]
      }
    };


    this.CurrentSettingsSup = this.dataService.get('settings').subscribe(async (res: any) => {
      let data = null;
      if (res.success) {
        data = await res.data;
        this.setting = data;

        this.content_loaded = true;
      } else {
        console.log('Error while taking - Check your info input');
      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while taking - Check your info input, " + error);
      });
  }

  /**
  * Submit
  *
  * @param form
  */
  editSetting(form) {
    if (form.valid) {
      this.content_loaded = false;

      const postData = {
        id: this.setting.id ? this.setting.id : null,
        appName: this.setting.appName,
        appTitle: this.setting.appTitle,
        appLogoImage: this.setting.appLogoImage,
        appBgLoginImage: this.setting.appBgLoginImage,
        appAdresse: this.setting.appAdresse,
        appPhone1: this.setting.appPhone1,
        appPhone2: this.setting.appPhone2,
        appFixe: this.setting.appFixe,
      }


      let data = null;
      this.EditSettingsSup = this.dataService.post('settings', postData).subscribe(async (res: any) => {
        if (res.success) {
          data = await res.data;
          this.setting = data;
          await this.updateSettinginCoreConfigLocal();

          setTimeout(async () => {
            this.content_loaded = true;
          }, 800);
          this.dataService.toastrSuccess("Settings has been updated");

        }
      },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while changing info User, " + error);
          setTimeout(async () => {
            this.content_loaded = true;
          }, 800);
        });
    }
  }

  async updateSettinginCoreConfigLocal() {
    this._coreConfigService.setConfig({
      app: {
        appName: this.setting.appName,
        appTitle: this.setting.appTitle,
        appLogoImage: this.setting.appLogoImage ? this.USER_IMAGE_PATH + this.setting.appLogoImage : 'assets/images/logo/logo.svg',
        appBgLoginImage: this.setting.appBgLoginImage ? this.USER_IMAGE_PATH + this.setting.appBgLoginImage : 'assets/images/pages/login-v2.svg',
      }
    }, { emitEvent: true });
  }

  removeTypeImg(TypeImgToremove) {
    const postData = {
      id: this.setting.id ? this.setting.id : null,
      TypeImgToremove: TypeImgToremove == 'logo' || TypeImgToremove == 'background' ? TypeImgToremove : null,
    }

    let data = null;
    this.EditSettingsSup = this.dataService.post('settings', postData).subscribe(async (res: any) => {
      if (res.success) {
        data = await res.data;
        this.setting = data;
        await this.updateSettinginCoreConfigLocal();

        setTimeout(async () => {
          this.content_loaded = true;
        }, 800);
        this.dataService.toastrSuccess("Settings has been updated");

      }
    },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while changing info User, " + error);
        setTimeout(async () => {
          this.content_loaded = true;
        }, 800);
      });
  }

  // -----------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------

  // When Select file from input
  selectFileLogo(event: any): void {
    this.messageLogo = '';
    this.previewLogo = '';
    this.progressLogo = 0;
    this.selectedFilesLogo = event.target.files;

    if (this.selectedFilesLogo) {
      const file: File | null = this.selectedFilesLogo.item(0);
      this.uploadingLogo = true;

      if (file) {
        this.previewLogo = '';
        this.currentFileLogo = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewLogo = e.target.result;
        };

        reader.readAsDataURL(this.currentFileLogo);

        this.uploadLogo();
      }
    }
  }
  // When Select file from input
  selectFileBg(event: any): void {
    this.messageBg = '';
    this.previewBg = '';
    this.progressBg = 0;
    this.selectedFilesBg = event.target.files;

    if (this.selectedFilesBg) {
      const file: File | null = this.selectedFilesBg.item(0);
      this.uploadingBg = true;

      if (file) {
        this.previewBg = '';
        this.currentFileBg = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previewBg = e.target.result;
        };

        reader.readAsDataURL(this.currentFileBg);

        this.uploadBg();
      }
    }
  }

  // Uploade Logo to Server
  uploadLogo(): void {
    let data = null;
    this.progressLogo = 0;

    if (this.selectedFilesLogo) {
      const file: File | null = this.selectedFilesLogo.item(0);

      if (file) {
        this.currentFileLogo = file;

        this.dataService.uploadImageFile('settings/updateImagesAppSetting', this.currentFileLogo,).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressLogo = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.messageLogo = event.body.message;
            }
            if (event instanceof HttpResponse) {
              data = event.body.data
              this.messageLogo = event.body.msg
              if (data.result = "ok") {
                this.uploadingLogo = false;
                Swal.fire({
                  icon: 'success',
                  text: this.messageLogo,
                  confirmButtonColor: "#6FAAE2",
                })
                this.setting.appLogoImage = data.filename;
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              }

              this.selectedFilesLogo = undefined;
              this.currentFileLogo = undefined;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progressLogo = 0;

            if (err.error && err.error.message) {
              this.messageLogo = err.error.message;
            } else {
              this.messageLogo = 'Could not upload the image!';
            }
            Swal.fire({
              icon: 'error',
              text: this.messageLogo,
              confirmButtonColor: "#6FAAE2",
            })
            this.progressLogo = 0;
            this.selectedFilesLogo = undefined;
            this.currentFileLogo = undefined;
            setTimeout(() => {
              Swal.close()
            }, 3000);

          },
        });
      }

    }
  }

  // Uploade Background Login to Server
  uploadBg(): void {
    let data = null;
    this.progressBg = 0;

    if (this.selectedFilesBg) {
      const file: File | null = this.selectedFilesBg.item(0);

      if (file) {
        this.currentFileBg = file;

        this.dataService.uploadImageFile('settings/updateImagesAppSetting', this.currentFileBg,).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progressBg = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.messageBg = event.body.message;
            }
            if (event instanceof HttpResponse) {
              data = event.body.data
              this.messageBg = event.body.msg
              if (data.result = "ok") {
                this.uploadingBg = false;
                Swal.fire({
                  icon: 'success',
                  text: this.messageBg,
                  confirmButtonColor: "#6FAAE2",
                })
                this.setting.appBgLoginImage = data.filename;
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              }

              this.selectedFilesBg = undefined;
              this.currentFileBg = undefined;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progressBg = 0;

            if (err.error && err.error.message) {
              this.messageBg = err.error.message;
            } else {
              this.messageBg = 'Could not upload the image!';
            }
            Swal.fire({
              icon: 'error',
              text: this.messageBg,
              confirmButtonColor: "#6FAAE2",
            })
            this.progressBg = 0;
            this.selectedFilesBg = undefined;
            this.currentFileBg = undefined;
            setTimeout(() => {
              Swal.close()
            }, 3000);

          },
        });
      }

    }
  }

  removeImg(type) {

  }

}
