import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import en from '@/app/translations/en.json';
import vi from '@/app/translations/vi.json';

const languageKey = 'language';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  defaultLanguage!: string;
  supportedLanguages!: string[];

  private _langChangeSubscription!: Subscription;
  private readonly _languageSubject: BehaviorSubject<string>;

  constructor(private readonly _translateService: TranslateService) {
    // Initialize the BehaviorSubject with an initial value
    this._languageSubject = new BehaviorSubject<string>(
      localStorage.getItem(languageKey) ||
        this._translateService.getBrowserCultureLang() ||
        ''
    );

    _translateService.setTranslation('vi-VN', vi);
    _translateService.setTranslation('en-US', en);
  }

  /**
   * Returns the current language as an observable.
   * @return Observable of the current language.
   */
  get languageObservable(): Observable<string> {
    return this._languageSubject.asObservable();
  }

  /**
   * Gets the current language.
   * @return The current language code.
   */
  get language(): string {
    return this._translateService.currentLang;
  }

  /**
   * Sets the current language.
   * Note: The current language is saved to the local storage.
   * If no parameter is specified, the language is loaded from local storage (if present).
   * @param language The IETF language code to set.
   */
  set language(language: string) {
  let newLanguage =
    language ||
    localStorage.getItem(languageKey) ||
    this.defaultLanguage ||  //Ưu tiên fallback về defaultLanguage
    this._translateService.getBrowserCultureLang() ||
    '';

  let isSupportedLanguage = this.supportedLanguages.includes(newLanguage);

  // Nếu không khớp hoàn toàn, thử so sánh không bao gồm region (e.g. vi thay vì vi-VN)
  if (newLanguage && !isSupportedLanguage) {
    const shortLang = newLanguage.split('-')[0];
    newLanguage = this.supportedLanguages.find((supportedLanguage) =>
      supportedLanguage.startsWith(shortLang)
    ) || '';
    isSupportedLanguage = Boolean(newLanguage);
  }

  // Nếu vẫn không hợp lệ => fallback defaultLanguage
  if (!newLanguage || !isSupportedLanguage) {
    newLanguage = this.defaultLanguage;
  }

  if (newLanguage !== this._languageSubject.value) {
    this._languageSubject.next(newLanguage);
  }

  localStorage.setItem(languageKey, newLanguage);

  this._translateService.use(newLanguage);
}

  /**
   * Initializes i18n for the application.
   * Loads language from local storage if present, or sets default language.
   * @param defaultLanguage The default language to use.
   * @param supportedLanguages The list of supported languages.
   */
  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';

    // Warning: this subscription will always be alive for the app's lifetime
    this._langChangeSubscription =
      this._translateService.onLangChange.subscribe(
        (event: LangChangeEvent) => {
          localStorage.setItem(languageKey, event.lang);
        }
      );
  }

  /**
   * Cleans up language change subscription.
   */
  destroy() {
    if (this._langChangeSubscription) {
      this._langChangeSubscription.unsubscribe();
    }
  }
}
