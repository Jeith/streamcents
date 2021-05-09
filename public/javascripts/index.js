$(document).ready(function() {
    let suggestionArtists = ["Miley Cyrus", "Grimes", "Ratatat", "Azealia Banks", "Taking Back Sunday", "Rick James", "Bootsy Collins", "Khruangbin", "M.I.A", "Lil Nas X", "Donna Summer", "Clario", "Scatman John", "Herbie Hancock", "The Smiths", "Diana Ross", "Björk", "Kendrick Lamar", "George Benson", "The Isly Brothers", "Lady Gaga", "100 gecs", "Vulfpeck", "Brokencyde", "DJ Screw", "A Tribe Called Quest", "The Avalanches"];
		
    let storedVisitedRoutes = JSON.parse(localStorage.getItem("visitedRoutes"));

    let visitedRoutes = {
        lastVisitedRoute: storedVisitedRoutes === undefined ? undefined : storedVisitedRoutes.currentRoute,
        currentRoute: window.location.pathname
    };

    localStorage.setItem("visitedRoutes", JSON.stringify(visitedRoutes));

    $(function(){
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
});