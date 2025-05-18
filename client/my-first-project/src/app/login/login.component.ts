import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../shared/model/User';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, MatProgressSpinnerModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService, private app: AppComponent) { }

  login() {
    this.isLoading = true;
    setTimeout(() => {
      if (this.email && this.password) {
        this.errorMessage = '';
        this.authService.login(this.email, this.password).subscribe({
          next: (data: any) => {
            if (data) {
              this.isLoading = false;
              this.app.setRole(data.role); // Itt beállítod!
              if (data.role === 'listener') {
                this.router.navigateByUrl('/music-browser');
              } else if (data.role === 'artist') {
                this.router.navigateByUrl('/music-upload');
              } else if (data.role === 'admin') {
                this.router.navigateByUrl('/user-management');
              }
            }
          },
          error: (err) => {
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
      }
    }, 1500);
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}
