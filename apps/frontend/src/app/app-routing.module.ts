import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/home/home.component').then(
        (c) => c.HomeComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (c) => c.LoginComponent,
      ),
  },
  {
    path: 'blog/:url',
    loadComponent: () =>
      import('./features/public/blog-details/blog-details.component').then(
        (c) => c.BlogDetailsComponent,
      ),
  },
  {
    path: 'admin/categories',
    loadComponent: () =>
      import('./features/category/category-list/category-list.component').then(
        (c) => c.CategoryListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/add',
    loadComponent: () =>
      import('./features/category/add-category/add-category.component').then(
        (c) => c.AddCategoryComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/categories/:id',
    loadComponent: () =>
      import('./features/category/edit-category/edit-category.component').then(
        (c) => c.EditCategoryComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogpost',
    loadComponent: () =>
      import('./features/blog-post/blogpost-list/blogpost-list.component').then(
        (c) => c.BlogpostListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogpost/add',
    loadComponent: () =>
      import('./features/blog-post/add-blogpost/add-blogpost.component').then(
        (c) => c.AddBlogpostComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/blogpost/edit/:id',
    loadComponent: () =>
      import('./features/blog-post/edit-blogpost/edit-blogpost.component').then(
        (c) => c.EditBlogpostComponent,
      ),
    canActivate: [authGuard],
  },
];

export { routes };
