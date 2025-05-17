import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-music-browser',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './music-browser.component.html',
  styleUrl: './music-browser.component.scss'
})
export class MusicBrowserComponent {

  tracks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/app/get-all-tracks')
      .subscribe(data => {
        this.tracks = data;
      });
  }

}
