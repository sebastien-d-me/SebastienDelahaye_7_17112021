/*** Réecrit ***/
/** Normalizer **/
function normalizer(data) {
    data = data.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    data = data.replace(/[.,!;:?]/g,"");
    data = data.toLowerCase();
    return data;
}

/** Kebab case **/
function kebabCase(data) {
    data = data.split(" ").join("-");
    return data;
}



/*** Gère les recettes ***/
/** Récupère les données des recettes **/
recipes.forEach(recipe => {
    let idRecette = recipe["id"];
    let nomRecette = recipe["name"];
    let personneRecette = recipe["servings"];
    let tempsRecette = recipe["time"];
    let ingredientsRecette = recipe["ingredients"];
    let descriptionRecette = recipe["description"];
    let appareilsRecette = recipe["appliance"];
    let ustensilesRecette = recipe["ustensils"];
    return construitRecette(idRecette, nomRecette, personneRecette, tempsRecette, ingredientsRecette, descriptionRecette, appareilsRecette, ustensilesRecette);
});

/** Construit les recettes **/
function construitRecette(id, nom, personne, temps, ingredients, description, appliance, ustensils) {
    /* Récupère les recettes et créer l'élément */
    let listeRecettes = document.getElementById("liste-recettes");
    let recette = document.createElement("article");
    recette.setAttribute("id", `${id}`);
    recette.setAttribute("data-nom", `${nom}`);
    recette.setAttribute("data-appliance", `${appliance}`);
    recette.classList.add("recette");
    ingredients.forEach(ingredient => recette.classList.add(normalizer("ingredient-"+kebabCase(ingredient.ingredient))));
    ustensils.forEach(ustensil => recette.classList.add(normalizer("ustensile-"+kebabCase(ustensil))));
    /* Créer le template */
    let recetteTemplate = `
        <div class="image-recette"></div>
        <div class="contenu-recette">
            <h1 class="titre-recette">${nom}</h1>
            <span class="temps-preparation">${temps}</span>
            <div class="liste-ingredient">
                ${ingredients.map(ingredient =>
                    `<span class="type-ingredient">${ingredient.ingredient}<span class="nombre-ingredient">${ingredient.quantity || ''}${ingredient.quantite || ''} ${ingredient.unit || ''}</span></span>`
                ).join(" ")}
            </div>
            <div class="description-recette">
                <p>${description}</p>
            </div>
        </div>
    `;
    recette.innerHTML = recetteTemplate;
    listeRecettes.appendChild(recette);
}

/** Liste des recettes **/
let recettes = document.querySelectorAll(".recette");



/*** Gère les filtres ***/
/** Ajoute chaque élément dans la liste des filtres **/
function listeFiltres(type) {
    let liste = [];
    /* Ajoute dans un tableau les données selon le type */
    recipes.forEach(recipe => {
        switch(type) {
            case "ingredients":
                `${recipe.ingredients.map(data => 
                    liste.push(normalizer(
                        `${data.ingredient}`
                    ))
                ).join("")}`;
                break;
            case "appliance":
                liste.push(normalizer(
                    `${recipe.appliance}`
                ));
                break;
            case "ustensils":
                `${recipe.ustensils.map(data => 
                    liste.push(normalizer(
                        `${data}`
                    ))
                ).join("")}`;
                break;
            default:
                break;
        }
    });
    /* Tri par ordre alphabétique */
    liste = liste.sort((a, b) => a.localeCompare(b));
    /* Insert en éliminant les doublons dans le DOM */
    new Set(liste).forEach((data) => {
        nom = kebabCase(data);
        document.getElementById("liste-filtre-"+type).insertAdjacentHTML("beforeend", `<li class="nom-filtre" id="${type}-${nom}" data-type="${type}" data-nom="${data}" onclick="ajouteFiltre('${type}', '${data}')">${data}</li>`);
    });
}
/* Affiche tous les ingrédients */ 
listeFiltres("ingredients");
/* Affiche tous les appareils */
listeFiltres("appliance");
/* Affiche tous les ustensiles */
listeFiltres("ustensils");

/** Liste des filtres **/
let listeIngredients = document.querySelectorAll("[data-type='ingredients']");
let listeAppareils = document.querySelectorAll("[data-type='appliance']");
let listeUstensils = document.querySelectorAll("[data-type='ustensils']");

/** Aperçu des filtres **/
/* Ouverture */
function ouvreFiltre(type) {
    /* Réinitialise les boutons et filtres */
    let btnFiltres = document.querySelectorAll(".btn-filtre");
    btnFiltres.forEach(btn => {
        btn.classList.remove("btn-cacher");
        btn.classList.add("btn-afficher");
    });
    let filtres = document.querySelectorAll(".cherche-filtre");
    filtres.forEach(filtre => {
        filtre.classList.remove("cherche-filtre-afficher");
        filtre.classList.add("cherche-filtre-cacher");
    });
    /* Apparence du bouton et filtre en question */
    let btnType = document.getElementById("btn-"+type);
    let chercheType = document.getElementById("cherche-"+type);
    btnType.classList.add("btn-cacher");
    chercheType.classList.add("cherche-filtre-afficher");
}
/* Fermeture */
function fermetureFiltre(type) {
    let btnType = document.getElementById("btn-"+type);
    let chercheType = document.getElementById("cherche-"+type);
    btnType.classList.remove("btn-cacher");
    btnType.classList.add("btn-afficher");
    chercheType.classList.remove("cherche-filtre-afficher");
    chercheType.classList.add("cherche-filtre-cacher");
}

/** Ajoute le filtre des choisis **/
function ajouteFiltre(type, nom) {
    let nomID = kebabCase(nom);
    document.getElementById("filtres-choisis").insertAdjacentHTML("beforeend", `<span class="filtre filtre-${type}" id="filtre-${type}-${nomID}">${nom}<i class="far fa-times-circle" onclick="supprimeFiltre('${type}', '${nom}')"></i></span>`);
    switch(type) {
        case "ingredients":          
            recettes.forEach(function (recette) {
                if(recette.classList.contains("ingredient-"+kebabCase(nom))) {
                    if(recette.classList.contains("recette-afficher")) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    }
                } else {
                    document.getElementById(recette.id).classList.remove("recette-afficher");
                    document.getElementById(recette.id).classList.add("recette-cacher");
                }
            });
            break;
        case "appliance":
            recettes.forEach(function (recette) {
                if(normalizer(recette.dataset.appliance) === nom) {
                    if(recette.classList.contains("recette-afficher")) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    }
                } else {
                    document.getElementById(recette.id).classList.remove("recette-afficher");
                    document.getElementById(recette.id).classList.add("recette-cacher");
                }
            });
            break;
        case "ustensils":  
        recettes.forEach(function (recette) {
                if(recette.classList.contains("ustensile-"+kebabCase(nom))) {
                    if(recette.classList.contains("recette-afficher")) {
                        document.getElementById(recette.id).classList.add("recette-afficher");
                    }
                } else {
                    document.getElementById(recette.id).classList.remove("recette-afficher");
                    document.getElementById(recette.id).classList.add("recette-cacher");
                }
            });
            break;
        default:
            break;
    }
    /* Cache le filtre si cliqué */
    document.getElementById(type+"-"+kebabCase(nom)).classList.add("filtre-cacher");
    /* Vérifie si une recette est affichée */
    let nbRecettesAfficher = document.querySelectorAll(".recette:not(.recette-cacher)").length;
    if(nbRecettesAfficher === 0) {
        document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
    } else {
        document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
    }
}

/** Gère la barre de recherche dans les filtres **/
let tableauIngredients = [];
let tableauAppareils = [];
let tableauUstensiles = [];
listeIngredients.forEach(ingredient => {
    tableauIngredients.push(ingredient.getAttribute("data-nom"));
});
listeAppareils.forEach(appareil => {
    tableauAppareils.push(appareil.getAttribute("data-nom"));
});
listeUstensils.forEach(ustensil => {
    tableauUstensiles.push(ustensil.getAttribute("data-nom"));
});
function rechercherTag(type, tableau) {
    let listeType = document.querySelectorAll("[data-type='"+type+"']");
    champFiltres = document.querySelector("#champ-"+type);
    /* Suit ce que l'utilisateur rentre */
    champFiltres.addEventListener("keyup", (e) => {
        let rechercheValeur = normalizer(e.target.value);
        /* Si la recherche dépasse 1 caractère */
        if(rechercheValeur.length >= 1) {
            tableauFiltres = tableau;
            let resultatRecherche = tableauFiltres.filter((app) => {
                return(
                    normalizer(app).includes(rechercheValeur)
                );
            });
            /* Cache les filtres */
            listeType.forEach(element => {
                element.classList.remove("nom-filtre-afficher");
                element.classList.add("nom-filtre-cacher");
            });
            /* Affiche ceux correspondant à la recherche */
            resultatRecherche.forEach(tagCorrespondant => {
                listeType.forEach(element => {
                    if(tagCorrespondant === element.getAttribute("data-nom")) {
                        element.classList.remove("nom-filtre-cacher");
                        element.classList.add("nom-filtre-afficher");
                    }
                });
            });
        /* Sinon ré-affiche les filtres */
        } else {
            listeType.forEach(element => {
                element.classList.remove("nom-filtre-cacher");
                element.classList.add("nom-filtre-afficher");
            });
        }
    })
}
rechercherTag("ingredients", tableauIngredients);
rechercherTag("appliance", tableauAppareils);
rechercherTag("ustensils", tableauUstensiles);

/** Affiche les filtres **/
function afficheFiltre(liste, type, condition) {
    liste.forEach(listeItem => {
        if(listeItem.getAttribute("id") === type+"-"+kebabCase(normalizer(condition))) {
            listeItem.classList.remove("nom-filtre-cacher");
            listeItem.classList.add("nom-filtre-afficher");
        }
    });
}

/** Cache les filtres **/
function cacheFiltre(liste) {
    liste.forEach(listeItem => {
        listeItem.classList.remove("nom-filtre-afficher");
        listeItem.classList.add("nom-filtre-cacher");
    });
}

/** Supprime le filtre des choisis **/
function supprimeFiltre(type, nom) {
    document.getElementById(type+"-"+kebabCase(nom)).classList.remove("filtre-cacher");
    recettes.forEach(function (recette) {
        if(!recette.classList.contains(type+"-"+kebabCase(nom))) {
            recette.classList.remove("recette-cacher");
        }
    });
    document.getElementById("filtre-"+type+"-"+kebabCase(nom)).remove();
}



/*** Gère la barre de recherche principale ***/
/** Champ rechercher **/
let champRechercher = document.querySelector('#champ-rechercher');
function rechercher(recipes) {
    /* Suit ce que l'utilisateur rentre */
    champRechercher.addEventListener("keyup", (e) => {
        let rechercheValeur = normalizer(e.target.value);
        if(rechercheValeur.length >= 3) {
            let resultatRecherche = recipes.filter((recette) => {
                return(
                    normalizer(recette.name).includes(rechercheValeur),
                    recette.ingredients.some((numIngredient) => normalizer(numIngredient.ingredient).includes(rechercheValeur)),
                    normalizer(recette.description).includes(rechercheValeur)
                );
            });
            /* Cache toutes les recettes */
            recettes.forEach(recette => {
                recette.classList.remove("recette-afficher");
                recette.classList.add("recette-cacher");
            });
            /* Cache tout les filtres */
            cacheFiltre(listeIngredients);
            cacheFiltre(listeAppareils);
            cacheFiltre(listeUstensils);
            /* Recherche si un nom, ingrédient, description correspond */
            resultatRecherche.forEach(recettesCorrespondantes => {
                /* Affiche les ingrédients correspondants */
                recettesCorrespondantes.ingredients.map(ingredient => {
                    afficheFiltre(listeIngredients, "ingredients", ingredient.ingredient);
                });
                /* Affiche les appareils correspondants */
                afficheFiltre(listeAppareils, "appliance", recettesCorrespondantes.appliance);
                /* Affiche les ustensiles correspondants */
                recettesCorrespondantes.ustensils.map(ustensile => {
                    afficheFiltre(listeUstensils, "ustensils", ustensile);
                });
                document.getElementById(recettesCorrespondantes.id).classList.remove("recette-cacher");
                document.getElementById(recettesCorrespondantes.id).classList.add("recette-afficher");
            });
            /* Vérifie si une recette est affichée */
            let nbRecettesAfficher = resultatRecherche.length;
            if(nbRecettesAfficher === 0) {
                document.getElementById("aucun-resultat").classList.add("aucun-resultat-afficher");
            } else {
                document.getElementById("aucun-resultat").classList.remove("aucun-resultat-afficher");
            }
        } else {
            /* Affiche toutes les recettes et tous les filtres */
            recettes.forEach(recette => {
                recette.classList.remove("recette-cacher");
                recette.classList.add("recette-afficher");
            });
            listeFiltres = document.querySelectorAll(".nom-filtre");
            listeFiltres.forEach(filtre => {
                filtre.classList.remove("nom-filtre-cacher");
                filtre.classList.remove("nom-filtre-afficher");
            });
        }
    });
}
rechercher(recipes);