//obtiene el valor del parametro del query string de la url. Si no existe devuelve null
function getParameterByName(name, url) {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//devuelve el user name del login name indicado
function obtenerUserName(loginName) {
    userName = loginName;

    array = userName.split("|");
    if (array.length == 3) {
        userName = array[2];
    }

    array = userName.split("\\");
    if (array.length == 2) {
        userName = array[1];
    }

    return userName;
}

//devuelve la url de la web actual relativa y siempre finaliza en /
function obtenerURLWebRelative() {
    if (_spPageContextInfo.siteServerRelativeUrl[_spPageContextInfo.siteServerRelativeUrl.length - 1] == "/") {
        return _spPageContextInfo.siteServerRelativeUrl;
    } else {
        return _spPageContextInfo.siteServerRelativeUrl + "/";
    }
}

//Este metodo evita la propagacion de eventos, es decir, evita que se ejecuten eventos siguientes al actual
function evitarPropagacionEventos() {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

//devuelve un porcentaje del valor en pixeles con respecto al width de la ventana del explorador
function obtenerPorcentajeWidthWindow(porcentaje) {
    try {
        return Math.round($(window).width() * porcentaje);
    } catch (ex) {
        return null;
    }
}

//devuelve un porcentaje del valor en pixeles con respecto al height de la ventana del explorador
function obtenerPorcentajeHeightWindow(porcentaje) {
    try {
        return Math.round($(window).height() * porcentaje);
    } catch (ex) {
        return null;
    }
}


/* Property Bag */
//obtiene valor Propery Bag y ejecuta una funcion al finalizar pasando como parametro ese valor
function obtenerValorPropertyBag(keyProperty, funcionEjecutarFinalizar) {
    var propertiesBag;
    var valorProperty;

    SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () {
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        propertiesBag = web.get_allProperties();
        ctx.load(propertiesBag);

        ctx.executeQueryAsync(function () {
            var valorProperty = obtenerPropertyBag(propertiesBag, keyProperty);
            funcionEjecutarFinalizar(valorProperty);
        }, function (sender, args) { });
    });
}

//devuelve el valor de la Property Bag
function obtenerPropertyBag(propertiesBag, keyProperty) {
    var valorPropertyBag = propertiesBag.get_fieldValues()[keyProperty];
    if (valorPropertyBag != undefined) {
        return valorPropertyBag;
    } else {
        return "";
    }
}
/* Fin Property Bag */


//Este metodo selecciona la biblioteca destino cuando se suben archivos dentro de una noticia u otros campos
function seleccionarBibliotecaDestinoUploadAspx(bibliotecaDestino) {
    var selectUpload = $("tr[id*='SelectListSection'] select");
    if (selectUpload.length == 1) {
        var existeLibreriaDeseada = false;
        var opcionesSelectUpload = selectUpload.find("option");
        for (var i = 0; i < opcionesSelectUpload.length; i++) {
            var opcionSelectUpload = $(opcionesSelectUpload[i]);
            if (opcionSelectUpload.text() == bibliotecaDestino) {
                existeLibreriaDeseada = true;
                selectUpload.val(opcionSelectUpload.val());
                break;
            }
        }

        if (existeLibreriaDeseada) {
            for (var i = 0; i < opcionesSelectUpload.length; i++) {
                var opcionSelectUpload = $(opcionesSelectUpload[i]);
                if (opcionSelectUpload.text() != bibliotecaDestino) {
                    opcionSelectUpload.remove();
                }
            }
        }
    }
}


/* Funciones Modal SharePoint */
//Abre el modal de SharePoint con contenido HTML
function OpenModalHTMLSharePoint(elementHTML, title, functionCallBack, width, height, autoSize, showClose, args) {
    SP.SOD.executeFunc("sp.js", "SP.UI.ModalDialog.showModalDialog", function () {
        SP.UI.ModalDialog.showModalDialog({
            html: elementHTML,
            title: title,
            width: width,
            height: height,
            autoSize: autoSize,
            showClose: showClose,
            args: args,
            dialogReturnValueCallback: ((functionCallBack != null) && (functionCallBack != undefined)) ? Function.createDelegate(null, functionCallBack) : null
        })
    });
}

//Abre el modal de SharePoint con una URL
function OpenModalURLSharePoint(url, title, functionCallBack, width, height, autoSize, showClose, args) {
    SP.SOD.executeFunc("sp.js", "SP.UI.ModalDialog.showModalDialog", function () {
        SP.UI.ModalDialog.showModalDialog({
            url: url,
            title: title,
            width: width,
            height: height,
            autoSize: autoSize,
            showClose: showClose,
            args: args,
            dialogReturnValueCallback: ((functionCallBack != null) && (functionCallBack != undefined)) ? Function.createDelegate(null, functionCallBack) : null
        })
    });
}

function showModalWaitScreenSharePoint(title, aditionalText, width, height) {
    SP.SOD.executeFunc("sp.js", "SP.UI.ModalDialog.showModalDialog", function () {
        SP.UI.ModalDialog.showWaitScreenWithNoClose(title, aditionalText, width, height);
    });
}

//Cierra el modal de SharePoint
function closeModalSharePoint(resultDialog, returnDialog) {
    SP.SOD.executeFunc("sp.js", "SP.UI.ModalDialog.commonModalDialogClose", function () {
        if (window.frameElement != null) {
            window.frameElement.commonModalDialogClose(resultDialog, returnDialog); //este se ejecuta desde la pagina del modal
        } else {
            SP.UI.ModalDialog.commonModalDialogClose(resultDialog, returnDialog); //este se ejcuta desde la pagina padre del modal
        }
    });
}

//remueve el titulo del modal de SharePoint
function removeModalSharePointTitle() {
    $(".ms-dlgTitleText").css("display", "none");
}

//Esta funcion hace responsivo el modal de SharePoint, se la debe vincular al resize del window
function resizeModalSharePoint() {
    if (SP.UI.ModalDialog != undefined) {
        var dlg = SP.UI.ModalDialog.get_childDialog();
        if (dlg != null) {
            dlg.autoSize();
        }
    }
}
/* Fin funciones Modal SharePoint */


/* Funciones Notificaciones SharePoint */
function addSPNotification(message, sticky) {
    return SP.UI.Notify.addNotification(message, sticky);
}

function removeSPNotification(idNotification) {
    SP.UI.Notify.removeNotification(idNotification);
}
/* Fin funciones Notificaciones SharePoint */


/* Funciones Ratings Estrellas SharePoint */
//Este script arregla cuando la califacion de estrellas es un numero decimal ya que por defecto tira error el decimal con , por el lenguaje de la web
function arreglarCalificacionEstrellasDecimal (stringSelector) {
    try {
        var ratingsParaArreglar = $(stringSelector);
        ratingsParaArreglar.each(function () {
            if ($(this).find('> span').text().trim() == "") {
                var texto = $(this).find('> script').html();
                var posicion = texto.indexOf("var avgRating =");
                if (posicion > 0) {
                    for (var i = posicion; i <= posicion + 20; i++) {
                        if (texto[i] == ',') {
                            texto = [texto.slice(0, i), ".", texto.slice(i + 1)].join('');
                            break;
                        }
                    }
                }
                eval(texto);
            }
        });
    }
    catch (e) { }
}
/* Fin funciones Ratings Estrellas SharePoint */


/* Funciones Likes SharePoint */
//este es el evento que hay que vincular con el a o span con el texto de me gusta
function clickBotonMeGusta(selectorDivMeGusta, listID, itemID) {
    var meGusta = false;
    var textoBotonLike = $(selectorDivMeGusta + " .botonLike").text();
    if (textoBotonLike != "") {
        if (textoBotonLike == "Me gusta") { meGusta = true; }

        SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () { 
            var aContextObject = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
            SP.SOD.executeFunc('reputation.js', 'Microsoft.Office.Server.ReputationModel.Reputation', function () {
                Microsoft.Office.Server.ReputationModel.Reputation.setLike(aContextObject, listID.substring(1, 37), itemID, meGusta);

                aContextObject.executeQueryAsync(
                    function () {
                        obtenerCantidadMeGustaItem(selectorDivMeGusta, listID, itemID);
                    }, function (sender, args) {
                });
            });
        });
    }
}

//devuelve la cantidad de me gusta
function obtenerCantidadMeGustaItem(selectorDivMeGusta, listID, itemID) {
    SP.SOD.executeFunc("sp.js", "SP.ClientContext", function () { 
        var context = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
        //var list = context.get_web().get_lists().getById(_spPageContextInfo.pageListId);
        var list = context.get_web().get_lists().getById(listID);
        var item = list.getItemById(itemID);
        //var item = list.getItemById(_spPageContextInfo.pageItemId);

        context.load(item, "LikedBy", "ID", "LikesCount");
        context.executeQueryAsync(Function.createDelegate(this, function (success) {
            // Check if the user id of the current users is in the collection LikedBy. 
            var usuarioActualMeGusta = false;
            var usuariosMeGusta = item.get_item('LikedBy');
            var cantidadMeGusta = item.get_item('LikesCount');
            if ((usuariosMeGusta != null) && (usuariosMeGusta != "undefined")) {
                for (var i = 0, j = usuariosMeGusta.length; i < j; i++) {
                    var usuario = usuariosMeGusta[i];
                    if (usuario.$1E_1 === _spPageContextInfo.userId) {
                        usuarioActualMeGusta = true;
                        break;
                    }
                }
            } else {
                cantidadMeGusta = 0;
            }
            modificarEstiloBotonLike(selectorDivMeGusta, usuarioActualMeGusta, cantidadMeGusta);

        }), Function.createDelegate(this, function (sender, args) { }));
    });
}

//modifica el texto del boton me gusta
function modificarEstiloBotonLike(selectorDivMeGusta, usuarioActualMeGusta, cantidadMeGusta) {
    if (!usuarioActualMeGusta) {
        $(selectorDivMeGusta + " .botonLike").text('Me gusta');
    }
    else {
        $(selectorDivMeGusta + " .botonLike").text('Ya no me gusta');
    }

    $(selectorDivMeGusta + " .cantidadLike").text(cantidadMeGusta);
}
/* Fin Funciones Likes SharePoint */


/* Update Panel */
//Esta funcion intenta arreglar el error del update panel con Google Chrome y SharePoint
function arreglarRefreshUpdatePanel() {
    ExecuteOrDelayUntilBodyLoaded(function () {
        try {
            if (Sys.WebForms.PageRequestManager.getInstance().digestFixed !== true) {
                Sys.WebForms.PageRequestManager.getInstance().digestFixed = true;
                Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(function () {
                    if (typeof (UpdateFormDigest) === "function" && typeof (_spPageContextInfo) === "object")
                        UpdateFormDigest(_spPageContextInfo.webServerRelativeUrl, 3 * 60 * 1000);
                });
            }
        }
        catch (e) { }
    });
}

//Actualiza un Update Panel (con el selector indicado) dependiendo el resultado de un Modal Dialog u otra situacion siempre y cuando el valor de la variable result sea mayor a 0. Ademas permite enviarle un argumentoen caso de ser necesario
function actualizarUpdatePanel(clientIDUpdatePanel, result, argumento) {
    if ((result != undefined) && (result != null)) {
        if (result > 0) {
            if ((argumento != undefined) && (argumento != null)) {
                __doPostBack(clientIDUpdatePanel, argumento);
            } else {
                __doPostBack(clientIDUpdatePanel);
            }
        }
    } else {
        if ((argumento != undefined) && (argumento != null)) {
            __doPostBack(clientIDUpdatePanel, argumento);
        } else {
            __doPostBack(clientIDUpdatePanel);
        }
    }
}
/* Fin Update Panel*/

/* Navegacion BootStrap SharePoint */
function ToggleNavSharePointBSBlanco(element, selector) {
    $(selector).slideToggle();

    if (element.hasClass('closeToggleNavSharepointBSBlanco')) {
        element.removeClass('closeToggleNavSharepointBSBlanco')
    } else {
        element.addClass('closeToggleNavSharepointBSBlanco');
    }
}