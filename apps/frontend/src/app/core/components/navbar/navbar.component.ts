import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { User } from 'src/app/features/auth/models/user.model';
import { AuthService } from 'src/app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink],
})
export class NavbarComponent implements OnInit {
  user = signal<User | undefined>(undefined);
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.user.set(undefined);
    this.router.navigateByUrl('/login');
  }
  ngOnInit(): void {
    this.authService.user().subscribe({
      next: (user) => {
        console.log('Current User:', user);
        this.user.set(user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });

    this.user.set(this.authService.getUser());
  }
}
