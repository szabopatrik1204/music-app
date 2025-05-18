import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-music-management',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './music-management.component.html',
  styleUrl: './music-management.component.scss'
})
export class MusicManagementComponent implements OnInit {
  unapprovedTracks: any[] = [];

  constructor(private http: HttpClient) {}

  approveTrack(track: any) {
    this.http.post<any>('http://localhost:5000/app/approve-track', { trackId: track._id }, { withCredentials: true })
      .subscribe({
        next: () => {
          this.unapprovedTracks = this.unapprovedTracks.filter(t => t._id !== track._id);
        },
        error: err => {
          alert('Hiba a jóváhagyáskor!');
          console.error(err);
        }
      });
  }

  deleteTrack(track: any) {
  this.http.post<any>('http://localhost:5000/app/delete-track', { trackId: track._id }, { withCredentials: true })
    .subscribe({
      next: () => {
        this.unapprovedTracks = this.unapprovedTracks.filter(t => t._id !== track._id);
      },
      error: err => {
        alert('Hiba történt a törléskor!');
        console.error(err);
      }
    });
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/app/unapproved-tracks', { withCredentials: true })
      .subscribe({
        next: tracks => this.unapprovedTracks = tracks,
        error: err => console.error(err)
      });
  }
}
