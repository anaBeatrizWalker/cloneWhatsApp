import { Firebase } from "../../util/Firebase";
import { Model } from "./Model";

export class User extends Model{

    constructor(id){ //recebe o email como id

        super() //chama o constructor de Model

        if(id) this.getById(id)

    }
    get name(){ return this._data.name }
    set name(value){ this._data.name = value }

    get email(){ return this._data.email }
    set email(value){ this._data.email = value }

    get photo(){ return this._data.photo }
    set photo(value){ this._data.photo = value }

    get chatId(){ return this._data.chatId }
    set chatId(value){ this._data.chatId = value }

    getById(id){
        return new Promise((s,f)=>{

            // ANTES = User.findByEmail(id).get().then(doc =>{}), não atualiza alterações, por causa do then há um tempo de espera após o get de dados

            User.findByEmail(id).onSnapshot(doc =>{ //ouvinte, sempre atualiza caso algum dado seja alterado
                
                this.fromJSON(doc.data()) //pega os dados do documento em json
                
                s(doc) //deu certo a promessa, devolve o documento
            })
        })
    }

    save(){ //Salva os dados no firebase
        return User.findByEmail(this.email).set(this.toJSON()) //retorna: refe do usuário no documento, pega os dados retornados em json
    }

    static getRef(){
        return Firebase.db().collection('/users') //referência dos usuários. Pega no banco as coleções de users
    }

    static findByEmail(email){ //busca pelo email
        return User.getRef().doc(email) //dentro da coleção users, retorna um documento de acordo com o ID (que é o email)

    }

    static getContactsRef(id){
        return User.getRef()
                    .doc(this.email)
                    .collection('contacts')
    }

    addContact(contact){
        return User.getContactsRef(this.email)
                .doc(btoa(contact.email)) //btoa tira os caracteres especiais do email
                .set(contact.toJSON())
    }

    getContacts(filter = ''){
        return new Promise((s,f)=>{

            User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs =>{ //chama a referência no firebase e recebe vários docs

                let contacts = []
                docs.forEach(doc =>{ //pra cada documento

                    let data = doc.data() //dados de doc
                    data.id = doc.id //recebe o id
                    contacts.push(data) //adiciona os dados no array contacts
                })
                this.trigger('contactschange', docs) //para quem tiver esperando uma mudança dos contatos
                
                s(contacts)
            })
        })
    }
}