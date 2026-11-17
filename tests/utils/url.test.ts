import { describe, expect, it } from 'vitest';
import { BASE_URL, buildUrl, getTarget, isExternalUrl } from '@utils/url';

describe('isExternalUrl', () => {
  it('considera externas las URLs de otros dominios', () => {
    expect(isExternalUrl('https://example.com/pagina')).toBe(true);
    expect(isExternalUrl('//example.com/pagina')).toBe(true);
  });

  it('considera externos mailto y tel', () => {
    expect(isExternalUrl('mailto:hola@example.com')).toBe(true);
    expect(isExternalUrl('tel:+5491100000000')).toBe(true);
  });

  it('considera internas las rutas relativas y las vacías', () => {
    expect(isExternalUrl('/cuentas/')).toBe(false);
    expect(isExternalUrl('cuentas')).toBe(false);
    expect(isExternalUrl('')).toBe(false);
  });
});

describe('buildUrl', () => {
  it('antepone el base y agrega la barra final a las páginas', () => {
    expect(buildUrl('cuentas')).toBe(`${BASE_URL}cuentas/`);
    expect(buildUrl('/cuentas')).toBe(`${BASE_URL}cuentas/`);
    expect(buildUrl('cuentas/detalle')).toBe(`${BASE_URL}cuentas/detalle/`);
  });

  it('no duplica la barra final', () => {
    expect(buildUrl('/cuentas/')).toBe(`${BASE_URL}cuentas/`);
  });

  it('no agrega barra final a los archivos', () => {
    expect(buildUrl('favicon.ico')).toBe(`${BASE_URL}favicon.ico`);
  });

  it('conserva query y hash', () => {
    expect(buildUrl('cuentas?orden=asc#tabla')).toBe(
      `${BASE_URL}cuentas/?orden=asc#tabla`,
    );
  });

  it('devuelve sin cambios los anclajes y las URLs externas', () => {
    expect(buildUrl('#resumen')).toBe('#resumen');
    expect(buildUrl('https://example.com/a')).toBe('https://example.com/a');
  });
});

describe('getTarget', () => {
  it('abre en otra pestaña solo las URLs externas', () => {
    expect(getTarget('https://example.com')).toBe('_blank');
    expect(getTarget('/cuentas/')).toBe('_self');
  });

  it('abre mailto y tel en la misma pestaña', () => {
    expect(getTarget('mailto:hola@example.com')).toBe('_self');
  });

  it('respeta el target indicado', () => {
    expect(getTarget('/cuentas/', '_blank')).toBe('_blank');
  });
});
