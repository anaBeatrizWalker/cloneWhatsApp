import { Firebase } from "./Firebase"

export class Upload{
    static send(file, from){
        return new Promise((s,f)=>{
            //uploado do arquivo para o firebase storage
            let uploadTask = Firebase.hd().ref(from).child(Date.now()+ '_' + file.name).put(file) //hd é o storage, ref é o caminho que o arquivo vai ficar no storage

            uploadTask.on('state-changed', e=>{
                console.info('upload', e)
            }, err =>{
                f(err)
            }, ()=>{
                
                s(uploadTask.snapshot) 
            })
        })
    }
}