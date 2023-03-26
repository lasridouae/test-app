import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { User } from 'app/main/models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProfileComponent implements OnInit {

  //Private
  private OldPassword = "";
  private NewPassword = "";
  private RetypeNewPassword = "";
  private currentUserLocalStorage: any;
  private oldEmail = "";
  private newEmail = "";

  //Public 
  public contentHeader: object;
  public user: User = new User();
  public isDataEmpty;
  public selectedFiles?: FileList;
  public currentFile?: File;
  public progress = 0;
  public message = '';
  public preview = null;
  public USER_IMAGE_PATH = environment.RESOURCES_LINK + '/' + environment.URL_USER_RSC + '/';
  public content_loaded: boolean
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;

  public uploading = false;

  /* Subscription */
  public EditUserGeneralSup: Subscription = new Subscription();
  public EditUserPasswordSup: Subscription = new Subscription();
  public EditUserInfoSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();
  public CurrentUserConnectedSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
  ) {
    this.currentUserLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
  }

  /**
  * On Destroy
  */
  ngOnDestroy(): void {
    this.EditUserGeneralSup.unsubscribe();
    this.EditUserPasswordSup.unsubscribe();
    this.EditUserInfoSup.unsubscribe();
    this.UploadeImageSup.unsubscribe();
    this.CurrentUserConnectedSup.unsubscribe();
    this.content_loaded = false;
  }

  /**
  * Submit
  *
  * @param form
  */
  editProfilePassword(form) {
    if (form.valid) {
      this.content_loaded = false;
      let data__ = null;

      if (this.NewPassword === this.RetypeNewPassword) {
        const data = {
          id: this.user.id,
          OldPassword: this.OldPassword,
          NewPassword: this.NewPassword,
          RetypeNewPassword: this.RetypeNewPassword,
        };

        this.EditUserGeneralSup = this.dataService.post('profile/changePassword', data).subscribe(async (res: any) => {
          if (res.success) {
            data__ = await res.data;

            // update data user in localStorage - 1
            this.currentUserLocalStorage.password = data__.password;
            localStorage.setItem("currentUser", JSON.stringify(this.currentUserLocalStorage));

            // initialisation inputs old and new password 
            this.OldPassword = "";
            this.NewPassword = "";
            this.passwordTextTypeOld = false;
            this.passwordTextTypeNew = false;
            this.passwordTextTypeRetype = false;

            setTimeout(async () => {
              // Redirect to list
              // await this.router.navigate(['/']);
              this.content_loaded = true;
            }, 800);
            this.dataService.toastrSuccess("Password has been updated");


          }
        },
        async (error: any) => {
          console.log(error)
          this.dataService.toastrDanger("Error while changing password User, " + error);
          setTimeout(async () => {
            this.content_loaded = true;
          }, 800);
        });
      } else {
        this.dataService.toastrWarning("Passwords do not match");
        setTimeout(async () => {
          this.content_loaded = true;
        }, 800);
      }
    }
  }

  /**
  * Submit
  *
  * @param form
  */
  editProfileInfo(form) {
    if (form.valid) {
      this.content_loaded = false;

      let data = null;
      this.EditUserGeneralSup = this.dataService.put('profile/info', this.user).subscribe(async (res: any) => {
        if (res.success) {
          data = await res.data;

          // update data user in localStorage - 1
          this.currentUserLocalStorage.phone = data.phone;
          this.currentUserLocalStorage.adresse = data.adresse;
          this.currentUserLocalStorage.cin = data.cin;
          localStorage.setItem("currentUser", JSON.stringify(this.currentUserLocalStorage));

          setTimeout(async () => {
            // Redirect to list
            // await this.router.navigate(['/']);
            this.content_loaded = true;
          }, 800);
          this.dataService.toastrSuccess("Profile has been updated");

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

  /**
  * Submit
  *
  * @param form
  */
  editProfileGeneral(form) {

    if (form.valid) {
      this.content_loaded = false;
      let data = null;

      if (this.oldEmail == this.newEmail) {
        this.user.email = null;
      } else {
        this.user.email = this.newEmail;
      }

      this.EditUserGeneralSup = this.dataService.put('profile/general', this.user).subscribe(async (res: any) => {
        if (res.success) {
          data = await res.data;


          // update data user in localStorage - 1
          this.currentUserLocalStorage.avatare = data.avatare;
          this.currentUserLocalStorage.name = data.name;
          this.currentUserLocalStorage.email = data.email;

          this.dataService.updateInfoUser_navbar(data.name, data.avatare);

          localStorage.setItem("currentUser", JSON.stringify(this.currentUserLocalStorage));

          setTimeout(async () => {
            // Redirect to list
            // await this.router.navigate(['/']);
            this.content_loaded = true;
          }, 800);
          this.dataService.toastrSuccess("Profile has been updated");

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


  ngOnInit(): void {
    this.content_loaded = false;

    // content header
    this.contentHeader = {
      headerTitle: 'Profile',
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
            name: 'Edit Profile',
            isLink: false,
            // link: '/profile'
          }
        ]
      }
    };


    this.CurrentUserConnectedSup = this.dataService.get('get_user/' + this.currentUserLocalStorage.id).subscribe(async (res: any) => {
      let data = null;
      if (res.success) {
        data = await res.data[0];
        this.user = data;
        this.user.role = data.role_user.role;
        this.oldEmail = this.user.email;
        this.newEmail = this.user.email;
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

  // When Select file from input
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.uploading = true;

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);

        this.upload();
      }
    }
  }


  // Uploade image to Server
  upload(): void {
    let data = null;
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.dataService.uploadImageFile('users/uploadImage', this.currentFile,).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
            if (event instanceof HttpResponse) {
              data = event.body.data
              this.message = event.body.msg
              if (data.result = "ok") {
                this.uploading = false;
                Swal.fire({
                  icon: 'success',
                  text: this.message,
                  confirmButtonColor: "#6FAAE2",
                })
                this.user.avatare = data.filename;
                setTimeout(() => {
                  Swal.close()
                }, 3000);
              }

              this.selectedFiles = undefined;
              this.currentFile = undefined;
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the image!';
            }
            Swal.fire({
              icon: 'error',
              text: this.message,
              confirmButtonColor: "#6FAAE2",
            })
            this.progress = 0;
            this.selectedFiles = undefined;
            this.currentFile = undefined;
            setTimeout(() => {
              Swal.close()
            }, 3000);

          },
        });
      }

    }
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }
}
