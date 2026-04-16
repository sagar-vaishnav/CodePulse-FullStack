import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Observable, Subscription } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css'],
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routesSubscription?: Subscription;
  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id = id;
      // Use the id to fetch the blog post details and populate the form for editing
      if (this.id) {
        this.blogPostService.getBlogPostById(this.id).subscribe((blogPost) => {
          // Populate the form with the blog post details for editing
          this.model = blogPost;
          this.selectedCategories = blogPost.categories.map((c) => c.id);
        });
      }
    });
  }

  onFormSubmit(): void {
    console.log(this.model);

    if (this.model && this.id) {
      const editBlogPost = {
        ...this.model,
        categories:
          this.selectedCategories?.map((c) =>
            typeof c === 'string' ? c : c,
          ) || [],
      };
      this.blogPostService.updateBlogPost(this.id, editBlogPost).subscribe({
        next: (response) => {
          console.log('Blogpost updated successfully', response);
          this.router.navigateByUrl('/admin/blogpost');
        },
        error: (error) => {
          console.error('Error updating blogpost', error);
        },
      });
    }
  }

  onDelete(): void {
    if (this.id) {
      this.blogPostService.deleteBlogPost(this.id).subscribe({ 
        next: () => {
          console.log('Blogpost deleted successfully');
          this.router.navigateByUrl('/admin/blogpost');
        },
        error: (error) => {
          console.error('Error deleting blogpost', error);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.routesSubscription?.unsubscribe();
  }
}
