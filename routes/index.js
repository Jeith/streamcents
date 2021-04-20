var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/favicon.ico', (req,res)=>{
  return 'your faveicon'
 })

/* GET artist details page. */
router.get('/:artistId', function(req, res, next) {
  let artistId = req.params.artistId;

  console.log("artistId1", artistId)

  axios.get(`http://localhost:1337/api/get-artist/${artistId}`)
  .then((response) => {
    console.log("response: ", response.data)
    res.render('artist-details');
  })
  .catch((error) => {
    res.render('index');
  })
});

module.exports = router;