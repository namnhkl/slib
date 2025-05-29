import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
  },
  production: false,
  authServer: 'https://api.demo.slib.vn:6787/api/thuvien',
  isActiveChatbot: false,
  API_URL: 'https://chat.slib.vn/api/chat',
  VOICE_CHAT_API_URL: 'https://chat.slib.vn/api/voice-chat-to-text',
  CHAT_API_BASE: 'https://chat.slib.vn/api',
  COLLECTION_NAME: 'SLIB',
  MODEL_NAME: 'gemini-2.0-flash',
  IFRAME_URL_CHATBOT: 'https://chat.slib.vn/Chatbot/Chatbot.aspx?',
};