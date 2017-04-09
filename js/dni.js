var dni = "";

$(document).ready(function() {

    $("#dni").mask('00.000.000');

	/** ABIR Y CERRAR MENU **/
    $("#btn-dni").click(function() {
        dni = $("#dni").val();

        Cookies.set('cookie-dni', dni, {expires: 9000});

        alert(Cookies.get('cookie-dni'));
    });
});