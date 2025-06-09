// src/app/chuyen-de/sort-by-cap.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { IChuyenDe } from './stsBoSuuTapDs-chuyen-de.type';

@Pipe({
  name: 'sortByCap',
  standalone: true
})
export class SortByCapPipe implements PipeTransform {
  transform(chuyenDeList: IChuyenDe[]): IChuyenDe[] {
    return [...chuyenDeList].sort((a, b) => a.cap.localeCompare(b.cap));
  }
}