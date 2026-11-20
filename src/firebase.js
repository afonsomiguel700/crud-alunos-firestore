// Conexão com o Firebase Admin SDK.
// A chave de conta de serviço deve estar na raiz do projeto como serviceAccountKey.json.

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const caminhoChave = resolve(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'
);

if (!existsSync(caminhoChave)) {
  console.error(`\nNão encontrei a chave de serviço em: ${caminhoChave}`);
  console.error('Baixe o JSON no Firebase: Configurações do projeto > Contas de serviço > Gerar nova chave privada.');
  console.error('Salve o arquivo como serviceAccountKey.json na pasta do projeto.\n');
  process.exit(1);
}

let chave;
try {
  chave = JSON.parse(readFileSync(caminhoChave, 'utf8'));
} catch (erro) {
  console.error(`\nNão consegui ler ${caminhoChave}: ${erro.message}`);
  console.error('Confira se o arquivo é um JSON válido e não está vazio.\n');
  process.exit(1);
}

const camposObrigatorios = ['project_id', 'client_email', 'private_key'];
const faltando = camposObrigatorios.filter((campo) => !chave[campo]);

if (faltando.length > 0) {
  console.error(`\nA chave está incompleta. Faltam: ${faltando.join(', ')}.`);
  console.error('Gere uma nova chave privada no Firebase e tente novamente.\n');
  process.exit(1);
}

// Evita inicializar dois apps caso o módulo seja importado mais de uma vez.
if (getApps().length === 0) {
  initializeApp({ credential: cert(chave) });
}

export const db = getFirestore();

// Nome da coleção usada no projeto (pode ser alterado por variável de ambiente).
export const nomeColecao = process.env.FIRESTORE_COLLECTION || 'alunos';
export const colecaoAlunos = db.collection(nomeColecao);
