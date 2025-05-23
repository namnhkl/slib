import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ChatbotComponent {
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
          API_URL: 'https://chat.slib.vn/api/chat',
          VOICE_CHAT_API_URL: 'https://chat.slib.vn/api/voice-chat-to-text',
          CHAT_API_BASE: 'https://chat.slib.vn/api',
          COLLECTION_NAME: 'SLIB',
          MODEL_NAME: 'gemini-2.0-flash'
        });

        const rawUrl = `https://chat.slib.vn/Chatbot.aspx?${params.toString()}`;
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
