jQuery('document').ready(function($)
{
    var menuBtn = $('.manu-icon');
    var clientes = new array();
    var cantidad_clientes = 0;

    function persona(nombre, email, website, comentario) {
        this.nombre = nombre;
        this.email = email;
        this.website = website;
        this.comentario = comentario;
        this.bio = function () {
            alert("nombre: " + this.nombre + "\nemail: " + this.email + "\nwebsite: " + this.website + "\ncomentario: " + this.comentario);
            alert("se envio el mensaje");
        };
    }

    $("#botonenviar").click(function () {
        console.log("Entro aqui");
        var nombre = prompt("Ejemplo");
        var email = document.getElementById("email").value();
        var website = document.getElementById("website").value();
        var comentario = document.getElementById("message").value();
        var cliente = new persona(nombre, email, website, comentario);
        if ("clientes" in localStorage) {
            var clientes = localStorage.getItem("clientes");
            clientes = JSON.parse(clientes);
            var elemnt = clientes.length;
            clientes.push(cliente);
        } else {
            var clientes = new Array();
            clientes.push(cliente);
        }
        alert("El Registro fue agregado");
        localStorage.setItem("clientes", JSON.stringify(clientes));

    });
});