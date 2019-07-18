headerMinimizado = false;

$(function () {
    getUserData();
    if (getParameterByName("IsDlg") == null) {
        resizeWindowIntranetResponsive();
        $(window).bind('resize', resizeModalSharePoint);
        $(window).bind('resize', resizeWindowIntranetResponsive);

        var altoNavegacion = $("#sideNavBox").height();
        var anchoNavegacion = $("#sideNavBox").width();
        if (altoNavegacion > 10) {
            $("#contentRow").addClass("mostrarNavegacion");
        } else {
            $("#contentRow").addClass("ocultarNavegacion");
        }

        $(window).scroll(function () {
            scrollWindow();
        });

        scrollWindow();

        $(document).mouseup(function (e) {
            var containerBarraBuscador = $("#navSPBarraBuscador");
            if ((e.target.getAttribute != null) && (e.target.getAttribute("class") != "lupaBuscadorGeneral")) {
                if (!containerBarraBuscador.is(e.target) && containerBarraBuscador.has(e.target).length === 0) // if the target of the click isn't the container; nor a descendant of the container
                {
                    $("#navSPBarraBuscador").hide('slow');
                }
            }
        });
    } else {

    }

    //bibliotecaDestinoUploadAspx();
    capturaVinculosLista();

});

/** 
 *  Muestra el login de usuario
 */
function getUserData() {
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/_api/sp.userprofiles.peoplemanager/getmyproperties",
        method: 'GET',
        headers: {
            "Accept": "application/json; odata=verbose"
        },
        success: renderUserData,
        error: function (request, status, error) {
            console.error(request.responseJSON.error.message.value);
        }
    });
}

function renderUserData(data) {
    var user = data.d;
    $('#lblNombreUsuario').text(user.DisplayName);
    $('.imagenUsuarioLogueado>a').attr('href',"javascript:OpenModalURLSharePoint('" + _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/Intranet.Web/Usuarios/PaginaEmpleado.aspx?Legajo=" + user.AccountName.split('\\')[1] + "&Usuario=" + user.AccountName.split('\\')[1] + "', null, null, 1170); removeModalSharePointTitle();");
    if(user.PictureUrl != null){
        $('#literalImagenUsuario').attr('src', user.PictureUrl);
    }
}


//Crea el efecto del menu sticky-fixed
function scrollWindow() {
    try {
        estadoRibbon = (RibbonIsMinimized() && (document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value == "") && (($("#RibbonContainer_activeTabId").attr("value") == undefined) || ($("#RibbonContainer_activeTabId").attr("value") == "") || ($("#RibbonContainer_activeTabId").attr("value") == "Ribbon.Read")));
        if (($(window).scrollTop() > 0) && (!headerMinimizado) && (estadoRibbon)) {
            $("#s4-titlerow").toggleClass("s4-titlerowScroll");
            headerMinimizado = true;
        } else if (($(window).scrollTop() <= 0) && (headerMinimizado) && (RibbonIsMinimized())) {
            $("#s4-titlerow").toggleClass("s4-titlerowScroll");
            headerMinimizado = false;
        }
    } catch (ex) {}
}

//preselecciona la biblioteca destino de las paginas upload en formularios
function bibliotecaDestinoUploadAspx() {
    var locationWeb = window.location.href;
    if ((locationWeb.indexOf("/_layouts/15/Upload.aspx") >= 0) || (locationWeb.indexOf("/_layouts/15/UploadEx.aspx") >= 0)) {

    }
}

/* Resposive Resize Intranet */
windowSizeXS = false;
windowSizeSM = false;
windowSizeMD = false;
windowSizeLG = false;
windowNavbarCollapsed = false;
windowBuscadoresCollapsed = false;

function resizeWindowIntranetResponsive() {
    if ((!windowNavbarCollapsed) && ($(window).width() <= 900)) {
        windowNavbarCollapsed = true;
    } else if ((windowNavbarCollapsed) && ($(window).width() > 900)) {
        windowNavbarCollapsed = false;
    }

    if ((!windowBuscadoresCollapsed) && ($(window).width() <= 1300)) {
        windowBuscadoresCollapsed = true;
        moverBarraBuscadorNavegacion(false);
    } else if ((windowBuscadoresCollapsed) && ($(window).width() > 1300)) {
        windowBuscadoresCollapsed = false;
        moverBarraBuscadorNavegacion(true);
    }
}

//Mover Barra Buscadores Navegacion
function moverBarraBuscadorNavegacion(navegacionFull) {
    if (!navegacionFull) {
        var navBuscadores = $("#navBuscadores");
        if (navBuscadores.length == 1) {
            contenidoBuscadores = navBuscadores.html();
            navBuscadores.html("");
            $("#navSPBarraBuscador").html(contenidoBuscadores);
        }
    } else {
        var navBuscadores = $("#navSPBarraBuscador");
        if (navBuscadores.length == 1) {
            contenidoBuscadores = navBuscadores.html();
            navBuscadores.html("");
            $("#navBuscadores").html(contenidoBuscadores);
        }
    }
}

function toggleWebpartsHomeBlanco(element, selector) {
    $(selector).slideToggle();

    if (element.hasClass('closeToggleWebPartBlanco')) {
        element.removeClass('closeToggleWebPartBlanco')
    } else {
        element.addClass('closeToggleWebPartBlanco');
    }
}
/* Fin Resposive Resize Intranet */

/** 
 *  Captura los vinculos del repositorio para redirigirlos al contador
 */
function capturaVinculosLista() {
    //console.log("Captura Vinculos Version 2018.02.05.11.59");

    $('a[href*="VisitCounter"]').each(function () {

        var $listlink = $(this).closest('tr').find("a.ms-listlink");
        //console.log("Capturando vinculo en...");
        //console.info($listlink);

        $listlink.removeAttr("onclick");
        $listlink.removeAttr("onmousedown");
        $listlink.attr("href", this.href);

    });
}