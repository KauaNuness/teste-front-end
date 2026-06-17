# Teste Técnico Frontend - CRUD de Usuários e Endereços

## Sobre o Projeto

Aplicação desenvolvida em Angular para gerenciamento de usuários e seus respectivos endereços.

O sistema consome uma API REST desenvolvida em Spring Boot, permitindo o gerenciamento completo de usuários e endereços, incluindo validação de CEP através da API ViaCEP.

---

## Tecnologias Utilizadas

* Angular 20
* TypeScript
* Angular Material
* HTML5
* CSS3

---

## Funcionalidades

### Usuários

* Listar todos os usuários
* Visualizar detalhes do usuário
* Criar usuário
* Editar usuário
* Remover usuário

### Endereços

* Adicionar um ou mais endereços ao usuário
* Editar endereços vinculados
* Remover endereços
* Visualizar endereços associados ao usuário

### Integração ViaCEP

* Busca automática de endereço pelo CEP
* Preenchimento automático dos campos:

  * Rua
  * Bairro
  * Cidade
  * Estado
* Tratamento para CEP inválido

### Feedback Visual

* Loading Spinner durante chamadas da API
* Toasts de sucesso
* Toasts de erro
* Toast específico para CEP inválido
* Confirmação antes de exclusões

### Validações

#### Usuário

* Nome obrigatório
* Email obrigatório
* Formato de email válido
* Telefone obrigatório
* Validação de telefone brasileiro

#### Endereço

* CEP obrigatório
* Rua obrigatória
* Número obrigatório
* Cidade obrigatória
* Estado obrigatório
* Pelo menos um endereço cadastrado

---

## Arquitetura do Projeto

```text
src/app

├── models
├── services
├── pages
│   ├── user-list
│   ├── user-form
│   └── user-detail
├── shared
│   ├── components
│   │   ├── confirm-dialog
│   │   └── loading-spinner
│   └── services
└── app.routes.ts
```

---

## Camadas

### Pages

Responsáveis pelas telas da aplicação.

### Services

Responsáveis pela comunicação com a API REST e serviços externos.

### Models

Representação dos objetos utilizados pela aplicação.

### Shared Components

Componentes reutilizáveis utilizados em diferentes telas.

---

## Executando o Projeto

### Clonar o Repositório

```bash
git clone https://github.com/KauaNuness/teste-back-end.git
```

### Entrar no Diretório

```bash
cd teste-front-end
```

### Instalar Dependências

```bash
npm install
```

### Executar a Aplicação

```bash
ng serve
```

ou

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:4200
```

---

## Integração com Backend

A aplicação consome os seguintes endpoints:

### Listar Usuários

```http
GET /api/users
```

### Buscar Usuário por ID

```http
GET /api/users/{id}
```

### Criar Usuário

```http
POST /api/users
```

### Atualizar Usuário

```http
PUT /api/users/{id}
```

### Remover Usuário

```http
DELETE /api/users/{id}
```

---

## Telas Implementadas

### Lista de Usuários

* Exibição de todos os usuários cadastrados
* Atualização manual da lista
* Ações de visualizar, editar e remover

### Detalhes do Usuário

* Exibição dos dados do usuário
* Exibição dos endereços vinculados

### Cadastro e Edição

* Formulário único para criação e atualização
* Integração automática com ViaCEP
* Validações em tempo real

---

## Tratamento de Erros

### CEP Inválido

Exibição de toast informando que o CEP informado não foi encontrado.

### Falha na Comunicação com a API

Exibição de toast informando erro na operação realizada.

### Validações de Formulário

Mensagens específicas para cada campo inválido.

---

## Funcionalidades Extras Implementadas

* Angular Material para interface moderna
* Loading Spinner durante requisições
* Confirmação de exclusão de usuários
* Confirmação de remoção de endereços
* Atualização manual da listagem
* Formatação automática de CEP
* Formatação automática de telefone
* Interface responsiva

---

## Boas Práticas Aplicadas

* Standalone Components
* Injeção de Dependências com inject()
* Componentização
* Reutilização de componentes
* Tratamento centralizado de notificações
* Responsividade
* Commits semânticos
* Organização por responsabilidade

---

## Autor

Kauã Nunes
