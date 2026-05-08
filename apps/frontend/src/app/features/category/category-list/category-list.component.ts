import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
})
export class CategoryListComponent implements OnInit {
  visiblePages: number[] = [];
  totalPages = 0;
  categories$?: Observable<Category[]>;
  searchQuery: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  sortBy?: string;
  sortDirection?: string;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategoryCount(this.searchQuery).subscribe({
      next: (value) => {
        this.totalPages = Math.ceil(value / this.pageSize);
        this.updateVisiblePages();
        this.getCategoryList();
      },
    });
    this.getCategoryList();
  }
  onSearch(query: string): void {
    this.searchQuery = query.trim();
    this.pageNumber = 1;
    this.getCategoryList();

    this.categoryService.getCategoryCount(this.searchQuery).subscribe({
      next: (count) => {
        this.totalPages = Math.ceil(count / this.pageSize);
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Error fetching category count:', error);
      },
    });
  }

  getCategoryList(): void {
    this.categories$ = this.categoryService.getAllCategories(
      this.searchQuery,
      this.sortBy,
      this.sortDirection,
      this.pageNumber,
      this.pageSize,
    );
  }

  updateVisiblePages(): void {
    const pagesToShow = 5;

    let startPage = Math.max(this.pageNumber - Math.floor(pagesToShow / 2), 1);

    let endPage = startPage + pagesToShow - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(endPage - pagesToShow + 1, 1);
    }

    this.visiblePages = [];

    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }
  }

  sort(sortBy: string, sortDirection: string): void {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
    this.getCategoryList();
    this.categoryService.getCategoryCount(this.searchQuery).subscribe({
      next: (count) => {
        this.totalPages = Math.ceil(count / this.pageSize);
        this.updateVisiblePages();
      },
      error: (error) => {
        console.error('Error fetching category count:', error);
      },
    });
  }
  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.updateVisiblePages();
    this.getCategoryList();
  }

  getPreviousPage(): void {
    if (this.pageNumber === 1) return;
    this.pageNumber--;
    this.updateVisiblePages();
    this.getCategoryList();
  }

  getNextPage(): void {
    if (this.pageNumber === this.totalPages) return;
    this.pageNumber++;
    this.updateVisiblePages();
    this.getCategoryList();
  }
}
