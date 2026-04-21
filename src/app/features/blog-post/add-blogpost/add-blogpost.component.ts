import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogpost } from '../models/add-blogpost.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css'],
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogpost;
  categories$?: Observable<Category[]>;
  isImageSelectorVisible: boolean = false;
  imageSelectSubscription?: Subscription;
  constructor(
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService,
    private imageService: ImageService,
  ) {
    this.model = {
      title: '',
      shortDescription: '',
      content: '',
      featuredImageUrl: '',
      urlHandle: '',
      author: '',
      publishedDate: new Date(),
      isVisible: true,
      categories: [],
    };
  }

  openImageSelector(): void {
    console.log('Open image selector');
    this.isImageSelectorVisible = true;
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.imageSelectSubscription = this.imageService
      .onSelectImage()
      .subscribe((image) => {
        this.model.featuredImageUrl = image.url;
        this.isImageSelectorVisible = false;
      });
  }

  onFormSubmit(): void {
    console.log(this.model);

    this.blogPostService.createBlogPost(this.model).subscribe({
      next: (response) => {
        console.log('Blogpost created successfully', response);
        this.router.navigateByUrl('/admin/blogpost');
      },
      error: (error) => {
        console.error('Error creating blogpost', error);
      },
    });
  }

  ngOnDestroy(): void {
    this.imageSelectSubscription?.unsubscribe();
  }
}
