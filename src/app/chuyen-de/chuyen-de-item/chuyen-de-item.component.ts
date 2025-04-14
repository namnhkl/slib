// src/app/chuyen-de/chuyen-de-item/chuyen-de-item.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IChuyenDe } from '../chuyen-de.type';

@Component({
  selector: 'app-chuyen-de-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './chuyen-de-item.component.html',
  styleUrls: ['./chuyen-de-item.component.scss']
})
export class ChuyenDeItemComponent {
  @Input() chuyenDe!: IChuyenDe;

  getImageUrl(): string {
    return this.chuyenDe.anhDaiDien || 'https://via.placeholder.com/250x167?text=No+Image';
  }
}