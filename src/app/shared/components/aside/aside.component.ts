import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AsideService } from './aside.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-aside',
	standalone: true,
	imports: [RouterModule, CommonModule, TranslateModule],
	templateUrl: './aside.component.html',
	styleUrl: './aside.component.scss',
})
export class AsideComponent {
	public expanded = this.asideService.expanded;

	protected items = [
		{ type: 'route', routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
		{ type: 'route', routeLink: 'analyze', icon: 'fal fa-tasks', label: 'Analyze' },
		{ type: 'route', routeLink: 'compare', icon: 'fal fa-not-equal', label: 'Compare' },
		{ type: 'space' },
		{ type: 'separator' },
		{ type: 'route', routeLink: 'settings', icon: 'fal fa-cog', label: 'Settings' },
	];

	constructor(
		private asideService: AsideService,
		private translate: TranslateService,
	) {
		this.translate.setDefaultLang('en');
	}

	public toggleExpand() {
		this.asideService.toggleExpand();
	}

	switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
