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
String.prototype.trunc = String.prototype.trunc ||
function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '...' : this;
};

router.get('/get-artist-info/:artistId', function(req, res, next) {
    let artistId = req.params.artistId;

    axios.get(`https://api.t4ils.dev/artistInfo?artistid=${artistId}`)
    .then((response) => {
        console.log(response)

        let artistData = response.data.data;
        let unfilteredAlbumReleases = artistData.releases.albums.releases;
        let albumReleases = [];
        let singleReleases = artistData.releases.singles.releases;
        let totalNumberOfStreams = 0;
        let totalNumberOfStreamsFromSingles = 0;
        let missingAlbums = [];

        console.log("loading t4ils response...")

        if (unfilteredAlbumReleases !== undefined){
            let albumsToRemove = [];

            if (unfilteredAlbumReleases.length !== 1){
                for (let i = 0; i < unfilteredAlbumReleases.length; i++){
                    let innerLoopAlbumReleases = unfilteredAlbumReleases.filter((album) => (album.uri !== unfilteredAlbumReleases[i].uri));
                    for (let j = 0; j < innerLoopAlbumReleases.length; j++){
                        if (unfilteredAlbumReleases[i].discs !== undefined && innerLoopAlbumReleases[j].discs){
                            let outerLoopFirstSong = unfilteredAlbumReleases[i].discs[0].tracks[0];
                            let innerLoopFirstSong = innerLoopAlbumReleases[j].discs[0].tracks[0];

                            if (outerLoopFirstSong.playcount === innerLoopFirstSong.playcount){
                                albumsToRemove.push(unfilteredAlbumReleases[i].track_count < innerLoopAlbumReleases[j].track_count ? unfilteredAlbumReleases[i].uri : innerLoopAlbumReleases[j].uri)
                            }
                        }
                    }
                }
            }

            albumReleases = unfilteredAlbumReleases.filter(album => !albumsToRemove.includes(album.uri));
            artistData.releases.albums.releases = albumReleases;

            for (let i = 0; i < albumReleases.length; i++){
                artistData.releases.albums.releases[i].discs = artistData.releases.albums.releases[i].discs === undefined ? [] : artistData.releases.albums.releases[i].discs
                let discs = albumReleases[i].discs;
                let totalAlbumStreams = 0;
                let totalSongs = 0;
    

                for (let j = 0; j < discs.length; j++){
                    let totalDiscStreams = discs[j].tracks.reduce((acc, curr) => acc + curr.playcount, 0);

                    artistData.releases.albums.releases[i].discs[j].totalStreams = totalDiscStreams;
                    totalAlbumStreams += totalDiscStreams;
                    totalSongs += discs[j].tracks.length;
                }
                if (totalSongs === 0){
                    missingAlbums.push(albumReleases[i].name);
                }

                artistData.releases.albums.releases[i].totalStreams = totalAlbumStreams;
                artistData.releases.albums.releases[i].totalSongs = totalSongs;
                totalNumberOfStreams += totalAlbumStreams;
            }
            artistData.releases.albums.missingAlbums = missingAlbums;


        } else {
            artistData.releases.albums.releases = []
            artistData.releases.albums.missingAlbums = [];
        }

        if (singleReleases !== undefined){
            for (let i = 0; i < singleReleases.length; i++){
                artistData.releases.singles.releases[i].discs = artistData.releases.singles.releases[i].discs === undefined ? [] : artistData.releases.singles.releases[i].discs
                let discs = singleReleases[i].discs;
                let totalAlbumStreams = 0;
                let totalSongs = 0;

                for (let j = 0; j < discs.length; j++){
                    let totalDiscStreams = discs[j].tracks.reduce((acc, curr) => acc + curr.playcount, 0);
                    artistData.releases.singles.releases[i].discs[j].totalStreams = totalDiscStreams;
                    totalAlbumStreams += totalDiscStreams;
                    totalSongs += discs[j].tracks.length;
                }

                artistData.releases.singles.releases[i].totalStreams = totalAlbumStreams;
                artistData.releases.singles.releases[i].totalSongs = totalSongs;

                totalNumberOfStreams += totalAlbumStreams;
                totalNumberOfStreamsFromSingles += totalAlbumStreams;
            }
        } else {
            artistData.releases.singles.releases = [];
        }

        const minAmountOfEarnings = (totalNumberOfStreams * 0.003).toLocaleString('en-US', {maximumFractionDigits:0});
        const maxAmountOfEarnings = (totalNumberOfStreams * 0.005).toLocaleString('en-US', {maximumFractionDigits:0});

        const minAmountOfEarningsFromSingles = (totalNumberOfStreamsFromSingles * 0.003).toLocaleString('en-US', {maximumFractionDigits:0});
        const maxAmountOfEarningsFromSingles = (totalNumberOfStreamsFromSingles * 0.005).toLocaleString('en-US', {maximumFractionDigits:0});

        artistData.releases.minAmountOfEarnings = minAmountOfEarnings;
        artistData.releases.maxAmountOfEarnings = maxAmountOfEarnings;

        artistData.releases.singles.totalSingleStreams = totalNumberOfStreamsFromSingles.toLocaleString('en-US', {maximumFractionDigits:0});
        artistData.releases.singles.minAmountOfEarnings = minAmountOfEarningsFromSingles;
        artistData.releases.singles.maxAmountOfEarnings = maxAmountOfEarningsFromSingles;
        
        return res.json(artistData);
    })
    .catch((error) => {
        return error
    })
});

module.exports = router;