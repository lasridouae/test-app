import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { User } from 'app/main/models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {

  user_form: FormGroup;
  submit_attempt: boolean = false;

  
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

  public paramId = "";
  public uploading = false;
  public isGenerated = true;

  /* Subscription */
  public AddUserSup: Subscription = new Subscription();
  public UploadeImageSup: Subscription = new Subscription();

  constructor(
    private router: Router,
    private dataService: DataService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    // this.user.email = "";
    // this.user.password = "";
  }

  /**
    * On Destroy
    */
  ngOnDestroy(): void {
    this.AddUserSup.unsubscribe();
    this.UploadeImageSup.unsubscribe();
    this.content_loaded = false;
  }

  /**
     * Submit
     *
     * @param form
     */
  addUser() {
    this.submit_attempt = true;

    if (this.user_form.valid) {
      this.AddUserSup = this.dataService.post('users', this.user).subscribe(async (res: any) => {
        if (res.success) {
          this.dataService.toastrSuccess("User has been created");
          this.content_loaded = false;
          setTimeout(async () => {
            // Redirect to list
            await this.router.navigate(['/users/list']);
          }, 1500);
        }
      },
      async (error: any) => {
        console.log(error)
        this.dataService.toastrDanger("Error while deleting User, " + error);
      });
    }
  }

  ngOnInit(): void {
    this.content_loaded = false;
    // Setup form
    this.user_form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      role: ['', Validators.compose([Validators.required])],
      adresse: [''],
      status: [''],
      phone: [''],
      cin: [''],
    });

    // this.user_form.patchValue({
    //   email: "",
    //   password: ""
    // });
    
    setTimeout(() => {
      this.content_loaded = true;
    }, 500);

    // content header
    this.contentHeader = {
      headerTitle: 'Users',
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
            name: 'Edit User',
            isLink: false
          }
        ]
      }
    };
    
    // Default status for user
    this.user.status = 1;
    // setTimeout(() => {
    //   this.user.email = "";
    // }, 1500);
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

  //Generat password
  generatePassword(){
    this.user.password = "";
    this.isGenerated = false;
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 8;
    let password = "";

    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber +1);
     }

    setTimeout(() => {
      this.user.password = password;
      this.isGenerated = true;
    }, 800);
  }
}
