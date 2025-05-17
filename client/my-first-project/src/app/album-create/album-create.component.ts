import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-album-create',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MatDialogModule, DialogComponent],
  templateUrl: './album-create.component.html',
  styleUrl: './album-create.component.scss'
})
export class AlbumCreateComponent {
  name = '';
  description = '';
  releaseDate: string | null = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  onSubmit() {
    const albumData = {
      name: this.name,
      description: this.description,
      releaseDate: this.releaseDate
    };
    console.log(albumData);
    this.http.post('http://localhost:5000/app/upload-album', albumData, { withCredentials: true })
      .subscribe(res => {
        this.openSnackBar('Album successfully created.', 3000);
        console.log('Album created successfully:', res);
      });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}
