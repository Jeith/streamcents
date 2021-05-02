var express = require('express');
var axios = require('axios');
var router = express.Router();

router.get('/get-access-token', function(req, res, next) {
    let params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${process.env.AUTH_TOKEN}`
        }
    }

    axios.post("https://accounts.spotify.com/api/token", params, config)
    .then((response) => {
        return res.json(response.data);
    })
    .catch((error) => {
        return res.json({data: error});
    })
});

router.get('/search-artists/:artist', function(req, res, next) {
    let artist = req.params.artist;

    axios.get(`http://localhost:1337/api/get-access-token`)
    .then((token) => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token.data.access_token}`
            }
        }
        
        axios.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=9`, config)
        .then((response) => {
            console.log("response: ", response)
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(response.data);
        })
    })
    .catch((error) => {
        return error
    })
});

router.get('/get-artist/:artistId', function(req, res, next) {
    let artistId = req.params.artistId;

    axios.get(`http://localhost:1337/api/get-access-token`)
    .then((token) => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token.data.access_token}`
            }
        }
        
        axios.get(`https://api.spotify.com/v1/artists/${artistId}`, config)
        .then((response) => {
            return res.json(response.data);
        })
        .catch((error) => {
            return res.json(error);
        })
    })
    .catch((error) => {
        return error
    })
});

router.get('/get-artist-info/:artistId', function(req, res, next) {
    let artistId = req.params.artistId;

    axios.get(`https://api.t4ils.dev/artistInfo?artistid=${artistId}`)
    .then((response) => {
        let artistData = response.data.data;
        let albumReleases = artistData.releases.albums.releases;
        let singleReleases = artistData.releases.singles.releases;
        let allReleases = albumReleases.concat(singleReleases)
        let totalNumberOfStreams = 0;

        for (let i = 0; i < albumReleases.length; i++){
            let discs = albumReleases[i].discs;
            let totalAlbumStreams = 0;
            let totalSongs = 0;

            for (let j = 0; j < discs.length; j++){
                let totalDiscStreams = discs[j].tracks.reduce((acc, curr) => acc + curr.playcount, 0);
                artistData.releases.albums.releases[i].discs[j].totalStreams = totalDiscStreams;
                totalAlbumStreams += totalDiscStreams;
                totalSongs += discs[j].tracks.length;
            }
            artistData.releases.albums.releases[i].totalStreams = totalAlbumStreams;
            artistData.releases.albums.releases[i].totalSongs = totalSongs;
            totalNumberOfStreams += totalAlbumStreams;
        }

        const minAmountOfEarnings = (totalNumberOfStreams * 0.0032).toFixed(2);
        const maxAmountOfEarnings = (totalNumberOfStreams * 0.005).toFixed(2);

        artistData.releases.minAmountOfEarnings = minAmountOfEarnings;
        artistData.releases.maxAmountOfEarnings = maxAmountOfEarnings;

        console.log("totalNumberOfStreams: ", totalNumberOfStreams)
        
        return res.json(artistData);
    })
    .catch((error) => {
        return error
    })
});

module.exports = router;