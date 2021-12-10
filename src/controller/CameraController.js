export class CameraController{
    constructor(videoEl){

        this._videoEl = videoEl

        //API
        navigator.mediaDevices.getUserMedia({ //acessa uma media do usuário
            video: true //a media solicitada

        }).then(stream =>{

            this._stream  = stream
            this._videoEl.src = URL.createObjectURL(stream)//converte o arquivo em um link para conseguir lê-lo
            this._videoEl.play()

        }).catch(err=>{
            console.error(err)//se não der acesso a camera, mostra o erro
        })
    }
    stopCamera(){
        this._stream.getTracks().forEach(track =>{//pega cada trilha/trilha de informação (tanto vídeo e áudio)
            track.stop()//para cada faixa
        })
    }

    takePicture(mimeType = 'image/png'){//tipo da imagem

        let canvas = document.createElement('canvas') //cria a paleta, área de desenho

        //define a altura e largura da paleta
        canvas.setAttribute('height', this._videoEl.videoHeight)//atribui o próprio tamanho do vídeo
        canvas.setAttribute('width', this._videoEl.videoWidth)
        
        let context = canvas.getContext('2d')

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height)
        //origem: desenha o que ta acontecendo no vídeo (o momento), 
        //posições: começa do início (0 do topo e 0 da esquerda), 
        //destino do x e y, até onde vai o desenho (a própria altura e largura definida no canvas)

        return canvas.toDataURL(mimeType) //converte em base64

    }
}