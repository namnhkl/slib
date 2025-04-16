// src/app/chuyen-de/chuyen-de.type.ts
import { IResponse } from '@/app/shared/types/common';


export interface IChuyenDe {
  id: string;
  stsBoSuuTapId: string;
  anhDaiDien?: string;
  ten: string;
  moTa?: string | null;
  noiDung: string;
  sapXep: number;
  cap: string;
  capSo: number;
  slTaiLieu: number;
}

export interface IChuyenDeResponse extends IResponse<IChuyenDe[]> {}