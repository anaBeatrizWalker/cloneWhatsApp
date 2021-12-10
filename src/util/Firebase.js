const firebase = require('firebase')
require('firebase/firestore')//cloud

export class Firebase{

    constructor(){
        //Inicialização
        this._config = {
            firebase: "******************CÓDIGO DO FIREBASE"
        }
        this.init()
    }
    init(){
        //Validando a inicialização

        if(!window._initializedFirebase){ //se não existe uma inicialização da aplicação
            firebase.initializeApp(this._config)//inicializa

            firebase.firestore().settings({ //configurações da API firestore
                timestampsInSnapshot: true //toda vez que der um snapshot já vem com o timeStamp
            })

            window._initializedFirebase = true //agora existe
        }
        
    }

    //retorna as informações guardadas no firestore
    static db(){ 
        return firebase.firestore()
    }

    //retornas os arquivos de uploads salvos
    static hd(){ 
        return firebase.storage()
    }

    //Solicita a autenticação do firebase
    initAuth(){ 
        return new Promise((s,f)=>{

            let provider = new firebase.auth.GoogleAuthProvider()

            firebase.auth().signInWithPopup(provider).then(result =>{ //abre uma janela perguntando com qual conta quer logar

                let token = result.credential.accessToken //retorna o token do usuário autenticado gerado pelo firebase

                let user = result.user//pega os dados do user

                s({
                    user, 
                    token
                })

            }).catch(err=>{
                f(err)
            })
        })
    }
}