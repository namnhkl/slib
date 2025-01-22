import { Component } from '@angular/core';

import { DocumentService } from '../../shared/services';
import { SharedModule } from '../../shared/shared.module';

@Component({
	selector: 'app-home',
	imports: [SharedModule],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	providers: [DocumentService],
})
export class HomeComponent {
	documentList: any[] = [];
	constructor(private documentSv: DocumentService) {}
	ngOnInit() {
		this.documentSv.getAllDocuments({
      pageIndex: 1,
      pageSize: 10,
      tieuDe: '',
      tacGia: '',
    }).subscribe(res => {
			console.log(res);
			this.documentList = res.data;
		});
	}
}
