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
  IFRAME_URL_CHATBOT: 'https://chat.slib.vn/Chatbot/Chatbot.aspx',
  ALLOWED_DANG_TAI_LIEU: ['GT','SH'],
  ID_TIN_VIDEO_DEFAULT: '0414c195-1814-40bc-9e0f-8179f0a836e4',
  ITEM_PER_PAGE_OPTION: [5,10,20,50,100],
  PAGE_SIZE: 10,
  MA_THU_VIEN: 'SLIB'
};
