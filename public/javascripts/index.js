$(document).ready(function() {
    let suggestionArtists = ["Black Eyed Peas", "RuPaul", "Drake", "Justin Bieber", "Lizzo", "Pitbull", "Elton John", "The Garden", "BTS", "Doja Cat", "Cardi B", "Jay-Z", "Taylor Smith", "Katy Perry", "Post Malone", "Mariah Carey", "Billy Eilish", "Miley Cyrus", "Kayne West", "Beyoncé", "Grimes", "Ratatat", "Azealia Banks", "Taking Back Sunday", "Bootsy Collins", "M.I.A", "Lil Nas X", "Clario", "The Smiths", "Diana Ross", "Björk", "Kendrick Lamar", "George Benson", "The Isly Brothers", "Lady Gaga", "100 gecs", "Ariana Grande", "The Jonas Brothers", "Usher", "Trey Songz", "3OH!3", "Alicia Keys", "50 Cent", "Taio Cruz"];
    let firstArtist = suggestionArtists[Math.floor(Math.random() * suggestionArtists.length)];
    let secondArtist = suggestionArtists.filter((artist) => (artist !== firstArtist))[Math.floor(Math.random() * suggestionArtists.filter((artist) => (artist !== firstArtist)).length)];

    $("#artist").attr("placeholder", `Search any artist by name like "${firstArtist}" or "${secondArtist}".`)
    let storedVisitedRoutes = JSON.parse(localStorage.getItem("visitedRoutes"));

    $("#artist").keyup(() => {
        let artistName = $("#artist").val();
                    
        if (artistName !== ""){
            axios.get(`http://localhost:1337/api/search-artists/${artistName}`)
            .then((response) => {
                let artists = response.data.artists.items
                let numOfItems = artists.length;
                let itemsToHide = 10 - numOfItems;

                console.log("artists: ", artists)

                for (let i = 0; i < itemsToHide; i++){
                    $(`#autocomplete-${9 - i}`).attr("href", "").addClass("opacity-none").text("");
                }
                
                $(`.hero`).addClass("autocomplete-view")
                $(`#artist-form`).addClass("autocomplete-active")

                for (let i = 0; i < numOfItems; i++){
                    $(`#autocomplete-${i}`).attr("href", `/${artists[i].id}`).removeClass("opacity-none").text(artists[i].name);
                }
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            for (let i = 0; i < 10; i++){
                $(`#autocomplete-${9 - i}`).attr("href", "#").addClass("opacity-none").text("");
            }

            $(`#artist-form`).removeClass("autocomplete-active")
            $(`.hero`).removeClass("autocomplete-view")
        }
    })

    let visitedRoutes = {
        lastVisitedRoute: storedVisitedRoutes === null ? null : storedVisitedRoutes.currentRoute,
        currentRoute: window.location.pathname
    };

    localStorage.setItem("visitedRoutes", JSON.stringify(visitedRoutes));

    $("#artist-carousel").click((e) => {
        let imgContainer = e.target.nodeName === "IMG" ? e.target.parentNode : e.target;
        let images = imgContainer.children;
        let currentActiveIndex = 0;

        for (let i = 0; i < images.length; i++){
            if (!images[i].classList.contains("hidden")){
                currentActiveIndex = i;
            }
        }

        $(".artist-img").addClass("hidden")

        if (currentActiveIndex === (images.length - 1)){
            images[0].classList.remove("hidden");

        } else {
            images[currentActiveIndex + 1].classList.remove("hidden");
        }


    })

    $(function(){
        let storedVisitedRoutes = JSON.parse(localStorage.getItem("visitedRoutes"));

        if (storedVisitedRoutes.currentRoute !== "/"){
            if (storedVisitedRoutes.lastVisitedRoute === "/"){
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#artist-info").offset().top
                }, 750);

                setTimeout(() => {
                    $(`.artist-details`).removeClass("load-page")
                }, 750)
            } else {
                setTimeout(() => {
                    $(`.artist-details`).removeClass("load-page")
                }, 750)
                window.scrollTo(0, $("#artist-info").offset().top);

            }
        }
        $(".autocomplete-item").click(function(e){
            e.preventDefault();
            var link = $(this).attr("href");
            var artistName= $(this).text();

            for (let i = 0; i < 10; i++){
                $(`#autocomplete-${9 - i}`).attr("href", "").addClass("opacity-none").text("");
            }

            console.log('here!!')
            $(`#artist`).val(artistName)
            $(`#home`).addClass("load-page")
            $(`#artist-form`).removeClass("autocomplete-active")
            $(`.hero`).removeClass("autocomplete-view")

            console.log("link: ", link)

            setTimeout(() => {
                console.log("???")
                window.location.href = link;
            }, 750);
        });
    });
});