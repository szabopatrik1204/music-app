import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-music-upload',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './music-upload.component.html',
  styleUrl: './music-upload.component.scss'
})
export class MusicUploadComponent {
selectedFile: File | null = null;
  title = '';
  albumName = '';
  releaseDate = '';

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.title);
//    formData.append('artistId', ''); // pl. bejelentkezett user id
    if (this.albumName) formData.append('albumName', this.albumName);
    formData.append('releaseDate', this.releaseDate);

    this.http.post('http://localhost:5000/app/upload-music', formData, { withCredentials: true })
      .subscribe(res => {
        console.log(res);
        // sikeres feltöltés kezelése
      });
  }
}