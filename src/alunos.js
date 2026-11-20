// Operações CRUD e consultas na coleção "alunos" do Cloud Firestore.

import { colecaoAlunos } from './firebase.js';
import { normalizarDadosAluno, validarDataNascimento, validarTexto } from './validacao.js';

// Converte um snapshot em lista de objetos, ordenando pelo nome no próprio Node.
// Assim as consultas não dependem de índices compostos do Firestore.
function paraLista(snapshot) {
  return snapshot.docs
    .map((documento) => ({ id: documento.id, ...documento.data() }))
    .sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'));
}

// CREATE — adiciona um aluno com ID gerado automaticamente pelo Firestore.
export async function criarAluno(dados) {
  const aluno = normalizarDadosAluno(dados);
  const referencia = await colecaoAlunos.add(aluno);
  return referencia.id;
}

// READ — todos os alunos.
export async function listarAlunos() {
  return paraLista(await colecaoAlunos.get());
}

// READ — um aluno específico pelo ID do documento.
export async function buscarAluno(id) {
  const documento = await colecaoAlunos.doc(validarTexto(id, 'o ID')).get();
  return documento.exists ? { id: documento.id, ...documento.data() } : null;
}

// UPDATE — atualiza somente os campos enviados.
export async function atualizarAluno(id, alteracoes) {
  const aluno = await buscarAluno(id);

  if (!aluno) {
    throw new Error(`Não existe aluno com o ID "${id}".`);
  }

  const mudancas = normalizarDadosAluno(alteracoes, true);

  if (Object.keys(mudancas).length === 0) {
    throw new Error('Nenhum campo foi alterado.');
  }

  await colecaoAlunos.doc(aluno.id).update(mudancas);
  return { ...aluno, ...mudancas };
}

// DELETE — exclui um aluno pelo ID.
export async function excluirAluno(id) {
  const aluno = await buscarAluno(id);

  if (!aluno) {
    throw new Error(`Não existe aluno com o ID "${id}".`);
  }

  await colecaoAlunos.doc(aluno.id).delete();
  return aluno;
}

// CONSULTA — alunos de uma turma (igualdade).
export async function consultarPorTurma(turma) {
  const nomeTurma = validarTexto(turma, 'a turma');
  const snapshot = await colecaoAlunos.where('turma', '==', nomeTurma).get();
  return paraLista(snapshot);
}

// CONSULTA — alunos nascidos em uma data exata.
export async function consultarPorData(data) {
  const dataNascimento = validarDataNascimento(data);
  const snapshot = await colecaoAlunos.where('dataNascimento', '==', dataNascimento).get();
  return paraLista(snapshot);
}

// CONSULTA — alunos nascidos entre duas datas (intervalo fechado).
export async function consultarPorPeriodo(inicio, fim) {
  const dataInicial = validarDataNascimento(inicio);
  const dataFinal = validarDataNascimento(fim);

  if (dataInicial > dataFinal) {
    throw new Error('A data inicial não pode ser maior que a final.');
  }

  const snapshot = await colecaoAlunos
    .where('dataNascimento', '>=', dataInicial)
    .where('dataNascimento', '<=', dataFinal)
    .get();

  return paraLista(snapshot);
}
