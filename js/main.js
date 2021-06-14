var favoritos = [];

class FilmeObject {
    constructor(Title, Year, imdbID) {
        this.Title = Title;
        this.Year = Year;
        this.imdbID = imdbID;
    }
};

$(document).ready(function () {
    favoritos = [];
});

function Buscar() {
    var textoPesquisa = $("#busca").val();
    var textoPesquisaAux = textoPesquisa.trim();
    var listaFilmes = GetInApi(textoPesquisaAux, 1);
}

function AlternaListas(lista) {
    if(lista==1) {
        document.getElementById("title").innerHTML = "Cinema APP";
        $("#buscarbottom").addClass('bottom-active');
        $("#buscarbottom").removeClass('bottom-inactive');
        $("#favoritos").addClass('bottom-inactive');
        $("#favoritos").removeClass('bottom-active');
        $("#buscargroup").show();
        $("#lista").empty();
        $("#busca").val('');
    }
    else {
        BuscarFavoritos();
    }
}

function BuscarFavoritos() {
    document.getElementById("title").innerHTML = "Cinema APP - Favoritos";
    $("#buscargroup").hide();
    $("#favoritos").addClass('bottom-active');
    $("#favoritos").removeClass('bottom-inactive');
    $("#buscarbottom").addClass('bottom-inactive');
    $("#buscarbottom").removeClass('bottom-active');
    $("#lista").empty();
    var todosFilmes = "";
    favoritos.forEach(filmeFavorito => {
        todosFilmes += MontaItemListaDeletavel(filmeFavorito);
    });
    $("#lista").append(todosFilmes);
}

function GetInApi(query, page) {
    var apiUrl = "http://www.omdbapi.com/";
    var apiKey = "925eba28";
    var getUri = apiUrl + "?apikey=" + apiKey + "&s=" + query + "&page=" + page;

    $.getJSON(getUri, function (data, status) {
        if (data != null) {
            $("#lista").empty();
            var todosFilmes = "";
            if (data.Search != null) {
                data.Search.forEach(filme => {
                    todosFilmes += MontaItemLista(filme);
                });
                $("#lista").append(todosFilmes);
            }
        }
    });
}

function MontaItemLista(filme) {
    listaItem = '<div class="card text-dark bg-white mb-3" style="max-width: 100%;">';
    listaItem += '<div class="card-body">';
    listaItem += '<div class="row">';
    listaItem += '<div class="col"><i class="fas fa-circle circle"></i>';
    listaItem += '</div>';
    listaItem += '<div class="col-8">' + filme.Title;
    listaItem += '</div>';
    if (BuscaFavorito(filme.imdbID)) {
        listaItem += '<div class="col pull-right"><i id="' + filme.imdbID + '" class="fas fa-star ico-selected" onclick="RegistraFavoritos(\'' + filme.Title + '\',\'' + filme.imdbID + '\',\'' + filme.Year + '\');"></i></div>';
    } else {
        listaItem += '<div class="col pull-right"><i id="' + filme.imdbID + '" class="fas fa-star ico-n" onclick="RegistraFavoritos(\'' + filme.Title + '\',\'' + filme.imdbID + '\',\'' + filme.Year + '\');"></i></div>';
    }
    listaItem += '</div>';
    listaItem += '<div class="row">';
    listaItem += '<div class="col">';
    listaItem += '</div>';
    listaItem += '<div class="col-8">' + filme.Year;
    listaItem += '</div>';
    listaItem += '<div class="col">';
    listaItem += '</div>';
    listaItem += '</div>';
    listaItem += '</div>';
    listaItem += '</div>';
    return listaItem;
}

function MontaItemListaDeletavel(filme) {
    listaItem = '<div id="card'+ filme.imdbID +'" class="card text-dark bg-white mb-3" style="max-width: 100%;">';
    listaItem += '<div class="card-body">';
    listaItem += '<div class="row">';
    listaItem += '<div class="col"><i class="fas fa-circle circle"></i>';
    listaItem += '</div>';
    listaItem += '<div class="col-8">' + filme.Title;
    listaItem += '</div>';
    listaItem += '<div class="col pull-right"><i id="' + filme.imdbID + '" class="fas fa-star ico-selected" onclick="RemoveFavorito(\'' + filme.imdbID + '\', true);"></i></div>';
    listaItem += '</div>';
    listaItem += '<div class="row">';
    listaItem += '<div class="col">';
    listaItem += '</div>';
    listaItem += '<div class="col-8">' + filme.Year;
    listaItem += '</div>';
    listaItem += '<div class="col">';
    listaItem += '</div>';
    listaItem += '</div>';
    listaItem += '</div>';
    listaItem += '</div>';
    return listaItem;
}

function RemoveFavorito(id, removerCard = false) {
    for (var i = 0; i < favoritos.length; i++) {
        if (favoritos[i].imdbID.trim() == id.trim()) {
            favoritos.splice(i, 1);
            if (removerCard) {
                $("#card" + id.trim()).remove();
            }
        }
    }
}

function RegistraFavoritos(nomeFilme, id, ano) {
    var filmeObj = new FilmeObject(nomeFilme.trim(), ano, id);
    if(BuscaFavorito(filmeObj.imdbID)) {
        RemoveFavorito(filmeObj.imdbID);
        $("#" + id).addClass('fas fa-star ico-n');
        $("#" + id).removeClass('fas fa-star ico-selected');
    }
    else{
        favoritos.push(filmeObj);
        $("#" + id).addClass('fas fa-star ico-selected');
        $("#" + id).removeClass('fas fa-star ico-n');
    }
}

function BuscaFavorito(id) {
    var encontrou = false;
    favoritos.forEach(filme => {
        if(filme.imdbID == id) {
            encontrou = true;
        }
    });
    return encontrou;
}