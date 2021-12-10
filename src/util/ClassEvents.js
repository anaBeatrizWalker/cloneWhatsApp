export class ClassEvent{
    constructor(){
        this._events = {}
    }
    //CRIANDO EVENTOS

    on(eventName, fn){ //nome, função

        //Se não existe o evento (se não está em uso), cria ele recebendo um array
        if(!this._events[eventName]) this._events[eventName] = new Array()

        //Adiciona uma função ao evento
        this._events[eventName].push(fn)
        //evento agora é um array

        //Isso permite utilizar o mesmo evento várias vezes, com diferentes execuções (funções), fazendo com que todos funcionam e não sejam subscritos
    }

    //Gatilho do evento
    trigger(){

        let args = [...arguments] //pega os argumentos passados no parâmetros, sem fazer com que os parâmetros seja obrigatórios

        let eventName = args.shift()//obriga o nome do evento a ser o primeiro argumento

        args.push(new Event(eventName))

        if(this._events[eventName] instanceof Array){//se é um array

            this._events[eventName].forEach(fn =>{
                fn.apply(null, args)//faz com que execute a função 
            })
        }
    }
}