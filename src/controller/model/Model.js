import { ClassEvent } from "../../util/ClassEvents";

//Classe Model é a classe intermediária da classe Users e da ClassEvent, para apenas tratar os dados que precisam ser salvos em json ou buscados em json
export class Model extends ClassEvent{
    constructor(){
        super()

        this._data = {} //pega todos os dados

    }
    fromJSON(json){
        this._data = Object.assign(this._data, json) //mescla dados que já existam no data com os do json
        this.trigger('datachange', this.toJSON()) //manda os dados atuais para quem ouvir o datachange

    }
    toJSON(){ //gera o json
        return this._data
    }
}