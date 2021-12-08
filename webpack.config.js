const path = require('path')

module.exports = {
    entry: {
        app: './src/app.js',
        'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'
    },
    output = {
        filename: '[name].bundle.js', //concatena o nome de cima (pdf.worker)
        path: path.join(__dirname, 'dist'), //a partir da pasta, vá na pasta dist
        publicPath: 'dist'
    }
}