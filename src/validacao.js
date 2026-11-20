// Validações dos campos da coleção "alunos":
// nome (texto), turma (texto), dataNascimento (AAAA-MM-DD) e ativo (booleano).

export function validarTexto(valor, nomeCampo) {
  const texto = String(valor ?? '').trim();
  if (!texto) {
    throw new Error(`Informe ${nomeCampo}.`);
  }
  return texto;
}

export function validarDataNascimento(valor) {
  const data = String(valor ?? '').trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    throw new Error('Use o formato AAAA-MM-DD (exemplo: 2009-05-15).');
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const conferida = new Date(Date.UTC(ano, mes - 1, dia));
  const invalida = conferida.getUTCFullYear() !== ano
    || conferida.getUTCMonth() !== mes - 1
    || conferida.getUTCDate() !== dia;

  if (invalida) {
    throw new Error(`Data inexistente: ${data}.`);
  }

  return data;
}

export function validarAtivo(valor) {
  if (typeof valor === 'boolean') return valor;

  const texto = String(valor ?? '').trim().toLowerCase();

  if (['true', '1', 'sim', 's', 'ativo', 't'].includes(texto)) return true;
  if (['false', '0', 'nao', 'não', 'n', 'inativo', 'f'].includes(texto)) return false;

  throw new Error('Informe true/false (ou sim/não).');
}

// Normaliza os dados antes de gravar no Firestore.
// parcial = true é usado na atualização, quando alguns campos podem ficar de fora.
export function normalizarDadosAluno(dados, parcial = false) {
  const resultado = {};

  if (!parcial || Object.hasOwn(dados, 'nome')) {
    resultado.nome = validarTexto(dados.nome, 'o nome');
  }
  if (!parcial || Object.hasOwn(dados, 'turma')) {
    resultado.turma = validarTexto(dados.turma, 'a turma');
  }
  if (!parcial || Object.hasOwn(dados, 'dataNascimento')) {
    resultado.dataNascimento = validarDataNascimento(dados.dataNascimento);
  }
  if (!parcial || Object.hasOwn(dados, 'ativo')) {
    resultado.ativo = validarAtivo(dados.ativo);
  }

  return resultado;
}
