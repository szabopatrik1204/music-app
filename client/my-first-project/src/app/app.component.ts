import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AComponentComponent } from './a-component/a-component.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { MusicUploadComponent } from './music-upload/music-upload.component';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { MusicBrowserComponent } from './music-browser/music-browser.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    AComponentComponent,
    LoginComponent,
    SignupComponent,
    AppHeaderComponent,
    MusicUploadComponent,
    AlbumCreateComponent,
    MusicBrowserComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-first-project test';
}
