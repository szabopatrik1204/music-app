import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-music-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIcon, MatSnackBarModule],
  templateUrl: './music-upload.component.html',
  styleUrl: './music-upload.component.scss'
})
export class MusicUploadComponent {
selectedFile: File | null = null;
  title = '';
  albumId: string = '';
  albumName = '';
  releaseDate = '';
  albums: any[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/app/get-my-albums', { withCredentials: true })
      .subscribe(albums => {
        console.log('Albums:', albums);
        this.albums = albums;
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.title);
    if (this.albumId) formData.append('albumId', this.albumId);
    formData.append('releaseDate', this.releaseDate);

    this.http.post('http://localhost:5000/app/upload-music', formData, { withCredentials: true })
      .subscribe(res => {
        console.log(res);
        this.openSnackBar('Zene sikeresen feltöltve.', 3000);
      });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, 'Bezárás', {
      duration: duration,
    });
  }
}