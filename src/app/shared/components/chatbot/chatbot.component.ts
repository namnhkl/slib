import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ChatbotComponent {
  apiUrl = environment.API_URL;
  voiceApi = environment.VOICE_CHAT_API_URL;
  collection = environment.COLLECTION_NAME;
  chatApiBase = environment.CHAT_API_BASE;
  modelName = environment.MODEL_NAME;
  UrlChatbotPage = environment.IFRAME_URL_CHATBOT;
  isChatOpen = false;
  iframeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {
    const appSession = localStorage.getItem('appSession');

    if (appSession) {
      try {
        const parsedSession = JSON.parse(appSession);
        const userId = parsedSession.id;

        const params = new URLSearchParams({
          USER_ID: userId,
          API_URL: this.apiUrl,
          VOICE_CHAT_API_URL: this.voiceApi,
          CHAT_API_BASE: this.chatApiBase,
          COLLECTION_NAME: this.collection,
          MODEL_NAME: this.modelName
        });

        const rawUrl = `${this.UrlChatbotPage}${params.toString()}`;
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
      } catch (e) {
        console.error('Lỗi phân tích appSession:', e);
      }
    } else {
      console.warn('Không tìm thấy appSession trong localStorage');
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
}
