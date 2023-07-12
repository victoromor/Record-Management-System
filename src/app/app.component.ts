import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAddEditComponent } from './user-add-edit/user-add-edit.component';
import { UserService } from './services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = [
    'id', 
    'firstName', 
    'lastName', 
    'email', 
    'dob', 
    'gender', 
    'role', 
    'company', 
    'experience', 
    'package',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private _userService: UserService,
    private _coreService: CoreService,
    ) { }
  ngOnInit(): void {
    this.getUserList();
  }
  openAddEditUserForm() {
    const dialogRef = this._dialog.open(UserAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val : any) => {
        if(val){
          this.getUserList();
        }
      }
    })
  }

  getUserList() {
    this._userService.getUserList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id: number){
    this._userService.deleteUser(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('User deleted', 'done')
        this.getUserList();       
      },
      error:  console.log,
    })
  }

  openEditForm(data: any){
    const dialogRef = this._dialog.open(UserAddEditComponent, { 
      data, 
    });

    dialogRef.afterClosed().subscribe({
      next: (val : any) => {
        if(val){
          this.getUserList();
        }
      }
    })
  }
}
