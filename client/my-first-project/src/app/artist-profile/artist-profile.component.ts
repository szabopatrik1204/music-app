import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-artist-profile',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, NgIf, MatSnackBarModule],
  standalone: true,
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.scss'
})
export class ArtistProfileComponent implements OnInit {
  profile: any = null;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:5000/app/profile', { withCredentials: true })
      .subscribe(profile => {
        this.profile = {
          birthDate: profile.birthDate || '',
          hobby: profile.hobby || '',
          genre: profile.genre || '',
          location: profile.location || ''
        };
      });
  }

  updateProfile() {
    this.http.post<any>('http://localhost:5000/app/profile', this.profile, { withCredentials: true })
      .subscribe({
        next: updated => {
          if (updated) {
            this.profile.birthDate = updated.birthDate || '';
            this.profile.hobby = updated.hobby || '';
            this.profile.genre = updated.genre || '';
            this.profile.location = updated.location || '';
          }
          this.openSnackBar('Profil sikeresen frissítve.', 3000);
        },
        error: err => this.openSnackBar('Hiba a frissítéskor!', 3000)
      });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
  }
}