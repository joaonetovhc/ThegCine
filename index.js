const express = require('express');
const { connect } = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json()); // Permite receber JSON no corpo das requisições

//para fazer as requisições 
const cors = require('cors');
app.use(cors());

//criptografia de senha
const bcrypt = require('bcrypt');

// Rota inicial
app.get('/', (req, res) => {
    res.send('Bem-vindo à API de Filmes!');
});

// rota de registro
app.post("/registrar", async (req, res) =>{
    const { nome, senha } = req.body;

    if(!nome || !senha){
        return res.status(400).json({error: "Usuario e senha obrigatorios."});
    }

    try{
        const hashedPassword = await bcrypt.hash(senha, 10);

        const pool = await connect();
        const result = await pool.request()
        .input("nome", nome)
        .input("senha", hashedPassword)
        .query("INSERT INTO Usuarios (nome, senha) VALUES (@nome, @senha)");

        res.status(201).json({message:"Usuario registrado com sucesso."});
    } catch (err){
        console.error("Erro ao registrar o usuario:", err);
        res.status(500).send("Erro no servidor.");
    }
});

// rota de login
app.post("/login", async (req, res) =>{
    const {nome, senha} = req.body;

    if (!nome || !senha)
    { 
        return res.status(400).json({error: "Usuario e senha sao obrigatorios."});
    }

    try{
        const pool = await connect();
        const result = await pool.request()
        .input("nome", nome)
        .query("SELECT * FROM Usuarios WHERE nome = @nome");

        if (result.recordset.length === 0){
            return res.status(401).json({error: "Usuario não encontrado."});
        }

        const usuario = result.recordset[0];

        //comparando a senha com a criptografada do banco
        const match = await bcrypt.compare(senha, usuario.senha);

        if (!match){
            return res.status(401).json({error: "Senha incorreta."});
        }

        res.json({message: "Login realizado.", userId: usuario.id});
    } catch(err){
        console.error("Erro ao realizar login:", err);
        res.status(500).send("Erro no servidor.");
    }
});

//rota de listar os filmes
app.get("/filmes", async (req, res)=> {
    try {
        const pool = await connect();
        const result = await pool.request().query("SELECT * FROM Filmes");
        res.json(result.recordset);
    } catch (err) {
        console.error("Erro ao buscar filmes:", err);
        res.status(500).send("Erro no servidor");
    }
});

// rot de buscar filme por ID
app.get("/filmes/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await connect();
        // Faz a consulta no banco usando o ID
        const result = await pool.request().input("id" ,id).query('SELECT * FROM Filmes WHERE id = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Filme não encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Erro ao buscar filme:", err);
        res.status(500).send("Erro no servidor");
    }
});

//rota de adicionar filme
app.post("/filmes", async (req, res)=>{
    const {titulo, data_lancamento, url_foto, ano, descricao } = req.body;

    if (!titulo || !data_lancamento || !url_foto || !ano || !descricao){
        return res.status(400).json({error: "Preencha os campos obrigatorios."})
    }
    try { 
        const pool = await connect();
        await pool.request()
        .input("titulo", titulo)
        .input("data_lancamento", data_lancamento)
        .input("url_foto", url_foto)
        .input("ano", ano)
        .input("descricao", descricao)
        .query (`INSERT INTO Filmes (titulo, data_lancamento, url_foto, ano, descricao)
            VALUES (@titulo, @data_lancamento, @url_foto, @ano, @descricao)
        `);

        res.status(201).json({message:"Filme adicionado."});
    } catch (err) {
        console.error("Erro ao adicionar filme:", err);
        res.status(500).send("Erro no servidor.");
    }
});

//rota de editar filme
app.put("/filmes/:id", async (req, res)=>{
    const { id } = req.params;
    const { titulo, data_lancamento, url_foto, ano, descricao } = req.body;

    try {
        const pool = await connect();
        await pool.request()
        .input("id", id)
            .input("titulo", titulo)
            .input("data_lancamento", data_lancamento)
            .input("url_foto", url_foto)
            .input("ano", ano)
            .input("descricao", descricao)
            .query(`
                UPDATE Filmes 
                SET titulo = @titulo, data_lancamento = @data_lancamento, url_foto = @url_foto,
                    ano = @ano, descricao = @descricao
                WHERE id = @id
                `);
        res.json({message:"Filme atualizado com sucesso."});        
    } catch (err) {
        console.error("Erro ao editar filme:", err);
        res.status(500).send("Erro no servidor");
    }
});

//rota de excluir filme
app.delete("/filmes/:id", async (req, res) =>{
    const { id } = req.params;

    try {
        const pool = await connect();
        await pool.request()
        .input("id", id)
        .query("DELETE FROM Filmes WHERE id = @id");
        
        res.json({message:"Filme excluido com sucesso."});
    } catch (err) {
        console.error("Erro ao excluir filme:", err);
        res.status(500).send("Erro no servidor.");
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log("Servidor aberto")
});
