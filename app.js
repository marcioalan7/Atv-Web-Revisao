const express = require('express')
const exphbs = require('express-handlebars')
const app = express()

const sequelize = require('./config/bd')
const methodOverride = require('method-override');

const Estudante = require('./models/estudante.model')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.engine(
    'handlebars', 
    exphbs.engine( {defaultLayout: false} )
);
app.set(
    'view engine', 
    'handlebars'
);

app.get(
    '/',
    async(req, res) => {
        const estudantes = await Estudante.findAll({ raw: true })
        res.render('listarEstudantes', {estudantes})
    }
)

app.get(
    '/estudantes/create',
    async(req, res) => {
        res.render('cadastrarEstudantes')
    }
)

app.post(
    '/estudantes', 
    async (req, res) => {
    const { nome, idade } = req.body;
    await Estudante.create({
        nome,
        idade
    });

    res.redirect('/');
});

app.delete(
    '/estudantes/:id',
    async(req, res) => {
        const id = req.params.id
        const estudante = await Estudante.findByPk(id)
        estudante.destroy()
        res.redirect('/')
    }
)

app.get(
    '/estudantes/:id/edit',
    async(req, res) => {
        const id = req.params.id
        const estudante = await Estudante.findByPk(id)
        res.render('editarEstudantes', {estudante} )
    }
)

async function conectarBD() {
    try{
        await sequelize.sync();
        console.log('Conexão com o banco de dados estabelecida com sucesso!')
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    }
}

conectarBD()

app.listen(
    3000,
    () => console.log('Servidor em execução')
)