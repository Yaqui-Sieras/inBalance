// @pages/api/cargar-demo.ts
import type { APIRoute } from 'astro';
import { cargarDatosDePrueba } from '@lib/inicializadorTest';

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    await cargarDatosDePrueba();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Datos cargados correctamente',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
