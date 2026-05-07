import { Component, OnInit } from '@angular/core';
import { ImageService } from './image.service';
import { BlogImage } from '../../models/blog-image.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-image-selector',
    templateUrl: './image-selector.component.html',
    styleUrls: ['./image-selector.component.css'],
    standalone: false
})
export class ImageSelectorComponent implements OnInit {
  private file?: File;
  fileName: string = '';
  title: string = '';
  images$?: Observable<BlogImage[]>;

  constructor(private imageService: ImageService) {}
  ngOnInit(): void {
    this.getImages();
  }

  private getImages() {
    this.images$ = this.imageService.getAllImages();
  }

  onFileUploadChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      console.log('Selected file:', this.file);
      // You can add further processing of the file here, such as uploading it to a server or displaying a preview.
    }
  }

  uploadImage(): void {
    if (this.file && this.fileName !== '' && this.title !== '') {
      this.imageService
        .uploadImage(this.file, this.fileName, this.title)
        .subscribe({
          next: (blogImage) => {
            console.log('Image uploaded successfully:', blogImage);
            this.getImages(); // Refresh the list of images after a successful upload
          },
          error: (error) => {
            console.error('Error uploading image:', error);
          },
        });
    } else {
      console.log('Please fill in all required fields.');
    }
  }

  selectImage(image: BlogImage): void {
    this.imageService.selectImage(image);
  }
}
