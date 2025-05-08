export {};

declare global {
  interface FlipbookSettingsType {
    options: {
      pageWidth: number;
      pageHeight: number;
      pages: number;
    };
    shareMessage: string;
    pageFolder: string;
    loadRegions: boolean;
  }

  interface Window {
    FlipbookSettings: FlipbookSettingsType;
  }

  interface Window {
    jQuery: any;
  }
}
