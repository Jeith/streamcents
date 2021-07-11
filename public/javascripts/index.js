$(document).ready(function() {
    const suggestionArtists = ["Black Eyed Peas", "Anamanaguchi", "Drake", "Justin Bieber", "Lizzo", "Big Time Rush", "Pitbull", "The Garden", "BTS", "Doja Cat", "Cardi B", "Jay-Z", "Taylor Smith", "Katy Perry", "Post Malone", "Mariah Carey", "Billy Eilish", "Miley Cyrus", "Kayne West", "Beyoncé", "Grimes", "Azealia Banks", "Taking Back Sunday", "M.I.A", "Lil Nas X", "Clario", "The Smiths", "Björk", "Kendrick Lamar", "Lady Gaga", "100 gecs", "Ariana Grande", "Jonas Brothers", "Usher", "Trey Songz", "3OH!3", "Alicia Keys", "50 Cent", "Taio Cruz"];
    const firstArtist = suggestionArtists[Math.floor(Math.random() * suggestionArtists.length)];
    const secondArtist = suggestionArtists.filter((artist) => (artist !== firstArtist))[Math.floor(Math.random() * suggestionArtists.filter((artist) => (artist !== firstArtist)).length)];

    $("#artist").attr("placeholder", `Search any artist by name like "${firstArtist}" or "${secondArtist}".`);

    let visitedRoutes = {
        lastVisitedRoute: storedVisitedRoutes === null ? null : storedVisitedRoutes.currentRoute,
        currentRoute: window.location.pathname
    };

    localStorage.setItem("visitedRoutes", JSON.stringify(visitedRoutes));
    });

    let storedVisitedRoutes = JSON.parse(localStorage.getItem("visitedRoutes"));

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

            openLink(link, artistName)
        });

    $("#artist-form").submit((e) => {
        e.preventDefault();
        const apiUrl = window.location.href.split("localhost").length === 1 ? "https://pennystreams.com" : "http://localhost:1337";
        const artistName = $("#artist").val();

        if (artistName !== ""){
            axios.get(`${apiUrl}/api/search-artists/${artistName}`)
            .then((response) => {
                const artists = response.data.artists.items;
                const numOfItems = artists.length;
                
                if (numOfItems !== 0){
                    const link = `/artist/${artists[0].id}`;
                    const name = artists[0].name
                    openLink(link, name)
                }
            })
            .catch((error) => {
                console.log(error)
            })
        } else {

        }
    });

    $("#artist").keyup(() => {
        const apiUrl = window.location.href.split("localhost").length === 1 ? "https://pennystreams.com" : "http://localhost:1337";
        let artistName = $("#artist").val();

        if (artistName !== ""){
            axios.get(`${apiUrl}/api/search-artists/${artistName}`)
            .then((response) => {
                let artists = response.data.artists.items
                let numOfItems = artists.length;
                let itemsToHide = 10 - numOfItems;

                for (let i = 0; i < itemsToHide; i++){
                    $(`#autocomplete-${9 - i}`).attr("href", "").addClass("opacity-none").text("");
                }
                
                $(`.hero`).addClass("autocomplete-view")
                $(`#artist-form`).addClass("autocomplete-active")

                for (let i = 0; i < numOfItems; i++){
                    $(`#autocomplete-${i}`).attr("href", `/artist/${artists[i].id}`).removeClass("opacity-none").text(artists[i].name);
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

    openLink = (link, artistName) => {
        $(`#artist`).val(artistName);
        $(`#home`).addClass("load-page");
        $(`#artist-form`).removeClass("autocomplete-active");
        $(`.hero`).removeClass("autocomplete-view");

        window.open(link, "_self");
        window.location.href = link;
    }

    nFormatter = (num, digits) => {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
            return num >= item.value;
        });

        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

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
});