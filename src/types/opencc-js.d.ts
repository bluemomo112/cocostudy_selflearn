declare module 'opencc-js' {
  export interface Converter {
    (text: string): string;
  }
  
  export function Converter(options: { from: string; to: string }): Converter;
}
