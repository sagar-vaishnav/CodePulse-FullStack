import { Component, OnInit } from '@angular/core';
import { AddBlogpost } from '../models/add-blogpost.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../category/models/category.model';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css'],
})
export class AddBlogpostComponent implements OnInit {
  model: AddBlogpost;
  categories$?: Observable<Category[]>;
  constructor(
    private blogPostService: BlogPostService,
    private router: Router,
    private categoryService: CategoryService
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
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
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
}
