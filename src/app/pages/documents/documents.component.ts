import { Component, OnInit } from '@angular/core';
import { HomeSearchAdvancedComponent } from '../home/HomeSearchAdvanced/HomeSearchAdvanced.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  imports: [HomeSearchAdvancedComponent],
})
export class DocumentsComponent implements OnInit {
  constructor() {
    console.log('DocumentsComponent');
  }

  ngOnInit() {
    console.log('DocumentsComponent');
  }
}
