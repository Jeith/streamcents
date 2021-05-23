var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
}); 

/* GET about page. */
router.get('/about', (req, res, next) => {
  res.render('about');
}); 

/* GET artist details page. */
router.get('/artist/:artistId', (req, res, next) => {
  let artistId = req.params.artistId;

  axios.get(`http://localhost:1337/api/get-artist-info/${artistId}`)
  .then((playcountResponse) => {
    let data = playcountResponse.data;
    data.biography = null;

    res.render('artist-details', {data});
  })
  .catch((error) => {
    res.render('index');
  });
});

/* GET 404 page. */
// router.get('/404', (req, res, next) => {
//   res.render('404');
// }); 

module.exports = router;