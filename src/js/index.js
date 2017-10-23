/**
 * Created by chenhm on 29/09/2017.
 */

$('#add-rule').on('click',function () {
    $.ajax({
        url:'/add',
        data:{
            query: $('input[name=query]').val(),
            desc: $('input[name=desc]').val()
        },
        success:function (data) {
            if(data.success) window.location.reload();
        }
    })
});




