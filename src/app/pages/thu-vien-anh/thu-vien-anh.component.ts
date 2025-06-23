
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { TienIchKhacService } from '@/app/shared/services/tienichkhac';
import { SharedService } from '@/app/shared/services/shared.service';
import { environment } from 'environments/environment';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF } from "ngx-image-gallery";
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-thu-vien-anh',
  templateUrl: './thu-vien-anh.component.html',
  styleUrls: ['./thu-vien-anh.component.scss'],
  imports:[CommonModule,NzSpinModule,NzPaginationModule,NgxImageGalleryComponent,TranslateModule]
})
export class ThuVienAnhComponent implements OnInit {
  @ViewChild(NgxImageGalleryComponent) ngxImageGallery!: NgxImageGalleryComponent;

  // gallery configuration
conf: GALLERY_CONF = {
  imageOffset: '0px',               // khoảng cách từ ảnh đến khung
  imagePointer: true,                // con trỏ chuột dạng pointer khi hover ảnh
  imageBorderRadius: '4px',          // bo góc ảnh

  showDeleteControl: false,          // không cần nút xóa ảnh
  showCloseControl: false,           // không cần nút đóng (do là inline)
  showExtUrlControl: false,          // không cần nút mở external link
  showArrows: true,                  // hiển thị nút điều hướng trái/phải
  showImageTitle: true,              // hiển thị tiêu đề ảnh
  showThumbnails: true,              // hiển thị ảnh nhỏ dưới

  closeOnEsc: false,                 // không cần vì không phải modal
  reactToKeyboard: true,             // điều hướng bằng phím trái/phải
  reactToMouseWheel: true,           // điều hướng bằng cuộn chuột
  reactToRightClick: false,          // không mở menu chuột phải

  thumbnailSize: 50,                 // kích thước thumbnail (px)
  backdropColor: 'transparent',      // không có nền tối (inline)

  inline: true                       // ❗ bật chế độ inline (hiển thị trong layout)
};


   // gallery images
  images: GALLERY_IMAGE[] = [
    {
      url: "https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=1260", 
      altText: 'woman-in-black-blazer-holding-blue-cup', 
      title: 'woman-in-black-blazer-holding-blue-cup',
      thumbnailUrl: "https://images.pexels.com/photos/669013/pexels-photo-669013.jpeg?w=60"
    },
    {
      url: "https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=1260", 
      altText: 'two-woman-standing-on-the-ground-and-staring-at-the-mountain', 
      extUrl: 'https://www.pexels.com/photo/two-woman-standing-on-the-ground-and-staring-at-the-mountain-669006/',
      thumbnailUrl: "https://images.pexels.com/photos/669006/pexels-photo-669006.jpeg?w=60"
    },
  ];

  albums: any[] = [];
  selectedAlbumId: string | null = null;
  selectedAlbumName: string | null = null;

  currentPage = 0;
  pageSize = 5;
  totalCount = 0;

  constructor(
    private danhMucAnhService: TienIchKhacService,
    private sharedService: SharedService,
    private http: HttpClient,
  private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }



loadAlbums(pageIndex = 0): void {
  this.danhMucAnhService.getDanhMucAnh({
    qtndHtNgonNguId: 1,
    bsThuVienId: this.sharedService.thuVienId,
    pageIndex: pageIndex,
    pageSize: this.pageSize
  }).subscribe((res: any) => {
    console.log('Albums pageIndex:', pageIndex, 'pageSize:', this.pageSize);
    console.log('Album result:', res);

    this.albums = res.data || [];

    // ✅ CHỖ NÀY: totalRecord chứ không phải totalCount
    this.totalCount = res.totalRecord || this.albums.length;

    if (this.albums.length > 0) {
      this.onAlbumSelect(this.albums[0]);
    }
  });
}




  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  onAlbumSelect(album: any): void {
    this.selectedAlbumId = album.id;
    this.selectedAlbumName = album.ten;
    this.danhMucAnhService.getAnhChiTiet({
      qtndHtNgonNguId: 1,
      bsThuVienId: this.sharedService.thuVienId,
      id: album.id
    }).subscribe((res: any) => {
      const images = res.data?.qtndGtThuVienAnhChiTiet || [];
        console.log('Selected album images:', images);
        console.log('res Gallery items:', res);
      this.images = images.map((img: any) => ({
  url: img.tepTinDuongDan,
  thumbnailUrl: img.tepTinDuongDan,
  altText: img.ten || '',       // tuỳ biến nếu có tên
  title: img.ten || ''          // tuỳ biến nếu có tên
}));
// Phải dùng setTimeout để đảm bảo ViewChild đã available
// setTimeout(() => this.openGallery(0), 0);
      console.log('Gallery items:', this.images);
    });
  }

onPageIndexChange(newPage: number): void {
  this.currentPage = newPage - 1; // ✅ chuyển từ 1-based UI -> 0-based API
  this.loadAlbums(this.currentPage);
}

// METHODS
  // open gallery
openGallery(index: number = 0): void {
  if (this.ngxImageGallery) {
    this.ngxImageGallery.open(index);
  }
}

    
  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }
    
  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }
    
  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }
    
  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }
    
  /**************************************************/
    
  // EVENTS
  // callback on gallery opened
  galleryOpened(index: number) {
    console.info('Gallery opened at index ', index);
  }
 
  // callback on gallery closed
  galleryClosed() {
    console.info('Gallery closed.');
  }
 

  
  // callback on gallery image changed
  galleryImageChanged(index: number) {
    console.info('Gallery image changed to index ', index);
  }
 
  // callback on user clicked delete button
  deleteImage(index: number) {
    console.info('Delete image at index ', index);
  }
galleryImageClicked(index: number) {
  // ❗ Mở modal tại ảnh vừa click
  this.ngxImageGallery.open(index);
}
}
