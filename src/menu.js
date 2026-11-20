// Menu interativo no terminal: criar, listar, buscar, atualizar, excluir e consultar.

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import * as alunos from './alunos.js';
import { validarAtivo, validarDataNascimento, validarTexto } from './validacao.js';

const rl = createInterface({ input, output });
const LINHA = '─'.repeat(68);

function cabecalho() {
  console.log(LINHA);
  console.log('  CRUD DE ALUNOS — FIREBASE CLOUD FIRESTORE');
  console.log('  Atividade prática: Banco de Dados NoSQL');
  console.log(LINHA);
}

function menu() {
  console.log(`
  1. CRIAR   — cadastrar aluno
  2. LER     — listar todos os alunos
  3. LER     — buscar aluno por ID
  4. ATUALIZAR — alterar dados de um aluno
  5. EXCLUIR — remover aluno
  6. CONSULTAR — alunos por turma
  7. CONSULTAR — alunos por data de nascimento
  8. CONSULTAR — alunos por período de nascimento
  0. Sair
`);
  console.log(LINHA);
}

async function perguntar(texto) {
  return (await rl.question(texto)).trim();
}

async function perguntarCampo(texto, validar) {
  let resposta = await perguntar(texto);

  while (true) {
    try {
      return validar(resposta);
    } catch (erro) {
      console.log(`  Aviso: ${erro.message}`);
      resposta = await perguntar(texto);
    }
  }
}

// Em branco = manter o valor atual (usado na atualização).
async function perguntarOpcional(texto, validar) {
  let resposta = await perguntar(texto);
  if (!resposta) return null;

  while (true) {
    try {
      return validar(resposta);
    } catch (erro) {
      console.log(`  Aviso: ${erro.message}`);
      resposta = await perguntar(texto);
      if (!resposta) return null;
    }
  }
}

async function confirmar(texto) {
  const resposta = (await perguntar(`${texto} (s/N): `)).toLowerCase();
  return ['s', 'sim'].includes(resposta);
}

function exibirAlunos(lista) {
  if (lista.length === 0) {
    console.log('\n  Nenhum aluno encontrado.');
    return;
  }

  console.log(`\n  ${lista.length} aluno(s) encontrado(s):\n`);

  for (const aluno of lista) {
    const ativo = aluno.ativo === true ? 'sim' : aluno.ativo === false ? 'não' : String(aluno.ativo ?? '-');
    console.log(`  ID........... ${aluno.id}`);
    console.log(`  Nome......... ${aluno.nome}`);
    console.log(`  Turma........ ${aluno.turma}`);
    console.log(`  Nascimento... ${aluno.dataNascimento}`);
    console.log(`  Ativo........ ${ativo}`);
    console.log(LINHA);
  }
}

async function selecionarId() {
  const lista = await alunos.listarAlunos();
  exibirAlunos(lista);

  if (lista.length === 0) return null;

  return perguntarCampo('\n  Digite o ID do aluno: ', (valor) => validarTexto(valor, 'o ID'));
}

async function opcaoCriar() {
  console.log('\n--- Cadastrar aluno ---');

  const nome = await perguntarCampo('Nome: ', (valor) => validarTexto(valor, 'o nome'));
  const turma = await perguntarCampo('Turma (ex.: 3DSB): ', (valor) => validarTexto(valor, 'a turma'));
  const dataNascimento = await perguntarCampo('Data de nascimento (AAAA-MM-DD): ', validarDataNascimento);
  const ativo = await perguntarCampo('Ativo? (true/false ou sim/não): ', validarAtivo);

  const id = await alunos.criarAluno({ nome, turma, dataNascimento, ativo });
  console.log(`\nAluno cadastrado! ID do documento: ${id}`);
}

async function opcaoListar() {
  console.log('\n--- Todos os alunos ---');
  exibirAlunos(await alunos.listarAlunos());
}

async function opcaoBuscar() {
  console.log('\n--- Buscar por ID ---');
  const id = await perguntarCampo('ID do documento: ', (valor) => validarTexto(valor, 'o ID'));
  const aluno = await alunos.buscarAluno(id);
  exibirAlunos(aluno ? [aluno] : []);
  if (!aluno) console.log(`  Não existe aluno com o ID "${id}".`);
}

async function opcaoAtualizar() {
  console.log('\n--- Atualizar aluno ---');

  const id = await selecionarId();
  if (!id) return;

  const atual = await alunos.buscarAluno(id);
  if (!atual) {
    console.log(`  Não existe aluno com o ID "${id}".`);
    return;
  }

  console.log('\nDeixe o campo em branco para manter o valor atual.');
  const nome = await perguntarOpcional(`Nome [${atual.nome}]: `, (valor) => validarTexto(valor, 'o nome'));
  const turma = await perguntarOpcional(`Turma [${atual.turma}]: `, (valor) => validarTexto(valor, 'a turma'));
  const dataNascimento = await perguntarOpcional(
    `Data de nascimento [${atual.dataNascimento}]: `,
    validarDataNascimento
  );
  const ativo = await perguntarOpcional(`Ativo? [${atual.ativo ? 'true' : 'false'}]: `, validarAtivo);

  const alteracoes = {};
  if (nome !== null) alteracoes.nome = nome;
  if (turma !== null) alteracoes.turma = turma;
  if (dataNascimento !== null) alteracoes.dataNascimento = dataNascimento;
  if (ativo !== null) alteracoes.ativo = ativo;

  const atualizado = await alunos.atualizarAluno(id, alteracoes);
  exibirAlunos([atualizado]);
  console.log('\nAluno atualizado!');
}

async function opcaoExcluir() {
  console.log('\n--- Excluir aluno ---');

  const id = await selecionarId();
  if (!id) return;

  const aluno = await alunos.buscarAluno(id);
  if (!aluno) {
    console.log(`  Não existe aluno com o ID "${id}".`);
    return;
  }

  if (!(await confirmar(`Excluir "${aluno.nome}"?`))) {
    console.log('Exclusão cancelada.');
    return;
  }

  await alunos.excluirAluno(id);
  console.log(`Aluno "${aluno.nome}" excluído.`);
}

async function opcaoPorTurma() {
  console.log('\n--- Alunos por turma ---');
  const turma = await perguntarCampo('Turma (ex.: 3DSB): ', (valor) => validarTexto(valor, 'a turma'));
  exibirAlunos(await alunos.consultarPorTurma(turma));
}

async function opcaoPorData() {
  console.log('\n--- Alunos por data de nascimento ---');
  const data = await perguntarCampo('Data (AAAA-MM-DD): ', validarDataNascimento);
  exibirAlunos(await alunos.consultarPorData(data));
}

async function opcaoPorPeriodo() {
  console.log('\n--- Alunos por período de nascimento ---');
  const inicio = await perguntarCampo('Data inicial (AAAA-MM-DD): ', validarDataNascimento);
  const fim = await perguntarCampo('Data final (AAAA-MM-DD): ', validarDataNascimento);
  exibirAlunos(await alunos.consultarPorPeriodo(inicio, fim));
}

export async function iniciarMenu() {
  cabecalho();

  let opcao;

  do {
    menu();
    opcao = await perguntar('Escolha uma opção (0 para sair): ');

    try {
      switch (opcao) {
        case '1': await opcaoCriar(); break;
        case '2': await opcaoListar(); break;
        case '3': await opcaoBuscar(); break;
        case '4': await opcaoAtualizar(); break;
        case '5': await opcaoExcluir(); break;
        case '6': await opcaoPorTurma(); break;
        case '7': await opcaoPorData(); break;
        case '8': await opcaoPorPeriodo(); break;
        case '0': break;
        default: console.log('\nOpção inválida. Digite um número de 0 a 8.');
      }
    } catch (erro) {
      console.error(`\nErro: ${erro.message}`);
    }

    if (opcao !== '0') {
      await perguntar('\nPressione ENTER para voltar ao menu...');
    }
  } while (opcao !== '0');

  console.log('\nEncerrando... Até logo!');
  rl.close();
}
