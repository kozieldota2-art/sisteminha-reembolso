import { searchResponse } from '../../worker/backend.js';

export default async function handler(request, context) {
  if (request.method !== 'GET') return new Response('Método não permitido', { status: 405, headers: { Allow: 'GET' } });
  return searchResponse(request, context);
}

export const config = { path: '/api/search' };
