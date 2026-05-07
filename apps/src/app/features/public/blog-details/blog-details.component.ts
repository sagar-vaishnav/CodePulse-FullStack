import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPostService } from '../../blog-post/services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../../blog-post/models/blog-post.model';

@Component({
    selector: 'app-blog-details',
    templateUrl: './blog-details.component.html',
    styleUrls: ['./blog-details.component.css'],
    standalone: false
})
export class BlogDetailsComponent implements OnInit {
  url: string | null = null;
  blogPost$?: Observable<BlogPost>;
  showScrollTop = false;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.url = params.get('url');
    });

    // Fetch blog details by url
    if (this.url) {
      this.blogPost$ = this.fetchBlogDetails();
    }
  }

  private fetchBlogDetails(): Observable<BlogPost> {
    return this.blogPostService.getBlogPostByUrlHandle(this.url!);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    console.log(event);
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
