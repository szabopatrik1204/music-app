import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [NgIf, MatButtonModule, RouterModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent {
  @Input() role: string | null = null;
  @Input() nickname: string | null = null;

  logout() {
    fetch('http://localhost:5000/app/logout', { method: 'POST', credentials: 'include' })
      .then(() => window.location.href = '/login');
  }

}
