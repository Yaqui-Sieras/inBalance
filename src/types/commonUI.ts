// @types-local/commonUI.ts
import type { Properties, Property } from 'csstype';

export interface StyleProps extends Properties {
  // Relacionado con el texto
  fontFamily?: Property.FontFamily;
  fontWeight?: Property.FontWeight;
  fontsize?: Property.FontSize<string | number>;
  letterSpacing?: Property.LetterSpacing;
  color?: Property.Color;
  textDecoration?: Property.TextDecoration;
  // Relacionado con la caja
  position?: Property.Position;
  top?: Property.Top;
  bottom?: Property.Bottom;
  left?: Property.Left;
  right?: Property.Right;
  width?: Property.Width;
  maxWidth?: Property.MaxWidth;
  height?: Property.Height;
  minHeight?: Property.MinHeight;
  background?: Property.Background;
  padding?: Property.Padding;
  border?: Property.Border;
  bordertop?: Property.BorderTop;
  borderLeft?: Property.BorderLeft;
  borderRight?: Property.BorderRight;
  borderBottom?: Property.BorderBottom;
  borderRadius?: Property.BorderRadius;
  overflow?: Property.Overflow;
  boxShadow?: Property.BoxShadow;
  margin?: Property.Margin;
  display?: Property.Display;
  flexDirection?: Property.FlexDirection;
  columns?: Property.GridTemplateColumns;
  rows?: Property.GridTemplateRows;
  align?: Property.AlignItems;
  justify?: Property.JustifyContent;
  gap?: Property.Gap;
  rowGap?: Property.RowGap;
  columnGap?: Property.ColumnGap;
}
