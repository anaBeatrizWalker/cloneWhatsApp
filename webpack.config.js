const path = require('path')//ajuda a encontrar as pastas corretamente

module.exports = {
    //arquivo de entrada: primeiro arquivo js que deve ser olhado no projeto
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },

    //arquivo de saída: quando fizer a união de todos os arquivos que precisa, retorna em qual arquivo e qual é o caminho
    output = {
        filename: '[name].bundle.js', //concatena o nome de cima (pdf.worker), bundle é o compilado de arquivos js
        path: path.join(__dirname, 'dist'), //a partir da pasta física que está, pega a pasta dist
        publicPath: 'dist' //acesso final (pasta de distribuição)
    }
}