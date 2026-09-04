// Netlify Function: extrair-reembolso.js
// Recebe: { fotoBase64, textoLivre, eventosConhecidos }
// Devolve: JSON estruturado pronto pra revisão antes de salvar no Firestore

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { fotoBase64, textoLivre, eventosConhecidos } = JSON.parse(event.body);

    if (!fotoBase64 && !textoLivre) {
      return { statusCode: 400, body: JSON.stringify({ erro: 'Manda pelo menos a foto ou o texto.' }) };
    }

    // Lista de eventos válidos (vinda do cache eventos_cache no Firestore)
    // Ajuda a IA a casar o nome que você falou com o nome oficial no eFormei
    const listaEventos = Array.isArray(eventosConhecidos) && eventosConhecidos.length
      ? eventosConhecidos.map(e => `- ${e.nome} (turma: ${e.turma || 'N/A'})`).join('\n')
      : '(nenhuma lista de eventos disponível ainda)';

    const promptSistema = `Você organiza comprovantes de reembolso pra lançamento em contas a pagar.
Receba a foto do comprovante (se houver) e um texto curto do usuário, e devolva APENAS um JSON, sem nenhum texto antes ou depois, no formato:

{
  "valor": number,
  "fornecedor": string,
  "descricao": string,
  "categoria": string,
  "data": "YYYY-MM-DD",
  "evento_sugerido": string | null,
  "confianca_evento": "alta" | "media" | "baixa" | "nenhuma",
  "observacao": string | null
}

Regras:
- "evento_sugerido" só deve ser preenchido com um nome que está EXATAMENTE na lista de eventos conhecidos abaixo. Se não tiver certeza ou não achar nada parecido, deixe null e confianca_evento "nenhuma".
- "categoria" deve ser um chute razoável (ex: alimentação, transporte, material, hospedagem) baseado no comprovante.
- Se algum dado não der pra extrair, use null nesse campo e explique em "observacao".
- Nunca invente valores — se não conseguir ler o valor com certeza, deixe null.

Eventos conhecidos (período de referência ~2 meses atrás a 2 meses à frente):
${listaEventos}`;

    const content = [];
    if (fotoBase64) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: fotoBase64 }
      });
    }
    content.push({
      type: 'text',
      text: textoLivre ? `Texto do usuário: "${textoLivre}"` : 'Sem texto adicional, use só a imagem.'
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: promptSistema,
        messages: [{ role: 'user', content }]
      })
    });

    const data = await response.json();
    const textoResposta = data?.content?.find(b => b.type === 'text')?.text || '{}';
    const limpo = textoResposta.replace(/```json|```/g, '').trim();

    let extraido;
    try {
      extraido = JSON.parse(limpo);
    } catch {
      return {
        statusCode: 200,
        body: JSON.stringify({ erro: 'IA não devolveu JSON válido', bruto: textoResposta })
      };
    }

    return { statusCode: 200, body: JSON.stringify(extraido) };

  } catch (err) {
    console.error('Erro extrair-reembolso:', err);
    return { statusCode: 500, body: JSON.stringify({ erro: err.message }) };
  }
};
