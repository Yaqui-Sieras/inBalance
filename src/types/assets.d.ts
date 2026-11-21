// src/types/assets.d.ts
interface AssetMetadata {
  src: string;
  width: number;
  height: number;
  format:
    'jpeg' | 'jpg' | 'png' | 'apng' | 'tiff' | 'webp' | 'gif' | 'svg' | 'avif';
  orientation?: number;
}

declare module '*.png' {
  const value: AssetMetadata;
  export default value;
}

declare module '*.svg' {
  const value: AssetMetadata;
  export default value;
}

declare module '*.jpg' {
  const value: AssetMetadata;
  export default value;
}

declare module '*.jpeg' {
  const value: AssetMetadata;
  export default value;
}

declare module '*.webp' {
  const value: AssetMetadata;
  export default value;
}

declare module '*.avif' {
  const value: AssetMetadata;
  export default value;
}
