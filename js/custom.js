//Mostrar elemento de carga mientras se hace una petición
let loading = "<div class=\"preloader d-flex align-items-center justify-content-center\">\n" +
    "    <div class=\"lds-ellipsis\">\n" +
    "        <div></div>\n" +
    "        <div></div>\n" +
    "        <div></div>\n" +
    "        <div></div>\n" +
    "        <div></div>\n" +
    "    </div>\n" +
    "</div>"

$(document).ready(function(){

    // Div para mostrar registros
    let $regs = $("#divIndexRegs");
    // Dominio local donde se esta cargando la pagina
    let domain = document.domain;
    // Dominio donde esta el apirest
    let extDomain = "http://127.0.0.1:8000/";
    // Contenedor para cargar las paginas dinamicamente
    let $container = $("#container");
    // Div para mostrar mensajes al usuario
    let $message = $("#divIndexMessage");
    // Botones de paginacion
    let $pags = null

    //Ontener pagina actual si la cookie esta guardada o no
    let page=0;
    //Si la pagina no se ha establecido se asume la pagina 1
    if(document.cookie.indexOf('page=') === -1) page = 1
    else{
        //Si el resultado de la página no es numero se sume pagina 1
        page = parseInt(document.cookie.substring(5,6));
        page = isNaN(page) ? 1 : page
    }

    request(extDomain + "api/services?page="+page,null,'GET',null,function(json){
        pagination(json,page);

        // Botones de paginacion
        $pags = $("#ulIndexPagination a[class='page-link']")
        //Interceptar click en botones de paginacion
        if($pags.length){
            $pags.click(function(){
                let page = $(this).data("page");
                document.cookie = "page="+page;
                location.reload();
            })
        }

        /*******************************************************************/
        /* Cargar el listado de registros */
        if(json.data.length){
            regsIndex(json.data,$regs);
        }else{
            $regs.html("<div class=\"alert alert-warning\">No hay registros</div> ");
        }

        /*******************************************************************/
        /* Asignar las funciones de cada uno de los registros */
        //Variables de los botones del registro
        let $btnver = $("button [name='btnver']");
        let $btneditar = $("button[name='btneditar']");
        let $btnborrar = $("button[name='btnborrar']");

        /*******************************************************************/
        /* Visualizar un registro */
        if($btnver.length) {
            $btnver.click( function(){
                let id = $(this).data("id");
                $.get( "http://"+domain+"/jqCrud_show.html", function( data ) {
                    $container.html(data);
                    //Petición de la ruta Show del API
                    request(extDomain + "api/services/"+id,null,"GET",null,function(json){
                        //Mostrar los datos recibidos del Api
                        $("#tdShowNombrep").html(json.nombrep);
                        $("#tdShowCategoria").html(json.categoria);
                        $("#tdShowImagen").html(json.imagen);
                        $("#tdShowPrecio").html(json.precio);
                        $("#tdShowDescripcion").html(json.descripcion);
                    })
                });
            })
        }

        /*******************************************************************/
        /* Modificar un registro */
        if( $btneditar.length ) {
            $btneditar.click( function(){
                let id = $(this).data("id");
                $.get( "http://"+domain+"/jqCrud_create.html", function( data ) {
                    $container.html(data);
                    $("#divTituloCreate").html("Modificar Servicio Existente");
                    $("#btnCreateAgregar").html("Modificar")
                        .attr("class","btn btn-warning");
                    request(extDomain + "api/services/"+id,null,"GET",null,function(json){
                        $("#formCreate input[name='nombrep']").val(json.nombrep);
                        $("#formCreate input[name='categoria']").val(json.categoria);
                        $("#formCreate input[name='imagen']").val(json.imagen);
                        $("#formCreate input[name='precio']").val(json.precio);
                        $("#formCreate textarea[name='descripcion']").html(json.descripcion);

                        let $btnCreateAgregar = $("#btnCreateAgregar");
                        $btnCreateAgregar.click( function(){
                            request(
                                extDomain + "api/services/"+id,
                                {"nombrep":$("#formCreate input[name='nombrep']").val(),
                                    "categoria":$("#formCreate input[name='categoria']").val(),
                                    "imagen":$("#formCreate input[name='imagen']").val(),
                                    "precio":$("#formCreate input[name='precio']").val(),
                                    "descripcion":$("#formCreate textarea[name='descripcion']").html(),
                                    "_method":"PATCH"},
                                "PUT",
                                {'Content-Type': 'application/x-www-form-urlencoded'},
                                function(json){
                                    alert(json.message);
                                    location.reload();
                                }
                            )
                        })
                    });

                });
            })
        }

        /*******************************************************************/
        /* Borrar un registro */
        if( $btnborrar.length ) {
            $btnborrar.click( function(){
                let id = $(this).data("id");
                if(confirm("Desea Borrar El Registro?")){
                    request(extDomain + "api/services/"+id,null,"DELETE",null,function(json){
                            $("div[data-id='"+id+"'").remove();
                            $message.html(json.message);
                        }
                    )
                }
            })
        }
    });


    /*******************************************************************/
    /* Crear un registro */
    let $btncrear = $("#btncrear");

    if( $btncrear.length ) {
        $btncrear.click( function(){
            $.get("http://"+domain+"/jqCrud_create.html", function( data ){
                $container.html(data);
                let $btnCreateAgregar = $("#btnCreateAgregar");
                $btnCreateAgregar.click( function(){
                    request(
                        extDomain + "api/services",
                        {"nombrep":$("#formCreate input[name='nombrep']").val(),
                            "categoria":$("#formCreate input[name='categoria']").val(),
                            "imagen":$("#formCreate input[name='imagen']").val(),
                            "precio":$("#formCreate input[name='precio']").val(),
                            "descripcion":$("#formCreate textarea[name='descripcion']").html()},
                        "POST",
                        {},
                        function(json){
                            let $divIndexMessage = $("#divIndexMessage");
                            $divIndexMessage.html(json.message);
                            $divIndexMessage.attr("class","col-12 alert alert-success d-block");
                            $("#formCreate input[name='nombrep']").val("");
                            $("#formCreate input[name='categoria']").val("");
                            $("#formCreate input[name='imagen']").val("");
                            $("#formCreate input[name='precio']").val("");
                            $("#formCreate textarea[name='descripcion']").html("");

                        }
                    )
                })
            })
        })
    }

    //Borrar la cookie al momento de cerrar el navegador
    // se espera que funcione tambien con el cierre de la pestaña.
    $(window).unload(function() {
        document.cookie = "";
    });
})

function request(urlExt, dataExt, method, dataHeaders, fSuccess){
    //urlExt: Hace referencia a la url a la que se va a enviar la peticion
    //dataExt: Datos que se van a enviar al servidor
    //method: metodo HTTP para hacer la petición al servidor.
    //dataHeaders: Encabezados para ser enviados al servidor
    //fSuccess: Función para atender el resultado de la petición

    //Establecer headers por defecto
    if(dataHeaders == null){
        dataHeaders = {
            "Content-Type":"application/json",
        }
    }

    showLoading();
    $.ajax({
        url : urlExt,
        data : dataExt,
        type : method,
        headers: dataHeaders,
        dataType : 'json',
        success : fSuccess,
        error : function(jqXHR, status, error) {
            //En caso de obtener un error, por ejemplo de validacion del API
            if(jqXHR.status > 400 && jqXHR.status < 500){
                //Se hace referencia al objeto donde se debe mostrar el mensaje
                let $message = $("#divIndexMessage");
                $message.html("");
                //Se cambia el estilo para mostrar el mensaje
                $message.attr("class","col-12 alert alert-danger d-block");
                //Se verifica si se obtiene un mensaje y se muestra
                if(jqXHR.responseJSON.message.length){
                    $message.append("<p>Error:--"+jqXHR.responseJSON.message+"</p>");
                    //Se verifica cada uno de los errores que de validación proceden
                    $.each( jqXHR.responseJSON.errors, function( key, value ) {
                        $message.append("<p class='mx-0 my-0 px-0 py-0'>"+key+"</p>"+"<ul>");
                        for(let i=0;i<value.length;i++)
                            $message.append("<li>"+value[i]+"</li>");
                        $message.append("</ul>");
                    })
                }
            }
            //Esto se tiene para mirar como viene el mensaje desde el API para poderlo mostrar
            console.log(jqXHR);
            console.log("status:--",status);
            console.log("error:--",error);
        },
        complete : function(jqXHR, status) {
            $("#loading").fadeOut("slow");
            //alert('Petición realizada');
        }
    });
}

function showLoading(){
    let $divloading = $("#loading")
    $divloading.hide();
    $divloading.html(loading);
    $divloading.fadeIn("slow");
}

function regsIndex(data,$regs){
    //Mostrar la lista de registros obtenidos del API.
    //data: Donde provienen los registros obtenidos del API.
    //$regs: Div donde se van a mostrar los registros.
    //Por cada registro es necesario agregar un juego de botones
    // para ejecutar las funciones propias de dicho registro.
    //Para identificar el botón de dónde procede la petición y a qué registro.
    //Se incluye la propiedad data-id (data- de propiedad personalizada).
    //Igualmente se hace referencia a la fila del registro, para cuando
    // se ejecuta el comando de borrar se elimine dinámicamente la fila correspondiente.

    for(let i=0;i<data.length;i++){
        $regs.html( $regs.html() +

            "<div data-id=\""+data[i].id+"\" class=\"row\">\n" +
            "<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center\">"+data[i].id+"</div>\n" +
            "<div class=\"col-lg-3 col-md-3 col-sm-3 col-xs-3 text-center\">"+data[i].nombrep+"</div>\n" +
            "<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center\">"+data[i].categoria+"</div>\n" +
            "<div class=\"col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center\">"+data[i].precio+"</div>\n" +

            "<div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1 t\">\n" +
            "<button name=\"btnver\" data-id=\""+data[i].id+"\"  class=\"btn btn-info btn-responsive\"  >\n" +
            "<span>\n"+
            "<i class=\"fa fa-eye\"></i> Ver</span>\n" +
            "<i class=\"fa fa-plus \"></i>\n"+
            "</button>\n" +
            "</div>\n" +

            "<div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1  \">\n" +
            "<button name=\"btneditar\" data-id=\""+data[i].id+"\" class=\"btn btn-warning btn-responsive \" >\n" +
            "<span>\n"+
            "<i class=\"fa fa-pencil\"></i> Editar</span>\n" +
            "<i class=\"fa fa-plus \"></i>\n"+
            "</button>\n" +
            "</div>\n" +

            "<div class=\"col-lg-1 col-md-1 col-sm-1 col-xs-1 \">\n" +
            "<button name=\"btnborrar\" data-id=\""+data[i].id+"\" class=\"btn btn-danger btn-responsive \" >\n" +
            "<span>\n"+
            "<i class=\"fa fa-trash\"></i> Borrar</span>\n" +
            "<i class=\"fa fa-plus \"></i>\n"+
            "</button>\n" +
            "</div>\n" +

            "</div>\n"
        );
    }
}

function pagination(json,pageActive){
    //Generar manejo de paginación
    //1. Asignar la función de atención a los botones creados
    //   por pagina, previo y proximo.
    //2. Almacenar en cookies el numero de pagina actual, para
    //   que en la recarga se cargue dicha pagina.
    //3. Generar los numeros de pagina segun cantidad de registros

    json.prev_page = 0 ? null : json.prev_page
    json.last_page = 0 ? null : json.last_page

    // Crear la la lista de numeros de acuerdo a la información recibida
    // y establecer la página activa actualmente.
    let pages = "";

    for(let i=1;i<=json.last_page;i++)
        pages += "<li class=\"page-item "+(pageActive===i ? "active" : "")+"\"><a class=\"page-link\" data-page=\""+i+"\" href=\"#\">"+i+"</a></li>\n"

    let code = "<li class=\"page-item\">\n" +
        "<a class=\"page-link\" href=\"#\" data-page=\""+json.prev_page+"\" aria-label=\"Previous\">\n" +
        "<span aria-hidden=\"true\">&laquo;</span>\n" +
        "<span class=\"sr-only\">Previous</span>\n" +
        "</a>\n" +
        "</li>\n" +
        pages +
        "<li class=\"page-item\">\n" +
        "<a class=\"page-link\" href=\"#\" data-page=\""+json.last_page+"\" aria-label=\"Next\">\n" +
        "<span aria-hidden=\"true\">&raquo;</span>\n" +
        "<span class=\"sr-only\">Next</span>\n" +
        "</a>\n" +
        "</li>"

    // Agregar el codigo generado en el control de navegacion
    $("#ulIndexPagination").html(code);
}
