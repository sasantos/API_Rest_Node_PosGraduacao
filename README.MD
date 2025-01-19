INICIRAO PROJETO: NPM INIT -Y
INSTALAR FASTIFY:npm install fastify
INSTALAR CORS:npm install cors
instalar o typescript:npm install typescript --save-dev
criar arquivo de configuração do typescript: npx tsc --init
instalar @types do typescript: npm i -D @types/node
instalar tsx: npm install tsx -D
instalar o knex: npm install knex --save

instalar o sqlite3: npm install sqlite3

1. Initialize Knex in Your Project

   Criar o arquivo knexfile.ts na raiz do projeto
   import o config dentro do knexfile.ts do database.ts
   configurar o package.json com o comando: "knex": "node --no-warnings --loader tsx ./node_modules/knex/bin/cli.js --knexfile ./knexfile.ts"
   comando para criar a migration : npm run knex -- migrate:make create-transactions | create-transactions é o nome da migration
   executar as migrations: npm run knex -- migrate:latest
   Desfazer a alterar na migration : npm run knex -- migrate:rollback

Instalar o dotenv: npm install dotenv -- usar variaveis de ambiente
Criar o arquivo .env na raz do projeto

Instalando o Zod: npm i zod --- Usado para validações
