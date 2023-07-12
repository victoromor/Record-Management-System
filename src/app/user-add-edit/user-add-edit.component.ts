import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { UserService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';


@Component({
  selector: 'app-user-add-edit',
  templateUrl: './user-add-edit.component.html',
  styleUrls: ['./user-add-edit.component.css']
})
export class UserAddEditComponent implements OnInit {
  userForm: FormGroup;

  role: string[] = [
    'User',
    'Admin',
    'SuperAdmin',
  ];

  constructor(
    private _fb: FormBuilder, 
    private _userService: UserService,
    private _dialogRef: MatDialogRef<UserAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
    ){
    this.userForm = this._fb.group({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: '',
      role:'',
      company:'',
      experience:'',
      package:'',
    });
  }

  ngOnInit(): void{
    this.userForm.patchValue(this.data)
  }

  onFormSubmit() {
    if(this.userForm.valid) {
      if(this.data){
        this._userService
        .updateUser(this.data.id, this.userForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('User detail updated successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this._userService.addUser(this.userForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('User added successfully')
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
      
    }
  }

}
