import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class HomeComponent implements OnInit {
  blogs$?: Observable<BlogPost[]>;

  constructor(
    private blogpostService: BlogPostService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.blogs$ = this.blogpostService.getAllBlogPosts();
  }
}
