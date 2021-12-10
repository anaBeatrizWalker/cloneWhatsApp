const pdfjsLib = require('pdfjs-dist') //trata arquivos PDF's
const path = require('path')//biblioteca que percorre diretórios
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js') //para configurar o caminho do PDF's

export class DocumentPreviewController{
    constructor(file){

        this._file = file
    }

    getPreviewData(){
        return new Promise((s,f)=>{

            let reader = new FileReader()//trata os arquivos

            //Verificando se é imagem ou PDF
            switch(this._file.type){
                case 'image/png':
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                    reader.onload = e =>{
                        s({
                            src: reader.result, //conteúdo da imagem
                            info: this._file.name //põe o nome da imagem
                        })
                    }
                    reader.onerror = e =>{
                        f(e)
                    }
                    reader.readAsDataURL(this._file)
                break;

                case 'application/pdf':
            
                    reader.onload = e =>{

                        pdfjsLib.getDocument(new Uint8Array(reader.result)).then(pdf =>{
                        //no Document faz a conversão para um array de 8 bits, reader.result é o conteúdo

                            pdf.getPage(1).then(page=>{ //captura a primeira página
                                
                                //Visualizando a imagem

                                let viewport = page.getViewport(1)//espaço de visualização da 1º página
                                
                                let canvas = document.createElement('canvas')
                                let canvasContext = canvas.getContext('2d')
                                canvas.width = viewport
                                canvas.height = viewport

                                //gera o preview
                                page.render({
                                    canvasContext, //contexto do canvas
                                    viewport

                                }).then(()=>{

                                    let _s = (pdf.numPages > 1) ? 's': '' //varia o s
                                    s({
                                        src: canvas.toDataURL('image/png'), //caminho da imagem vindo do canvas renderizado
                                        info: `${pdf.numPages} página${_s}` //quantidade de páginas
                                    })
                                }).catch(err =>{
                                    f(err)
                                })

                            }).catch(err =>{
                                f(err)
                            })
                            
                        }).catch(err =>{
                            f(err)
                        })
                    }
                    //Leitura do PDF = conversão em em ArrayBuffer 
                    reader.readAsArrayBuffer(this._file)
                break;

                default: ;
            }
        })
    }
}