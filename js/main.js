var cPregunta=1;
var score=0;
var evaluando=false;
var revisando=false;
function inicializaCuestionario(){
    cPregunta = 1;
    score=0;
    revisando = false;
    //Quita seleccion
    $('ul.respuesta li.selected').removeClass('selected');
    $('.cuestionario .retro').hide().removeClass('info error ok');
    $('#instrucciones').show();
    muestraPreguntaActual();
    $('.opciones .draggable').draggable('enable');
    $('.opciones .draggable').css({'left':0, 'top':0});    
}

function muestraPreguntaActual(){
    evaluando=false;
    $('.cuestionario .pregunta').removeClass('active');    
    $('.cuestionario .pregunta[data-id="' + cPregunta + '"]').addClass('active');
    if (cPregunta==1){
        $('#instrucciones').show();
        $('#contNext').show();
        $('#contRev').hide();
    }
    if (cPregunta==4){
        $('#instrucciones').hide();
        $('#contNext').hide();
        $('#contRev').show();
        $('#score').text( Math.round((score/3)*100.0));
    }
    //var $pregunta = $('.cuestionario .pregunta.active');
    //$('.cuestionario .retro', pregunta).hide().removeClass('info error ok');
}

function avanzaPregunta(){
   if (revisando){
       cPregunta++;
       muestraPreguntaActual();
       return;
   }

    if (evaluando) {
        return;//prevent doubleclick
    }
    var $pregunta = $('.cuestionario .pregunta.active').first();
    var tipoPregunta = $pregunta.hasClass('opcion')?'opcion':'arrastre';
    var retro='';
    var tipoRetro = 'info'; // info|error|ok
    var r=null;
    if (tipoPregunta=='opcion'){
        //ha seleccionado
        var $seleccion = $pregunta.find('li.selected');
        if ($seleccion.length==0){
            retro = 'Elige una respuesta antes de enviarla.';
        }else{
            r = $seleccion.data('v');            
        }
    }else{
        var value = $('.droppable',$pregunta).data('v')
        if (value>=0){
            r = value;
        }else{
            retro = 'Elige una respuesta antes de enviarla.';
        }
    }
    
    if (r!= null){
        if ( r==0){
            tipoRetro ='error';
            retro='Tu respuesta fue incorrecta, te recomiendo volver a revisar el contenido de esta Lección.';
        }else{
            tipoRetro='ok';
            retro ='Felicidades, seleccionaste la respuesta correcta.';
        }
        score += r;
    }
    

    showRetro($pregunta, tipoRetro, retro);
}

function selectRespuesta(){
    var $el= $(this);
    var $padre = $el.parent('.respuesta');
    $('li',$padre).removeClass('selected');
    $el.addClass('selected');
}

function showRetro(pregunta,tipoRetro, retro){    
    $('.retro', pregunta).show().addClass(tipoRetro).html(retro);
    if (tipoRetro != 'info'){
        evaluando = true;
        setTimeout(function(){ 
            cPregunta++; 
            muestraPreguntaActual();
        },1500);
    }
}

function Revisar(){
    revisando = true;
    cPregunta =1;
    muestraPreguntaActual();
}

function IniciaDiapositivas(){
    inicializaCuestionario();
}

$(function(){
    $('.subSlide').click(function(){
        var goto =  $(this).data('sub');
        $('.subsected .wrap[data-sub]').addClass('hidden');
        $('.subsected .wrap[data-sub="' + goto  + '"]').removeClass('hidden');
    });
    $('#btnNext').click(avanzaPregunta);
    $('#btnRev').click(Revisar);
    $('#btnLeccion').click(function(){
        window.ws.goToSlide(0,true);
        inicializaCuestionario();
    });
    
    $('ul.respuesta >li').click(selectRespuesta);
    $('.opciones .draggable').draggable();
    $('.planteamiento .droppable').droppable({
        classes: {
            "ui-droppable-active": "ui-state-active",
            "ui-droppable-hover": "ui-state-hover"
          },
          drop: function( event, ui ) {
            $(this).data('v',ui.draggable.data('v'));
            $('.opciones .draggable').draggable('disable');
          }
    })

})