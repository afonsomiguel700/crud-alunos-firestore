// Insere alunos FICTÍCIOS para popular a coleção e facilitar os testes/screenshots.
// Os IDs são fixos (aluno001, aluno002...), então rodar o script de novo não duplica os dados.

import { colecaoAlunos } from './src/firebase.js';

const ALUNOS_FICTICIOS = [
  { nome: 'Ana Souza', turma: '3DSB', dataNascimento: '2009-05-15', ativo: true },
  { nome: 'Bruno Lima', turma: '3DSA', dataNascimento: '2009-01-22', ativo: true },
  { nome: 'Carla Mendes', turma: '3DSB', dataNascimento: '2008-11-03', ativo: false },
  { nome: 'Daniel Rocha', turma: '2ADM', dataNascimento: '2010-07-30', ativo: true },
  { nome: 'Elena Castro', turma: '3DSB', dataNascimento: '2009-05-15', ativo: true },
  { nome: 'Felipe Nunes', turma: '2ADM', dataNascimento: '2010-02-14', ativo: false },
  { nome: 'Gabriela Dias', turma: '1DSB', dataNascimento: '2011-09-08', ativo: true },
  { nome: 'Hugo Pereira', turma: '3DSA', dataNascimento: '2008-12-19', ativo: true }
];

console.log('Inserindo alunos fictícios no Firestore...\n');

for (const [indice, aluno] of ALUNOS_FICTICIOS.entries()) {
  const id = `aluno${String(indice + 1).padStart(3, '0')}`;
  await colecaoAlunos.doc(id).set(aluno);
  console.log(`  ${id} — ${aluno.nome} (${aluno.turma})`);
}

console.log(`\nOK: ${ALUNOS_FICTICIOS.length} alunos gravados na coleção.`);
console.log('Rode "npm start" para abrir o menu.');
