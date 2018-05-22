$(function(){
    $('.subSlide').click(function(){
        var goto =  $(this).data('sub');
        $('.subsected .wrap[data-sub]').addClass('hidden');
        $('.subsected .wrap[data-sub="' + goto  + '"]').removeClass('hidden');
    })
})