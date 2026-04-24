import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/features/auth/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user?: User;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        console.log('Current User:', user);
        this.user = user;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });

    this.user = this.authService.getUser();
  }
}
