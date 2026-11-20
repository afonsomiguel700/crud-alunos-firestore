// Ponto de entrada da aplicação.
// A conexão com o Firestore é feita ao importar o menu, que importa src/firebase.js.

import { iniciarMenu } from './src/menu.js';

iniciarMenu().catch((erro) => {
  console.error('\nErro fatal:', erro.message);
  process.exitCode = 1;
});
