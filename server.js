const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://root:kwxrqFBgX0NeAZql@teste.8apltkb.mongodb.net/?retryWrites=true&w=majority&appName=teste', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Criando um schema do mongoose para o usuário
const usuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
});

// Criando um modelo do mongoose baseado no schema
const Usuario = mongoose.model('Usuario', usuarioSchema);

const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));

// Configurando sessões
app.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: true
}));

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/public/cadastro.html');
});

// Rota para receber os dados do formulário de cadastro e salvar no MongoDB
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha, confirmar_senha } = req.body;

    // Verificar se as senhas coincidem
    if (senha !== confirmar_senha) {
        return res.status(400).send('As senhas não coincidem');
    }

    try {
        // Verificar se o usuário já existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).send('Usuário já cadastrado');
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Criar um novo usuário
        const novoUsuario = new Usuario({
            nome,
            email,
            senha: senhaCriptografada
        });

        // Salvar o novo usuário no MongoDB
        await novoUsuario.save();
        
        // Redirecionar para a página de login após o sucesso do cadastro
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rota para processar o login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).send('Credenciais inválidas');
        }

        // Comparar a senha fornecida com a senha criptografada no banco de dados
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).send('Credenciais inválidas');
        }
        
        // Armazenar o nome do usuário na sessão
        req.session.nomeUsuario = usuario.nome;
        
        // Redirecionar para a rota da página home após o login bem-sucedido
        res.redirect('/home');
    } catch (error) {
        res.status(500).send('Erro ao fazer login');
    }
});

// Rota para a página home (após o login)
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

// Rota para obter o nome do usuário da sessão
app.get('/getUserName', (req, res) => {
    if (req.session.nomeUsuario) {
        res.json({ nomeUsuario: req.session.nomeUsuario });
    } else {
        res.status(401).json({ erro: 'Usuário não autenticado' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
