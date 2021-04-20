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

module.exports = router;