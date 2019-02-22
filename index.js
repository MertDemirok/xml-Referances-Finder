$(function () {
    bs_input_file();
});

function bs_input_file() {
    $(".input-file").before(
        function () {
            if (!$(this).prev().hasClass('input-ghost')) {
                var element = $("<input type='file' class='input-ghost' style='visibility:hidden; height:0'>");
                element.attr("name", $(this).attr("name"));
                element.change(function () {
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function () {
                    element.click();
                });
                $(this).find("button.btn-reset").click(function () {
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor", "pointer");
                $(this).find('input').mousedown(function () {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                
                return element; 
            }
        }
    );
}

function optionPush() {
    
    var local_Path = $("#local-path")[0].value;
    var operations_name = $("#operations")[0].value;
    var service_type = $("#service-type")[0].value;
    var data = {
        serviceType:service_type,
        oparation: operations_name, //option use
        localProjectPath: local_Path,
    };


    $.ajax({
        type: 'POST',
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        url: '/options',
        data: JSON.stringify(data),
        success: function(msg){
            alert('Export Excel Done' + msg);
        }
    });
   
  
   
 

}

