$(document).ready(function () {

    /////////////////////////////////// GLOBALES /////////////////////////////////////////////////

    /* Cariables Globales */
    let MortyCards = [];
    let MortyCardsTemp = [];
    let MortySelected = {};
    let MortyBusqueda = [];
    let MortyNew = {};

    /* Método inicial  */
    obtenerDatos();

    /////////////////////////////////// LLAMADAS /////////////////////////////////////////////////

    /* Localiza el Morty seleccionado para editar o eliminar */
    $('body').on('click', '.card', function () {
        $(".full").addClass("fullOpen");
        id = $(this).attr("value");

        /* Busca los datos de la carta seleccionada y los pasa a la ventana de opciones */
        MortySelected = MortyCards.find(Mortycard => Mortycard.id == id);

        $(".name_b").text(MortySelected.name);
        $(".dimension_b").text(MortySelected.dimension);
        $(".type_b").text(getTypeName(MortySelected.type));
        $(".attack_b").text("Ataque: " + MortySelected.attack);
        $(".def_b").text("Defensa: " + MortySelected.def);
        $(".velocidad_b").text("Velocidad: " + MortySelected.vel);
        $(".ps_b").text("Ps: " + MortySelected.ps);
        $(".xp_b").text("Xp: " + MortySelected.xp);
        $(".picMor_b").attr("src", "./img/mortys/" + MortySelected.image + ".png");
        $(".picMor_b").attr("value", MortySelected.image);

        /* Agrega color a la carta y al titulo segun el tipo */
        $(".content").css("background-color", getHexaCard(MortySelected.typeCard));
        $(".content").children(".stats").children(".type_b").css("color", getHexaTitle(MortySelected.titleColor));

    });

    /* Cierra ventana de edición */
    $("#close").on("click", function () {
        cierraVentanaOpciones();
    });

    /* Botón de agregar nuevo Morty */
    $("#add").on("click", function () {

        /* Elimina el texto estático y lo convierte en input para poder editar */
        $('.content').children(".stats").contents().remove();

        /* Crea una plantilla en la ventana de agregar nuevo */
        plantillaNuevoMorty();

        /* Abre la ventana de agregar nuevo y sus opciones */
        $(".full").addClass("fullOpen");
        $(".aceptar_add").addClass("show");
        $(".options").removeClass("show");
    });

    /* Al hacer clic en la imagen al editar o crear nuevo abre el menu de skins */
    $('body').on('click', '.pic_Select', function () {
        $(".full_p").addClass("fullOpen");
    });
    /*cierra el menu de skins */
    $('body').on('click', '#close_p', function () {
        $(".full_p").removeClass("fullOpen");
    });
    /* Selecciona una skin y la pasa a la ventana de editar, además guarda el valor para poderlo actualizar en la base de datos */
    $('body').on('click', '.card_pic', function () {
        let pic_s = $(this).attr("value");
        $(".picMor_b").attr("src", './img/mortys/' + pic_s + '.png');
        $(".picMor_b").attr("value", pic_s);
        $(".full_p").removeClass("fullOpen");
    });

    /* Al cambiar de valor el tipo de carta en la ventana de edición, cambia el color del fondo */
    $('body').on('change', '#tiposOptions', function () {
        var tipo_s = this.value;
        switch (tipo_s) {
            case "1":
                $(".content").css("background-color", "#e3e6e3");
                break;
            case "2":
                $(".content").css("background-color", "#d2fdd0");
                break;
            case "3":
                $(".content").css("background-color", "#f9f8ad ");
                break;
            case "4":
                $(".content").css("background-color", "#eacbff");
                break;
            default:
                $(".content").css("background-color", "#e3e6e3");
        }

    });

    /* Botón de editar Morty */
    $("#edit").on("click", function () {

        /* Elimina el texto estático y lo convierte en input para poder editar */
        $('.content').children(".stats").contents().remove();

        convierteEstaticoInput();

        /* Regresa a la vetana de opciones  */
        $(".aceptar").addClass("show");
        $(".options").removeClass("show");
        $(".picMor_b").addClass("pic_Select");

    });
    /* Acepta editar un morty ya existente */
    $("#acept").on("click", function () {

        let url = "https://j7wdmxfgs2.execute-api.us-east-2.amazonaws.com/Produccion/tabla-mortys";

        /* Obtiene los datos de los inputs */
        let nombre_s = $("#nombre_s").val();
        let dimension_s = $("#dimensionsOptions").val();
        let tipo_s = $("#tiposOptions").val();
        let ataque_s = $("#ataque_s").val();
        let def_s = $("#def_s").val();
        let velocidad_s = $("#velocidad_s").val();
        let ps_s = $("#ps_s").val();
        let xp_s = $("#xp_s").val();
        let pic_sa = $(".pic_Select").attr("value");

        /* Crea un nuevo objeto con los nuevos datos para enviarlo a sustituirlo a la base de datos según el id */
        let obj = new Object();
        obj.id = parseInt(id);
        obj.name = nombre_s;
        obj.dimension = dimension_s;
        obj.type = tipo_s;
        obj.attack = ataque_s;
        obj.def = def_s;
        obj.vel = velocidad_s;
        obj.ps = ps_s;
        obj.xp = xp_s;
        obj.image = pic_sa;
        obj.typeName = getTypeName(tipo_s);
        obj.titleColor = getTitleColor(tipo_s);
        obj.typeCard = getTypeCard(tipo_s);
        obj.sta = "1";

        $.ajax({

            type: 'PUT',
            dataType: "json",
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(obj),
            headers: {
                "X-Api-Key": "IyccUQag73IAkM39m6Pv5EysOnSkWCA4eXJXAsx1"
            },
            url: url,
            success: function (res) {



                /* Guarda la edición y convierte los inputs a estáticos */
                $('.content').children(".stats").contents().remove();
                $('.main').children(".cards").contents().remove();

                /* Modifica el array de objetos y actualiza el dom */
                updateCard(obj);

                /* Modifica y regresa a la ventana de opciones*/
                $(".aceptar").removeClass("show");
                $(".options").addClass("show");
                $(".picMor_b").removeClass("pic_Select");
            },
            error: function (data) {
                console.log('in error');
                console.log(data);
            }

        });

    });

    /* Elimina un Morty seleccionado*/
    $("#delete").on("click", function () {

        let url = "https://j7wdmxfgs2.execute-api.us-east-2.amazonaws.com/Produccion/tabla-mortys";

        let obj = new Object();
        obj.id = id;

        $.ajax({

            type: 'DELETE',
            dataType: "json",
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(obj),
            headers: {
                "X-Api-Key": "IyccUQag73IAkM39m6Pv5EysOnSkWCA4eXJXAsx1"
            },
            url: url,
            success: function (res) {
                console.log(res);
                $('.main').children(".cards").contents().remove();

                /*Elimina del array de objetos el Morty y actualiza el dom */
                deleteCard(obj);

                /* Cierra el menu de opciones */
                $(".full").removeClass("fullOpen");
            },
            error: function (data) {
                console.log('in error');
                console.log(data);
            }

        });

    });

    /* Agrega un nuevo Morty en la base de datos*/
    $("#acept_add").on("click", function () {

        let url = "https://j7wdmxfgs2.execute-api.us-east-2.amazonaws.com/Produccion/tabla-mortys";

        /* Obtiene los datos de los inputs */
        var d = new Date();
        let id_s = d.valueOf();
        let nombre_s = $("#nombre_s").val();
        let dimension_s = $("#dimensionsOptions").val();
        let tipo_s = $("#tiposOptions").val();
        let ataque_s = $("#ataque_s").val();
        let def_s = $("#def_s").val();
        let velocidad_s = $("#velocidad_s").val();
        let ps_s = $("#ps_s").val();
        let xp_s = $("#xp_s").val();
        let pic_s = $(".pic_Select").attr("value");

        MortyNew = new Object();
        MortyNew.id = id_s;
        MortyNew.name = nombre_s;
        MortyNew.dimension = dimension_s;
        MortyNew.type = tipo_s;
        MortyNew.attack = ataque_s;
        MortyNew.def = def_s;
        MortyNew.vel = velocidad_s;
        MortyNew.ps = ps_s;
        MortyNew.xp = xp_s;
        MortyNew.image = pic_s;
        MortyNew.sta = "1";

        $.ajax({

            type: 'POST',
            dataType: "json",
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(MortyNew),
            headers: {
                "X-Api-Key": "IyccUQag73IAkM39m6Pv5EysOnSkWCA4eXJXAsx1"
            },
            url: url,
            success: function (res) {
                createObjects(MortyNew);
                processAfterNewCard();
            },
            error: function (data) {
                console.log('in error');
                console.log(data);
            }

        });

    });


    /* Búsca por nombre cada vez que cambia el valor del input si el input esta vacio renderiza todas las cartas */
    $("#buscar").keyup(function(){
        let text = $(this).val();
        MortyBusqueda = MortyCards.filter(Morty => Morty.name.toLowerCase().includes(text));
        if(text != ""){
            renderBuscarCartas(MortyBusqueda);
        }else{
            $('.main').children(".cards").contents().remove();
            renderCards();
        }
    });

    /////////////////////////////////// FUNCIONES /////////////////////////////////////////////////
    /* Renderiza las cartas encontradas en el dom */
    function renderBuscarCartas(cards){
        $('.main').children(".cards").contents().remove();
        cards.map(function (card) {
            $(".cards").append('<div class="card ' + card.typeCard + '" value="' + card.id + '">' +
                '<div class="pic">' +
                '<img value="card.image" src="./img/mortys/' + card.image + '.png" alt="" class="picMor">' +
                '</div>' +
                '<div class="stats">' +
                '<div class="name">' + card.name + '</div>' +
                '<div class="dimension">' + card.dimension + '</div>' +
                '<div class="type ' + card.titleColor + '">' + getTypeName(card.type) + '</div>' +
                '<div class="attack">Ataque: ' + card.attack + '</div>' +
                '<div class="def">Defensa: ' + card.def + '</div>' +
                '<div class="velocidad">Velocidad: ' + card.vel + '</div>' +
                '<div class="ps">Ps: ' + card.ps + '</div>' +
                '<div class="xp">Xp: ' + card.xp + '</div>' +
                '</div>' +
                '</div>');

        });
    }

    /* Obtiene todas las cartas desde la API en AWS */
    function obtenerDatos() {
        let url = "https://j7wdmxfgs2.execute-api.us-east-2.amazonaws.com/Produccion/tabla-mortys";
        $.ajax({
            type: 'GET',
            dataType: "json",
            contentType: 'application/json',
            crossDomain: true,
            headers: {
                "X-Api-Key": "IyccUQag73IAkM39m6Pv5EysOnSkWCA4eXJXAsx1"
            },
            url: url,
            success: function (rests) {
                // console.log('response in GET:');
                rests.body.map(function (rest) {
                    createObjects(rest);
                });
                console.log(MortyCards);
                renderCards();
            },
            error: function (data) {
                console.log('in error');
                console.log(data);
            }
        });
    }

    function deleteCard(obj) {
        MortyCardsTemp = [];

        MortyCards.map(function (Morty) {
            if (Morty.id != obj.id) {
                MortyCardsTemp.push(Morty);
            }
        });
        MortyCards = MortyCardsTemp;
        renderCards();
    }

    function updateCard(obj) {
        MortyCardsTemp = [];
        MortySelected = new Object();

        MortyCards.map(function (Morty) {
            if (Morty.id == obj.id) {
                MortyCardsTemp.push(obj);
                Object.assign(MortySelected, obj);
            } else {
                MortyCardsTemp.push(Morty);
            }

        });
        MortyCards = MortyCardsTemp;
        renderCards();
        convierteInputsEnEstaticos();
    }

    /* Convierte los inputs a estáticos y actualiza el dom */
    function processAfterNewCard() {

        $('.content').children(".stats").contents().remove();
        $('.main').children(".cards").contents().remove();

        renderCards();
        convierteInputsEnEstaticos();

        $(".full").removeClass("fullOpen");
        $(".aceptar_add").removeClass("show");
        $(".options").addClass("show");
        $(".picMor_b").removeClass("pic_Select");
    }

    function cierraVentanaOpciones() {
        /* Convierte los inputs a estáticos */
        $('.content').children(".stats").contents().remove();

        convierteInputsEnEstaticos();

        $(".full").removeClass("fullOpen");
        $(".aceptar").removeClass("show");
        $(".aceptar_add").removeClass("show");
        $(".options").addClass("show");
        $(".picMor_b").removeClass("pic_Select");
    }


    /* Pinta las Cards en el dom */
    function renderCards() {
        MortyCards.map(function (card) {
            $(".cards").append('<div class="card ' + card.typeCard + '" value="' + card.id + '">' +
                '<div class="pic">' +
                '<img value="card.image" src="./img/mortys/' + card.image + '.png" alt="" class="picMor">' +
                '</div>' +
                '<div class="stats">' +
                '<div class="name">' + card.name + '</div>' +
                '<div class="dimension">' + card.dimension + '</div>' +
                '<div class="type ' + card.titleColor + '">' + getTypeName(card.type) + '</div>' +
                '<div class="attack">Ataque: ' + card.attack + '</div>' +
                '<div class="def">Defensa: ' + card.def + '</div>' +
                '<div class="velocidad">Velocidad: ' + card.vel + '</div>' +
                '<div class="ps">Ps: ' + card.ps + '</div>' +
                '<div class="xp">Xp: ' + card.xp + '</div>' +
                '</div>' +
                '</div>');

        });
    }

    function convierteInputsEnEstaticos() {
        $(".content").children(".stats").append('<div class="name name_b">' + MortySelected.name + '</div>' +
            '<div class="dimension dimension_b">' + MortySelected.dimension + '</div>' +
            '<div class="type type_b">' + getTypeName(MortySelected.type) + '</div>' +
            '<div class="attack_b">Ataque: ' + MortySelected.attack + '</div>' +
            '<div class="def_b">Defensa: ' + MortySelected.def + '</div>' +
            '<div class="velocidad_b">Velocidad: ' + MortySelected.vel + '</div>' +
            '<div class="ps_b">Ps: ' + MortySelected.ps + '</div>' +
            '<div class="xp_b">Xp: ' + MortySelected.xp + '</div>');

        $(".content").css("background-color", getHexaCard(MortySelected.typeCard));
        $(".content").children(".stats").children(".type_b").css("color", getHexaTitle(MortySelected.titleColor));
    }

    function convierteEstaticoInput() {
        $(".content").children(".stats").append('<div class="name"><input type="text" id="nombre_s" value="' + MortySelected.name + '"></div>' +
            '<div class="dimension">' +
            '<select id="dimensionsOptions">' +
            '<option value="Mortopia" selected>Mortopia</option>' +
            '<option value="Mortyland">Mortyland</option>' +
            '<option value="Plumbubo Prime 51b">Plumbubo Prime 51b</option>' +
            '<option value="GF Mortanic" >GF Mortanic</option>' +
            '</select>' +
            '</div>' +
            '<div class="type">' +
            '<select id="tiposOptions">' +
            '<option value="1" >Común</option>' +
            '<option value="2">Raro</option>' +
            '<option value="3">Épico</option>' +
            '<option value="4">Exótico</option>' +
            '</select>' +
            '</div>' +
            '<div class="attack">Ataque: <input id="ataque_s" type="text" value="' + MortySelected.attack + '"></div>' +
            '<div class="def">Defensa: <input id="def_s" type="text" value="' + MortySelected.def + '"></div>' +
            '<div class="velocidad">Velocidad: <input id="velocidad_s" type="text" value="' + MortySelected.vel + '"></div>' +
            '<div class="ps">PS: <input id="ps_s" type="text" value="' + MortySelected.ps + '"></div>' +
            '<div class="xp">XP: <input id="xp_s" type="text" value="' + MortySelected.xp + '"></div>');

        $('#tiposOptions option[value="' + MortySelected.type + '"]').attr('selected', 'selected');
        $('#dimensionsOptions option[value="' + MortySelected.dimension + '"]').attr('selected', 'selected');
    }

    function plantillaNuevoMorty() {
        $(".content").children(".stats").append('<div class="name"><input id="nombre_s" type="text" value="Morty"></div>' +
            '<div class="dimension">' +
            '<select id="dimensionsOptions">' +
            '<option value="Mortopia" selected>Mortopia</option>' +
            '<option value="Mortyland">Mortyland</option>' +
            '<option value="Plumbubo Prime 51b">Plumbubo Prime 51b</option>' +
            '<option value="GF Mortanic" >GF Mortanic</option>' +
            '</select>' +
            '</div>' +
            '<div class="type">' +
            '<select id="tiposOptions">' +
            '<option value="1" selected>Común</option>' +
            '<option value="2">Raro</option>' +
            '<option value="3">Épico</option>' +
            '<option value="4">Exótico</option>' +
            '</select>' +
            '</div>' +
            '<div class="attack">Ataque: <input id="ataque_s" type="text" value="0"></div>' +
            '<div class="def">Defensa: <input id="def_s" type="text" value="0"></div>' +
            '<div class="velocidad">Velocidad: <input id="velocidad_s" type="text" value="0"></div>' +
            '<div class="ps">PS: <input id="ps_s" type="text" value="0"></div>' +
            '<div class="xp">XP: <input id="xp_s" type="text" value="0"></div>');

        $(".picMor_b").attr("src", "./img/mortys/normal.png");
        $(".picMor_b").attr("value", "normal");
        $(".picMor_b").addClass("pic_Select");
        $(".content").css("background-color", "#e3e6e3");
    }

    /* Guarda todos los Mortys que se obtienen de la base de datos en un array de objetos */
    function createObjects(object) {
        MortyCards.push({
            "id": object.id,
            "name": object.name,
            "dimension": object.dimension,
            "type": object.type,
            "attack": object.attack,
            "def": object.def,
            "vel": object.vel,
            "ps": object.ps,
            "xp": object.xp,
            "image": object.image,
            "typeName": getTypeName(object.type),
            "titleColor": getTitleColor(object.type),
            "typeCard": getTypeCard(object.type),
            "sta": object.status
        });
    }

    /* Obtiene el nombre segun el tipo(int) guardado en la base de datos  */
    function getTypeName(type) {
        switch (type) {
            case '1':
                type = "Común";
                break;
            case '2':
                type = "Raro";
                break;
            case '3':
                type = "Épico";
                break;
            case '4':
                type = "Exótico";
                break;
            case '5':
                type = "Legendario";
                break;
            default:
                type = "undefined";
        }
        return type;
    }

    /* Obtiene la clase para pintar el titulo de la Card */
    function getTitleColor(type) {
        let titleColor = "";
        switch (type) {
            case '1':
                titleColor = "titleComun";
                break;
            case '2':
                titleColor = "titleRara";
                break;
            case '3':
                titleColor = "titleEpic";
                break;
            case '4':
                titleColor = "titleExotic";
                break;
            default:
                titleColor = "titleComun";
        }
        return titleColor;
    }

    /* Obtiene la clase para pintar la Card  */
    function getTypeCard(type) {
        let typeCard = "";
        switch (type) {
            case '1':
                typeCard = "comunCard";
                break;
            case '2':
                typeCard = "raraCard";
                break;
            case '3':
                typeCard = "epicCard";
                break;
            case '4':
                typeCard = "exoticCard";
                break;
            default:
                typeCard = "comunCard";
        }
        return typeCard;
    }

    /* Obtiene la clase para pintar el titulo de la Card */
    function getHexaTitle(type) {
        let titleColor = "";
        switch (type) {
            case 'titleComun':
                titleColor = "#0120b9";
                break;
            case 'titleRara':
                titleColor = "#0baf00";
                break;
            case 'titleEpic':
                titleColor = "#c7a600";
                break;
            case 'titleExotic':
                titleColor = "#8400c7";
                break;
            default:
                titleColor = "#0120b9";
        }
        return titleColor;
    }

    /* Obtiene la clase para pintar la Card  */
    function getHexaCard(type) {
        let typeCard = "";
        switch (type) {
            case 'comunCard':
                typeCard = "#e3e6e3";
                break;
            case 'raraCard':
                typeCard = "#d2fdd0";
                break;
            case 'epicCard':
                typeCard = "#f9f8ad";
                break;
            case 'exoticCard':
                typeCard = "#eacbff";
                break;
            default:
                typeCard = "#e3e6e3";
        }
        return typeCard;
    }


});