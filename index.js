$(function () {
    $("#serviceType").hide();
    $(".card").hide();
    bs_input_file();

});




$("#operations").click(function () {
       
        if($("#operations")[0].value == 'findEndPoints'){
            $("#serviceType").show();
        }else{
            $("#serviceType").hide();
        }
    });


    $("#help").click(function () {
            $(".card").toggle();
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
                   
                    //eklenecek
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
    var project_name = $("#project-name")[0].value;
    var oracle_Version = $("#oVersion")[0].value;
    
    var data = {
        serviceType: service_type,
        oparation: operations_name, //option use
        localProjectPath: local_Path,
        projectName: project_name,
        oVersion: oracle_Version
    };


    $.ajax({
        type: 'POST',
        contentType: "application/x-www-form-urlencoded;charset=utf-8",
        url: '/options',
        data: JSON.stringify(data),
        success: function (msg) {
            $(".text-justify-response")[0].value = "Export Excel Done";

            alert('Export Excel Done' + msg);

        }
    });


}

