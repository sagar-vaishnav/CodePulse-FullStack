import { CategoryService } from './../services/category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AddCategoryRequest } from '../models/add-category-request-model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    urlHandle: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-z0-9-]+$/),
      ],
    ],
  });

  private addCategorySubscription?: Subscription;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private fb: NonNullableFormBuilder,
  ) {}

  ngOnInit(): void {}

  isFieldInvalid(field: keyof typeof this.categoryForm.controls): boolean {
    const control = this.categoryForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  resetForm(): void {
    this.categoryForm.reset();
  }

  onFormSubmit(): void {
    if (this.categoryForm.valid) {
      const model: AddCategoryRequest = this.categoryForm.getRawValue();
      console.log('Submitting category:', model);

      this.addCategorySubscription = this.categoryService
        .addCategory(model)
        .subscribe({
          next: (response) => {
            console.log('Category added successfully', response);
            this.router.navigateByUrl('/admin/categories');
          },
          error: (error) => {
            console.error('Error adding category', error);
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.addCategorySubscription?.unsubscribe();
  }
}
