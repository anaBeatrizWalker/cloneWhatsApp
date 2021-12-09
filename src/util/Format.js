export class Format{

    //Faz com que os 75 ids tenham um atributo dentro de cada um deles já padronizado para o CamelCase, pronto para usar no javascript
    static getCamelCase(text){

        //Div criada para ter um dataset
        let div = document.createElement('div')

        div.innerHTML = `<div data-${text}="id"></div>` //atributo dataset

        //retorna a conversão, um array com todas as chaves, dataset do filho da div criada trazendo somente o primeiro
        return Object.keys(div.firstChild.dataset)[0]
    }

    static toTime(duration){
        let seconds = parseInt((duration /1000) % 60)
        let minutes = parseInt((duration / (1000 * 60) % 60))
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24)

        if(hours > 0){
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` //padStart 2 casas e passa 0 pra completar as casas vazias
        }else{
            return `${minutes}:${seconds.toString().padStart(2, '0')}`
        }
    }

    static dateToTime(date, locale = 'pt-BR'){
        return date.toLocaleTimeString(locale, {
            hours: '2-digit',
            minute: '2-digit'
        })
    }

    static timeStampToTime(timeStamp){
        return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateToTime(timeStamp.toDate()) : ''
    }
}