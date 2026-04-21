import { Injectable } from '@angular/core';
import { AddBlogpost } from '../models/add-blogpost.model';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  constructor(private http: HttpClient) {}

  createBlogPost(data: AddBlogpost): Observable<BlogPost> {
    return this.http.post<BlogPost>(
      `${environment.apiBaseUrl}/api/blogposts`,
      data,
    );
  }
  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/api/blogposts`);
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogposts/${id}`,
    );
  }

  getBlogPostByUrlHandle(urlHandle: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(
      `${environment.apiBaseUrl}/api/blogposts/${urlHandle}`,
    );
  }

  updateBlogPost(id: string, data: AddBlogpost): Observable<BlogPost> {
    return this.http.put<BlogPost>(
      `${environment.apiBaseUrl}/api/blogposts/${id}`,
      data,
    );
  }

  deleteBlogPost(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/api/blogposts/${id}`,
    );
  }
}
