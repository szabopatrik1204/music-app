import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AComponentComponent } from './a-component/a-component.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { MusicUploadComponent } from './music-upload/music-upload.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { MusicBrowserComponent } from './music-browser/music-browser.component';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppHeaderComponent, RouterOutlet, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  userRole: string | null = null;

  constructor(private http: HttpClient) {}

  setRole(role: string) {
    this.userRole = role;
  }

  ngOnInit() {
    this.http.get<{ role: string }>('http://localhost:5000/app/me', { withCredentials: true })
      .subscribe({
        next: (user) => {
          this.userRole = user.role;
          console.log('User role:', this.userRole);
        },
        error: () => this.userRole = null
      });
  }
}
