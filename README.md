![Logo](https://i.imgur.com/MTVXJmQ.png)

O Quatenus MyChoice é uma ferramenta interna da Quatenus Brasil, usada pra facilitar e simplificar a visualização das famílias de produtos e auxiliar o usuário a entender melhor o produto.

## Screenshots

Página inicial:
![Screenshot](https://i.imgur.com/uNXbt4j.png)

Famílias:
![Screenshot](https://i.imgur.com/lEBxBXk.png)
![Screenshot](https://i.imgur.com/yZx7pkg.png)

Pesquisa:
![Screenshot](https://i.imgur.com/N2Yb5Af.png)

## Stack utilizada

**Frontend:** React, Bootstrap

**Backend:** Node, Express

**Database:** MongoDB

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

Para o backend:

`DB_URI` - URI do mongodb

`SECRET_JWT` - Hash string, ex: yajznbmahjd

`SECRET_JWT_EXP` - Expiração do token JWT, ex: 24h

Opcional:

`PORT` - Padrão é 5555

Para o frontend:

`VITE_BASE_URL` - URL base do site, ex: http://localhost:3000

Opcional:

`VITE_GA_LINK` - Link para a pasta que contém os Guias de Ativação
`VITE_DISCOUNT_POLICY_LINK` - Link para o pdf que contém a política de descontos 

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/kerstenbr/QuatenusMyChoice.git
```

Entre no diretório do projeto

```bash
  cd quatenusmychoice
```

Instale as dependências do backend

```bash
  cd backend
```

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

Instale as dependências do frontend

```bash
  cd frontend
```

```bash
  npm install
```

Inicie o servidor

```bash
  npm run dev
```

## Documentação da API

### Famílias:

#### Retorna todas as famílias

```http
  GET /api/families/
```

#### Retorna uma família pelo id

```http
  GET /api/families/{id}
```

| Parâmetro | Tipo       | Descrição        |
| :-------- | :--------- | :--------------- |
| `id`      | `ObjectId` | **Obrigatório**. |

#### Cria famílias via arquivo excel

```http
  POST /api/families/upload
```

| Parâmetro | Tipo          | Descrição                                                         |
| :-------- | :------------ | :---------------------------------------------------------------- |
| `file`    | `xls ou xlsx` | **Obrigatório**. Arquivo excel que será lido                      |
| `token`   | `string`      | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

#### Deletar uma família

```http
  DELETE /api/families/{id}
```

| Parâmetro | Tipo       | Descrição                                                         |
| :-------- | :--------- | :---------------------------------------------------------------- |
| `id`      | `ObjectId` | **Obrigatório**.                                                  |
| `token`   | `string`   | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

### Usuários:

#### Retorna todos os usuários

```http
  GET /api/user/
```

| Parâmetro | Tipo     | Descrição                                                         |
| :-------- | :------- | :---------------------------------------------------------------- |
| `token`   | `string` | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

#### Registrar

```http
  POST /api/user/register
```

Exemplo de `body` a ser enviado:

```json
{
  "email": "email@email.com",
  "password": "123"
}
```

#### Login

```http
  POST /api/user/login
```

Exemplo de `body` a ser enviado:

```json
{
  "email": "email@email.com",
  "password": "123"
}
```

#### Encontrar usuário

```http
  GET /api/user/findUser/{id}
```

| Parâmetro | Tipo       | Descrição                                   |
| :-------- | :--------- | :------------------------------------------ |
| `id`      | `ObjectId` | **Obrigatório**.                            |
| `token`   | `string`   | **Obrigatório no Header**. Token do usuário |

#### Editar um usuário

```http
  PUT /api/user/{id}
```

| Parâmetro | Tipo       | Descrição                                                         |
| :-------- | :--------- | :---------------------------------------------------------------- |
| `id`      | `ObjectId` | **Obrigatório**.                                                  |
| `token`   | `string`   | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

Exemplo de `body` a ser enviado:

```json
{
  "email": "email@email.com"
}
```

#### Deletar um usuário

```http
  DELETE /api/user/{id}
```

| Parâmetro | Tipo       | Descrição                                                         |
| :-------- | :--------- | :---------------------------------------------------------------- |
| `id`      | `ObjectId` | **Obrigatório**.                                                  |
| `token`   | `string`   | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

### Setores:

#### Retorna todos os setores

```http
  GET /api/role/
```

| Parâmetro | Tipo     | Descrição                                                         |
| :-------- | :------- | :---------------------------------------------------------------- |
| `token`   | `string` | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

#### Criar um setor

```http
  POST /api/role/
```

| Parâmetro | Tipo     | Descrição                                                         |
| :-------- | :------- | :---------------------------------------------------------------- |
| `token`   | `string` | **Obrigatório no Header**. Token do usuário, precisa ser um admin |

Exemplo de `body` a ser enviado:

```json
{
  "name": "vendas",
  "active": true
}
```