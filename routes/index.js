var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/favicon.ico', (req,res)=>{
  return './'
 })

/* GET artist details page. */
router.get('/:artistId', function(req, res, next) {
  let artistId = req.params.artistId;

  // axios.get(`http://localhost:1337/api/get-artist/${artistId}`)
  // .then((response) => {
  //   console.log("response: ", response.data.response)

    axios.get(`http://localhost:1337/api/get-artist-info/${artistId}`)
    .then((playcountResponse) => {
      let data = playcountResponse.data;
      data.biography = null;

      res.render('artist-details', {data});
    })
    .catch((error) => {
      res.render('index');
    })
  // })
  // .catch((error) => {
  //   res.render('index');
  // })
});

module.exports = router;