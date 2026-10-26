// @utils/css.ts
import type { StyleProps } from '@types-local/commonUI';

/**
 * Transforma un objeto de estilos (StyleProps) en un registro de variables CSS inline.
 * Convierte automáticamente claves en camelCase (ej: backgroundColor) a kebab-case (--prefix-background-color).
 */
export const getCssVariables = (prefix: string, obj: StyleProps = {}) => {
  if (!obj || typeof obj !== 'object') return {};

  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      // Si el valor es undefined o null, no creamos la variable
      if (value === undefined || value === null) return acc;

      // Convierte camelCase (backgroundColor) a kebab-case (background-color)
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      acc[`--${prefix}-${cssKey}`] = value;
      return acc;
    },
    {} as Record<string, any>,
  );
};
