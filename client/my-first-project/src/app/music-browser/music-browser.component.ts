import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-music-browser',
  standalone: true,
  imports: [DatePipe, CommonModule, MatIconModule, MatButtonModule, FormsModule, MatCardModule],
  templateUrl: './music-browser.component.html',
  styleUrl: './music-browser.component.scss'
})
export class MusicBrowserComponent {

  tracks: any[] = [];
  myNickname: string = '';
  filteredTracks: any[] = [];
  searchText: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/app/get-all-tracks', { withCredentials: true })
      .subscribe(data => {
        this.tracks = data.map(track => ({
          ...track,
          newComment: ''
        }));
        this.filterTracks();
      });

    this.http.get<{nickname: string}>('http://localhost:5000/app/me', { withCredentials: true })
      .subscribe(user => this.myNickname = user.nickname);
  }

  filterTracks() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredTracks = this.tracks.filter(track =>
      track.title.toLowerCase().includes(search)
    );
  }

  likeTrack(track: any) {
    if (this.isLikedByMe(track)) return;
    this.http.post<any>('http://localhost:5000/app/add-like', {
      trackId: track._id
    }, { withCredentials: true }).subscribe({
      next: (review) => {
        track.review = review;
      },
      error: () => {
        alert('Hiba a like mentésekor!');
      }
    });
  }

  isLikedByMe(track: any): boolean {
    return track.review?.like?.includes(this.myNickname);
  }

  shareTrack(track: any) {
    alert('Megosztás: ' + track.title);
  }

  addComment(track: any) {
    if (track.newComment && track.newComment.trim()) {
      this.http.post<any>('http://localhost:5000/app/add-review', {
        trackId: track._id,
        commentText: track.newComment.trim()
      }, { withCredentials: true }).subscribe({
        next: (review) => {
          track.review = review;
          track.newComment = '';
        },
        error: (err) => {
          // Hibakezelés
          alert('Hiba a komment mentésekor!');
        }
      });
    }
  }
}
