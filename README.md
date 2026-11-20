# CRUD de Alunos com Firebase Cloud Firestore

Atividade prática da aula **Banco de Dados NoSQL**: aplicação em **Node.js** com menu no terminal para criar, ler, atualizar e excluir alunos em um banco **Cloud Firestore**, além de consultas por turma e por data de nascimento.

**Repositório:** <https://github.com/afonsomiguel700/crud-alunos-firestore>  
**Projeto Firebase:** `crud-alunos-nosql` · **Coleção:** `alunos`  
**Capturas de tela:** pasta [`capturas/`](capturas/)

## 1. O que o projeto faz

A coleção `alunos` segue exatamente a estrutura da aula:

| Campo | Tipo | Exemplo |
| --- | --- | --- |
| `nome` | texto | `"Ana"` |
| `turma` | texto | `"3DSB"` |
| `dataNascimento` | texto `AAAA-MM-DD` | `"2009-05-15"` |
| `ativo` | booleano | `true` |

Cada aluno é um **documento** dentro da coleção (ex.: ID `aluno001`). O ID é gerado pelo Firestore no cadastro ou definido no script de dados fictícios.

Operações do menu:

| Opção | Operação | Método usado no SDK |
| --- | --- | --- |
| 1 | **Create** — cadastrar aluno | `collection(...).add({ ... })` |
| 2 | **Read** — listar todos | `collection(...).get()` |
| 3 | **Read** — buscar por ID | `doc(id).get()` |
| 4 | **Update** — alterar aluno | `doc(id).update({ ... })` |
| 5 | **Delete** — excluir aluno | `doc(id).delete()` |
| 6 | Consulta por turma | `where('turma', '==', turma)` |
| 7 | Consulta por data de nascimento | `where('dataNascimento', '==', data)` |
| 8 | Consulta por período | `where('dataNascimento', '>=', inicio)` e `<= fim` |

## 2. Pré-requisitos

- Conta Google para acessar o [Firebase Console](https://console.firebase.google.com/).
- **Node.js 18 ou superior** (de preferência uma versão LTS). Baixe em [nodejs.org](https://nodejs.org/).
- Conexão com a internet para instalar pacotes e acessar o Firestore.

Para conferir a instalação, abra um terminal (PowerShell) e rode:

```powershell
node -v
npm -v
```

> Se `node -v` não funcionar, instale o Node.js antes de continuar e reabra o terminal.

## 3. Criando o projeto no Firebase (passo a passo)

### 3.1 Criar o projeto

1. Acesse <https://console.firebase.google.com/> e clique em **Adicionar projeto** (ou **Criar um projeto**).
2. Escolha um nome, por exemplo `crud-alunos-nosql`.
3. Na etapa do Google Analytics, pode **desativar** (não é necessário para esta atividade).
4. Clique em **Criar projeto** e aguarde.

### 3.2 Habilitar o Cloud Firestore

1. No menu lateral do projeto, vá em **Build / Compilar → Firestore Database**.
2. Clique em **Criar banco de dados**.
3. Escolha o modo: **Produção** (ou **Teste** — para o Admin SDK as regras não influenciam).
4. Escolha a localização, por exemplo `southamerica-east1 (São Paulo)`.
5. Clique em **Ativar**.

> Não é preciso criar um app Web: o **Firebase Admin SDK** se conecta direto com a conta de serviço.

### 3.3 Gerar a chave de conta de serviço

1. Clique na engrenagem **Configurações do projeto** → aba **Contas de serviço**.
2. Clique em **Gerar nova chave privada**.
3. Confirme **JSON**. O arquivo será baixado (nome parecido com `projeto-xxxx-firebase-adminsdk.json`).
4. Renomeie o arquivo para **`serviceAccountKey.json`** e coloque-o na raiz desta pasta (`crud-firestore`), ao lado de `package.json`.

Exemplo de estrutura final:

```text
crud-firestore/
├── serviceAccountKey.json   <-- baixado do Firebase (NÃO enviar ao GitHub)
├── package.json
├── index.js
├── seed.js
├── src/
│   ├── alunos.js
│   ├── firebase.js
│   ├── menu.js
│   └── validacao.js
└── README.md
```

## 4. Executando o projeto

Entre na pasta do projeto e instale a dependência:

```powershell
cd "C:\Users\drey_\OneDrive\Documentos\Projeto Padrão\crud-firestore"
npm install
```

Opcional: insira alunos **fictícios** para popular a coleção e facilitar os testes e as capturas de tela:

```powershell
npm run seed
```

Inicie o menu:

```powershell
npm start
```

Se quiser usar outro nome de coleção, defina a variável antes de rodar (o padrão é `alunos`):

```powershell
$env:FIRESTORE_COLLECTION = "alunos"
npm start
```

## 5. Segurança — muito importante

- O arquivo `serviceAccountKey.json` dá acesso administrativo ao seu projeto Firebase. **Nunca publique-o no GitHub** e nunca cole o conteúdo dele no código.
- O `.gitignore` deste projeto já bloqueia esse arquivo. Antes de cada `git add`, rode `git status` e confirme que ele **não** aparece.
- Use somente **dados fictícios** (o `seed.js` já faz isso).
- Se a chave vazar, volte em **Configurações do projeto → Contas de serviço**, apague/revoque a chave e gere outra.

## 6. Publicando no GitHub

Crie um repositório novo no GitHub (sem README inicial para evitar conflito) e execute na pasta do projeto:

```powershell
git init
git add .
git status
git commit -m "CRUD de alunos com Firebase Cloud Firestore"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```

Confira o `git status` antes do commit: se `serviceAccountKey.json` aparecer, pare e corrija o `.gitignore`.

## 7. Entrega (Google Sala de Aula)

**Link para enviar:** <https://github.com/afonsomiguel700/crud-alunos-firestore>

As capturas já estão na pasta [`capturas/`](capturas/) e também podem ser anexadas individualmente:

| Captura | O que mostra |
| --- | --- |
| `01-menu-e-listagem.jpg` | Menu principal e listagem dos 8 alunos fictícios |
| `02-consulta-por-turma.jpg` | Consulta por turma (`3DSB`) |
| `03-consulta-por-data.jpg` | Consulta por data de nascimento (`2009-05-15`) |
| `04-consulta-por-periodo.jpg` | Consulta por período (`2009-01-01` a `2009-12-31`) |
| `05-firestore-colecao.jpg` | Console do Firestore com a coleção `alunos` |
| `06-github-repositorio.jpg` | Repositório publicado no GitHub |
| `07-criar.jpg` | Cadastro e ID do documento gerado |
| `08-atualizar.jpg` | Alteração de dados e confirmação |
| `09-excluir.jpg` | Confirmação e exclusão do aluno de teste |

No Google Sala de Aula, cole o link do repositório e anexe as imagens desejadas.

## 8. Problemas comuns

| Sintoma | Solução |
| --- | --- |
| `'node' não é reconhecido` | Instale o Node.js LTS e reabra o terminal. |
| `Não encontrei a chave de serviço` | Confira se `serviceAccountKey.json` está na pasta `crud-firestore` com esse nome exato. |
| `A chave está incompleta` | Gere uma nova chave privada no Firebase; o JSON precisa ter `project_id`, `client_email` e `private_key`. |
| `PERMISSION_DENIED` / `Could not load the default credentials` | A chave é inválida ou é de outro projeto. Gere e substitua o arquivo. |
| Nenhum aluno aparece | Rode `npm run seed` e confira se a coleção se chama `alunos`. |
| Falha no `npm install` | Use Node.js 18+ e verifique a conexão com a internet. |

## 9. Resumo teórico da aula (para estudar)

- **NoSQL** (*Not Only SQL*) é uma categoria de bancos que usa modelos diferentes do relacional: documentos, chave-valor, colunas amplas e grafos.
- **SQL × NoSQL**: tabelas/esquema rígido/JOIN/SQL × documentos/esquema flexível/referências/APIs específicas.
- **ACID**: atomicidade, consistência, isolamento e durabilidade — confiabilidade das transações.
- **BASE**: disponibilidade básica, estado suave e consistência eventual — típico de sistemas distribuídos. Bancos NoSQL **também podem oferecer transações ACID**.
- **Marcos**: Bigtable (2004), Dynamo (2007), MongoDB e Redis (2009), Cassandra (2012), Cloud Firestore (2017).
- **Cloud Firestore** é documental: coleções contêm documentos, que contêm campos. Hoje, bancos relacionais e NoSQL coexistem; a escolha depende dos dados, das consultas, da consistência e da arquitetura da aplicação.
