import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-artist-statistics',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, MatTableModule],
  templateUrl: './artist-statistics.component.html',
  styleUrl: './artist-statistics.component.scss'
})
export class ArtistStatisticsComponent implements OnInit {
  data: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/app/statistics', { withCredentials: true })
      .subscribe(res => {
        console.log(res);
        this.data = res.flatMap(albumObj =>
          albumObj.trackReviews.map((tr: any) => ({
            albumName: albumObj.album.name,
            trackTitle: tr.track.title,
            comments: tr.review.comment.map((c: any) => ({
              nickname: c.nickname,
              text: c.text,
              createdAt: c.createdAt
            })),
            likes: tr.review.like,
            shared: tr.review.shared
          }))
        );
      });
  }

}