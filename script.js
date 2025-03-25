//Variable to know what slide is displayed.
let slideIndex = 1;

//Variables fpor pokemon, sounds, and their stats.
const pokemonList = ["snivy", "rotom", "ledian", "baltoy", "poliwhirl"];
let pokemonCries = {};
let pokemonStats = {};

//---POKEMON API---
//Function to get the pokemon data from the API.
async function fetchPokemonImage() {
    try {
        //Variable to fetch the urls of sprites.
        let imageUrls = [];

        //Gets data for each pokemon in the array.
        for (let pokemon of pokemonList) {
            //Waits for the data to get fetched first.
            let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            //When data gets fetched, it's then turnt into data we can finally work with.
            let data = await response.json();

            //Variable to grab generation 5/DS era sprites.
            let spriteUrl = data.sprites.versions["generation-v"]?.["black-white"]?.animated.front_default;
            //Variable to grab pokemon cries.
            let cryUrl = data.cries.legacy;
            //Variable to map out the stats of the pokemon alongside what states they belong to.
            let stats = data.stats.map(stat => ({
                name: stat.stat.name,
                value: stat.base_stat
            }));

            //Pushes the sprite url to the array of images.
            imageUrls.push(spriteUrl);
            //Cry of the pokemon.
            pokemonCries[pokemon] = cryUrl;
            //Stats of the pokemon.
            pokemonStats[pokemon] = stats;
        }

        //Updates slides with their respective pokemon.
        let images = document.querySelectorAll(".mySlides img");

        //For each image, the pokemon sprite is shown, clicking on the sprite plays the sound effect, and the stats get shown and updated, all respectively.
        images.forEach((img, index) => {
            img.src = imageUrls[index];

            img.addEventListener("click", () => playCry(pokemonList[index]));

            updateStats(pokemonList[0]);
        });
    }
    //Catching errors for debugging.
    catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}
//Function to play pokemon sounds.
function playCry(pokemon) {
    let cryUrl = pokemonCries[pokemon];
    if (cryUrl) {
        let audio = new Audio(cryUrl);
        audio.volume = 0.3;
        audio.play();
    }
}
//Function to update stats.
function updateStats(pokemon) {
    //Variable for the list of stats.
    let statsList = document.getElementById("pokemonStats");
    //Clears the stats of the previous slide.
    statsList.innerHTML = "";

    //if statement for the list to be created and run through each stat and its value, and then appending them to the list.
    if (pokemonStats[pokemon]) {
        pokemonStats[pokemon].forEach(stat => {
            let listItem = document.createElement("li");
            listItem.textContent = `${stat.name.toUpperCase()}: ${stat.value}`;
            statsList.appendChild(listItem);
        });
    }
}

//---SLIDESHOW---
//Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

//Function to show the slide depending on where we are on the slideshow.
function currentSlide(n) {
    showSlides(slideIndex = n);
}

//Function to show slides.
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

    //Update stats here with function.
    updateStats(pokemonList[slideIndex - 1]);
};

//Once the document is loaded, run these functions.
document.addEventListener("DOMContentLoaded", function() {
    showSlides(slideIndex);
    fetchPokemonImage();
});

//Good chunk of slideshow code is borrowed from W3 Schools with some minor tweaks.