import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lightGallery from 'lightgallery';
import { TienIchKhacService } from '@/app/shared/services/tienichkhac';
import { SharedService } from '@/app/shared/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-thu-vien-anh',
  templateUrl: './thu-vien-anh.component.html',
  styleUrls: ['./thu-vien-anh.component.scss'],
  imports:[CommonModule,NzSpinModule,NzPaginationModule,TranslateModule],
  providers: [],
  standalone: true,
})
export class ThuVienAnhComponent implements OnInit, AfterViewInit {
  @ViewChild('lightgallery', { static: false }) galleryEl?: ElementRef;

  imageData: string[] = [];
  albums: any[] = [];
  selectedAlbumId: string | null = null;
  selectedAlbumName: string | null = null;
  currentPage = 0;
  pageSize = 3;
  totalCount = 0;

  constructor(
    private danhMucAnhService: TienIchKhacService,
    private sharedService: SharedService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadAlbums();
  }

  ngAfterViewInit(): void {
    this.initGallery();
  }

   galleryInstance: any;

initGallery(): void {
  const el = document.getElementById('lightgallery');
  if (el) {
    // ⚠️ Xoá instance cũ nếu có
    if (this.galleryInstance) {
      this.galleryInstance.destroy();
    }

    this.galleryInstance = lightGallery(el, {
      plugins: [lgThumbnail, lgZoom],
      speed: 500,
      download: false,
      thumbnail: true,
      zoom: true,
    });
  }
}

  loadAlbums(pageIndex = 0): void {
    this.danhMucAnhService.getDanhMucAnh({
      qtndHtNgonNguId: 1,
      bsThuVienId: this.sharedService.thuVienId,
      pageIndex: pageIndex,
      pageSize: this.pageSize
    }).subscribe((res: any) => {
      this.albums = res.data || [];
      this.totalCount = res.totalRecord || this.albums.length;
      if (this.albums.length > 0) {
        this.onAlbumSelect(this.albums[0]);
      }
    });
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

    this.imageData = images.map((img: any) => ({
      full: img.tepTinDuongDan,
      thumb: img.tepTinDuongDan,
      ten: img.ten || '',
      moTa: img.moTa || '',
      caption: `<h4>${img.ten || ''}</h4><p>${img.moTa || ''}</p>`
    }));

    // Delay re-initializing gallery to ensure DOM is updated
    setTimeout(() => this.initGallery(), 100);
  });
}


  onPageIndexChange(newPage: number): void {
    this.currentPage = newPage - 1;
    this.loadAlbums(this.currentPage);
  }
}
