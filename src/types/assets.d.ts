// src/types/assets.d.ts
interface AssetMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
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
