import { blob } from "stream/consumers"
import { ClassEvent } from "../util/ClassEvents"

export class MicrophoneController extends ClassEvent{
    constructor(){

        super() //chama o constructor do pai, quem está extendendo

        this._mimeType = 'audio/webm' //tipo do arquivo padrão

        this._available = false //guarda se o usuário permitiu a gravação

        navigator.mediaDevices.getUserMedia({ //ativa o microfone
            audio: true
        }).then(stream =>{

            this._available = true //permitiu a gravação

            this._stream  = stream

            this.trigger('ready', this._stream) //está pronto para ouvir

        }).catch(err=>{
            console.error(err)
        })
    }

    isAvailable(){
        return this._available
    }

    //começa a ouvir
    stop(){
        this._stream.getTracks().forEach(track =>{
            track.stop()
        })
    }

    //Inicia a gravação do áudio
    startRecorder(){

        if(this.isAvailable()){
            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType = this._mimeType //tipo de arquivo a ser gravado
            })

            this._recordedChunks = []//recebe os dados = pedaços da gravação

            this._mediaRecorder.addEventListener('dataavailable', e=>{

                if(e.data.size > 0) this._recordedChunks.push(e.data) //se tem algum dado, vai acumulando
            })

            //quando clicar em parar de gravar
            this._mediaRecorder.addEventListener('stop', e=>{

                //cria o blob (arquivo em binário)
                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                })
                let filename = `rec${Date.now()}.webm`//define o nome do arquivo

                let audioContext = new AudioContext()

                //Lê o arquivo
                let reader = new FileReader()
                reader.onload = e =>{

                    audioContext.decodeAudioData(reader.result).then(decode=>{
                        
                        //cria o arquivo digital da gravação
                        let file = new File([blob], filename, {
                            type: this._mimeType,
                            lastModified: Date.now() //data de última modificação
                        })
                        this.trigger('recorded', file, decode)
                    })
                }
                reader.readAsArrayBuffer(blob)                
            })
            this._mediaRecorder.start()//começa a gravação
            this.startTimer()//inicia o timer
        }
    }

    stopRecorder(){
        if(this.isAvailable()){
            this._mediaRecorder.stop()
            this.stop()//para de ouvir
            this.stopTimer()//para o timer
        }
    }

    startTimer(){
        let start = Date.now() //hora que iniciou
        this._recordMicrophoneInterval = setInterval(()=>{
           this.trigger('recordtimer', Date.now() - start)
        }, 100)
    }

    stopTimer(){
        clearInterval(this._recordMicrophoneInterval)
    }
}