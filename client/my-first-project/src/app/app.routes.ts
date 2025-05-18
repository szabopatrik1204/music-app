import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'signup', loadComponent: () => import('./signup/signup.component').then((c) => c.SignupComponent) },
    { path: 'login', loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent) },
    { path: 'user-management', loadComponent: () => import('./user-management/user-management.component').then((c) => c.UserManagementComponent), canActivate: [authGuard] },
    { path: 'music-upload', loadComponent: () => import('./music-upload/music-upload.component').then((c) => c.MusicUploadComponent), canActivate: [authGuard] },
    { path: 'album-create', loadComponent: () => import('./album-create/album-create.component').then((c) => c.AlbumCreateComponent), canActivate: [authGuard] },
    { path: 'music-browser', loadComponent: () => import('./music-browser/music-browser.component').then(c => c.MusicBrowserComponent), canActivate: [authGuard] },
    { path: 'music-management', loadComponent: () => import('./music-management/music-management.component').then(c => c.MusicManagementComponent), canActivate: [authGuard] },
    { path: 'artist-profile', loadComponent: () => import('./artist-profile/artist-profile.component').then(c => c.ArtistProfileComponent), canActivate: [authGuard] },
    { path: 'artist-statistics', loadComponent: () => import('./artist-statistics/artist-statistics.component').then(c => c.ArtistStatisticsComponent), canActivate: [authGuard] },
    { path: '**', redirectTo: 'login' }
];
