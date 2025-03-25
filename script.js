let slideIndex = 1;

const pokemonList = ["snivy", "rotom", "ledian", "baltoy", "poliwhirl"];
let pokemonCries = {};
//Function to get the pokemon data from the API
async function fetchPokemonImage() {
    try {
        let imageUrls = [];

        // Fetch images for each Pokémon in order
        for (let pokemon of pokemonList) {
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            let data = await response.json();

            // Use Gen 5 sprite if available; otherwise, fallback to official artwork
            let imageUrl = data.sprites.versions["generation-v"]?.["black-white"]?.animated.front_default 
                || data.sprites.other["official-artwork"].front_default;

            let cryUrl = data.cries.legacy;
            imageUrls.push(imageUrl);
            pokemonCries[pokemon] = cryUrl;
        }

        // Update slides with respective Pokémon images
        let images = document.querySelectorAll(".mySlides img");
        images.forEach((img, index) => {
            img.src = imageUrls[index]; // Assign the correct Pokémon image

            img.addEventListener("click", () => playCry(pokemonList[index]));
        });
    }
    //Catching errors for debugging.
    catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

function playCry(pokemon) {
    let cryUrl = pokemonCries[pokemon];
    if (cryUrl) {
        let audio = new Audio(cryUrl);
        audio.volume = 0.3;
        audio.play();
    }
}

//Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

//Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
        slideIndex = 1
    };
    if (n < 1) {
        slideIndex = slides.length
    };
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    };
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    };

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
};
document.addEventListener("DOMContentLoaded", function() {
    showSlides(slideIndex);
    fetchPokemonImage();
});