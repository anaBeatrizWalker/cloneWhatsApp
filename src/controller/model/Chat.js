import { Firebase } from "../../util/Firebase";
import { Model } from "./Model";

export class Chat extends Model{
    constructor(){
        super()
    }

    //objetos 
    get users() { this._data.users }
    set users(value) { this._data.users = value}

    get timeStamp() { this._data.timeStamp }
    set timeStamp(value) { this._data.timeStamp = value}

    static getRef(){ //acessa a seção de chats no firebase
        return Firebase.db.collection('/chats')
    }

    //Criando um chat novo
    static create(meEmail, contactEmail){
        return new Promise((s,f)=>{

        let users = {}
        users[btoa(meEmail)] = true
        users[btoa(contactEmail)] = true

        Chat.getRef().add({
            users,
            timeStamp: new Date()

        }).then(doc =>{
            Chat.getRef().doc(doc.id).get().then(chat=>{
                s(chat)

            }).catch(err =>{ f(err) })
        }).catch(err =>{ f(err) })
        })
    }

    //Procura as conversas
    static find(meEmail, contactEmail){
        return Chat.getRef()
            .where(btoa(meEmail),'==', true )//quem ta procurando, o que faz, resultado
            .where(btoa(contactEmail),'==', true )
            .get()//quando encontrar, retorna a conversa
    }

    static createIfNotExists(meEmail, contactEmail){
        return new Promise((s,f)=>{

            Chat.find(meEmail, contactEmail).then(chats =>{
                if(chats.empty){ //se o chat é vazio
                    //cria um chat
                    Chat.create(meEmail, contactEmail).then(chat =>{
                        s(chat)
                    })
                }else{//se já tinha chat
                    chats.forEach(chat =>{
                        s(chat)
                    })
                }
            })
        })
    }
}