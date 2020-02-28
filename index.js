const express  = require('express')
//import { numeroPorExtenso } from './convert';
// estava dando problema quando levantava a Docker por esse import, então apenas comentei 
// e trouxe a função para cá :/
const PORT = 3000;
const HOST = '0.0.0.0';

const app = express ();

//aqui é para iniciar o servidor express que foi instalado, requirido e instaciado acima
app.get('/:numero',(req,res)=>{
    //verificando se o sinal é negativo
    if(req.params.numero[0]=='-'){
        //montando o json com a palavra 'Menos'
        var monta = "Menos "+numeroPorExtenso(req.params.numero) 
        res.json({   
            extenso:monta   
         })//se não mostra o Json normal
       }else{
        res.json({   
            extenso:numeroPorExtenso(req.params.numero)   
         }) 
       }
});
app.listen(PORT,HOST);

function numeroPorExtenso(valor) {
    //dicionários básicos para busca conforme o valor digitado na URL
    var iniciais = {0:"0",1: 'um',2: 'dois', 3: 'tres',4: 'quatro',5: 'cinco',6: 'seis',7: 'sete',8: 'oito',9: 'nove'}
    var dezena = {0:"",2:"vinte", 3:"trinta",4:"quarenta",5:"cinquenta",6:"sessenta",7:"setenta",8:"oitenta",9:"noventa"};
    var dezenaDez = {10:"dez", 11: 'onze',12: 'doze',13: 'treze',14: 'quatorze', 15: 'quinze',16: 'dezesses',17: 'dezessete',18: 'dezoito',19: 'dezenove'}  
    var centena = {0:"",1:"cento",2:"duzentos",3:"trezentos",4:"quatrocentos",5:"quinhentos", 6:"seiscentos",7:"setecentos",8:"oitocentos",9:"novecentos"}

    var aux = {1:""}
    var completo = {1:""}
    var posisao =1
    var nova = valor
    
    
    //tratando o valor para submeter às funções visto
    //o tamanho de cada estrutura que aumenta por causa do sinal negativo
    // já que estou comparando com o tamanho na função e o limite esta até 5 casas
    // caso a leitura do vetor valor venha com sinal egativo na frente, sua estrutura ser de seis digitos 
    // então retonaria um Jason vazio, no caso de 4 casas mostraria o primeiro valor indefinido
    if(valor[0]=='-'){
        nova=valor.substring(1, 5)
     
    }
    // a lógica consiste em medir o tamanho da variável valor, com base nisso o case escolhe qual método vai usar
    // feito isso acontece uma preparação da extrutura do extenso pegando cada valor com base nas casas decimais
    switch (nova.length) {
        case 1:    
              //se for apenas um unidade basta mostrar, não precisa de muita coisa
              return  iniciais[nova[0]]  
              break;
        case 2:
              return  preparaDois(nova); 
              break;
        case 3:
              return  preparaTres(nova);
              break;
        case 4:
              return  preparaQuatro(nova);
              break;
        case 5:
            return  preparaCinco(nova);
               break;
        default:
          //
      }
 function preparaDois(nova){
    if (nova[0]==1){
        completo[posisao] = dezenaDez[nova]                        
     }
    if (nova[0]>=2){
        completo[posisao] = (dezena[nova[0]]==0 ? "" : dezena[nova[0]])
                           +(iniciais[nova[1]]==0 ? "" :" e "+iniciais[nova[1]])
    } 
    return completo[posisao]
 }
 function preparaTres(nova){
     //aqui por serem tres numeros, estou verificando se a segunda posição do vetor é,
     //caso seja vou decidir por qual vetor fazer a montagem, pois se deixar a busca na casa de iniciais
     // o valor 16 ficara {um e seis}, esse processo é verificado em todas as duas últimas casas do processo
    if (nova[1]==1){
        aux = dezenaDez[(nova[1]+nova[2])] 
        completo[posisao] = centena[nova[0]]+" e "
                            +aux
    }else{                  //esse if são para esconder o zero e não deixar a saída com a msg undefined
                            //isso é feito nas outras funções
        completo[posisao] = (centena[nova[0]]==0 ? + "" : centena[nova[0]])+ " "
                            +(dezena[nova[1]] == 0 ? "" :" e "+ dezena[nova[1]])
                            +(iniciais[nova[2]] == 0 ? "" : " e "+iniciais[nova[2]])
    } 
    return completo[posisao]
 }
 function preparaQuatro(nova){
     //visto que o vetor vai aumentando, a busca pela posição da casa decimal muda
    if (valor[2]==1){
        aux = dezenaDez[(nova[2]+nova[3])] 

        completo[posisao] = iniciais[nova[0]]+" mil "
                            +(centena[nova[1]]==0 ? "" :centena[nova[1]])+" e "
                            +aux
    }else{
        completo[posisao] = iniciais[nova[0]]+" mil "
                            +(centena[nova[1]] == 0 ? "": centena[nova[1]]) + ""
                            +(dezena[nova[2]] == 0 ? "" :" e "+ dezena[nova[2]])
                            +(iniciais[nova[3]] == 0 ? "" : " e "+iniciais[nova[3]])
    } 
    return completo[posisao]
 }
 function preparaCinco(nova){
     //troca de vetor de dezenas por dezenazDez
    if (valor[3]==1){
        aux = dezenaDez[(nova[3]+nova[4])] 
        completo[posisao] = (nova[1] == 0 ?dezena[nova[0]]+" mil e ":dezena[nova[0]]+ " e ")+
                            (iniciais[nova[1]]==0 ?"":iniciais[nova[1]]+" mil e ")
                            +(centena[nova[2]]==0?"":centena[nova[2]]+" e ")
                            +aux
    }else if (nova[0]==1){
        //aqui é outro tratamento para escolher o vetor, pois nesse caso as duas
        // primeiras casas variam, em escolher por exemplo 50 -> cinquenta, mas se começar com
        //o valor 16, já se sabe que trata-se de dezesses mil e não 'um e seis', fazendo a troca de vetor
        aux = dezenaDez[(nova[0]+nova[1])] 
        completo[posisao] = aux +" mil "
                            +centena[nova[2]]+" "
                            +(dezena[nova[3]] == 0 ? "" :" e "+ dezena[nova[3]])
                            +(iniciais[nova[4]] == 0 ? "" : " e "+iniciais[nova[4]])
    }else{    
        completo[posisao] = (nova[1] == 0 ?dezena[nova[0]]:dezena[nova[0]]+ " e ")+
                            (iniciais[nova[1]]== 0? "" +" mil ": iniciais[nova[1]]+" mil ")
                            +(centena[nova[2]]== 0? "":centena[nova[2]]+"")
                            +(dezena[nova[3]] == 0 ? "" :" e "+ dezena[nova[3]])
                            +(iniciais[nova[4]] == 0 ? "" : " e "+iniciais[nova[4]])
     } 
     return completo[posisao]
 }
}