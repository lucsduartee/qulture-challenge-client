# Qulture Challenge Client

## Descrição
Este é um projeto frontend desenvolvido em React com JavaScript, criado para gerenciar informações sobre colaboradores e empresas. O projeto utiliza Context API para gerenciamento de estados e conta com duas páginas principais:
- **Colaboradores:** para visualização e gestão de dados de colaboradores.
- **Empresas:** para visualização e administração de informações de empresas.

---

## Tecnologias Utilizadas
- ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white) **React**
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) **JavaScript**
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) **Docker**

---

## Configuração do Projeto com Docker Compose

### Requisitos
Certifique-se de ter os seguintes softwares instalados:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Passo a Passo
1. Clone o repositório:
   ```bash
   git clone git@github.com:lucsduartee/qulture-challenge-client.git
   cd qulture-challenge-client
   ```

2. Certifique-se de que o Docker esteja em execução.

3. Certifique-se de ter um arquivo `.env` configurado com a seguinte variável:
   ```env
   NEXT_PUBLIC_QULTURE_API_HOST=http://localhost:3001
   ```

4. Construa e inicie os contêineres:
   ```bash
   docker-compose up --build
   ```

5. Acesse a aplicação em [http://localhost:3000](http://localhost:3000).

### Comandos úteis
- Parar os contêineres:
  ```bash
  docker-compose down
  ```
- Ver os logs:
  ```bash
  docker-compose logs -f
  ```

---

## Páginas Principais

1. **Colaboradores:**  
   A página permite a visualização de uma lista de colaboradores, além de suas informações detalhadas.

2. **Empresas:**  
   Nesta página é possível visualizar as empresas cadastradas e gerenciar suas informações.

---

## Wireframes
> **Espaço reservado para prints de wireframes:**
> Cole aqui capturas de tela que representem as páginas principais e funcionalidades da aplicação.

---

## Referências
- [Documentação do Docker](https://docs.docker.com/)

