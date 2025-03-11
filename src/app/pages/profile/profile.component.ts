import { AuthService } from '@/app/shared/services/auth.service';
import { storage } from '@/app/utils';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile: any;
  constructor(private authService: AuthService, private router: Router) {
    
  }

  ngOnInit() {
    this.profile = storage.getItem('appSession');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
