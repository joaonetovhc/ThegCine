ThegCine -- Projeto-A3
API de um catalogo de filmes com gerenciamento integrado

Endpoints

Registrar Usuário Método: POST URL: /registrar Descrição: Registra um novo usuário com nome e senha.

Login Método: POST URL: /login Descrição: Realiza o login de um usuário com nome e senha.

Listar Filmes Método: GET URL: /filmes Descrição: Retorna uma lista de todos os filmes cadastrados.

Buscar Filme por ID Método: GET URL: /filmes/:id Descrição: Retorna os detalhes de um filme específico com base no ID fornecido.

Adicionar Filme Método: POST URL: /filmes Descrição: Adiciona um novo filme ao banco de dados.

Editar Filme Método: PUT URL: /filmes/:id Descrição: Atualiza as informações de um filme existente, identificado pelo ID.

Excluir Filme Método: DELETE URL: /filmes/:id Descrição: Exclui um filme do banco de dados com base no ID fornecido.

Dependências express: Framework web para Node.js. bcrypt: Biblioteca para criptografar senhas. cors: Middleware para permitir solicitações de origens diferentes. mssql (assumido pela função connect): Para conexão com o banco de dados SQL Server.
