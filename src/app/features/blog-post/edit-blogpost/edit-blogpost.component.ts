import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPostService } from '../services/blog-post.service';
import { Observable, Subscription } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category.service';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
    selector: 'app-edit-blogpost',
    templateUrl: './edit-blogpost.component.html',
    styleUrls: ['./edit-blogpost.component.css'],
    standalone: false
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  id: string | null = null;
  routesSubscription?: Subscription;
  getBlogPostSubscription?: Subscription;
  updateBlogPostSubscription?: Subscription;
  deleteBlogPostSubscription?: Subscription;
  imageSelectSubscription?: Subscription;

  model?: BlogPost;
  categories$?: Observable<Category[]>;
  selectedCategories: string[] = [];
  isImageSelectorVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private blogPostService: BlogPostService,
    private categoryService: CategoryService,
    private router: Router,
    private imageService: ImageService,
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.routesSubscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.id = id;
      // Use the id to fetch the blog post details and populate the form for editing
      if (this.id) {
        this.getBlogPostSubscription = this.blogPostService
          .getBlogPostById(this.id)
          .subscribe((blogPost) => {
            // Populate the form with the blog post details for editing
            this.model = blogPost;
            this.selectedCategories = blogPost.categories.map((c) => c.id);
          });
      }

      this.imageSelectSubscription = this.imageService
        .onSelectImage()
        .subscribe((image) => {
          if (this.model) {
            this.model.featuredImageUrl = image.url;
            this.isImageSelectorVisible = false;
          }
        });
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
      this.updateBlogPostSubscription = this.blogPostService
        .updateBlogPost(this.id, editBlogPost)
        .subscribe({
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
      this.deleteBlogPostSubscription = this.blogPostService
        .deleteBlogPost(this.id)
        .subscribe({
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

  openImageSelector(): void {
    console.log('Open image selector');
    this.isImageSelectorVisible = true;
  }

  ngOnDestroy(): void {
    this.routesSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscription?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }
}
