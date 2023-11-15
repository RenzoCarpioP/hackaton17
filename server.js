const express = require('express');
const app = express();
//const https = require('https')
//const fs = require('fs')
/*const httpsOptions = {
    key: fs.readFileSync('./security/key.pem'),
    cert: fs.readFileSync('./security/cert.pem')
}*/

app.set('view engine', 'ejs');
var access_token = "";

// Import the axios library, to make HTTP requests
const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientgID = 'bbf1a0800f1c368a19ce'
const clientgSecret = '62b508956c711c829f28afc0c4b2fcf9499d0229'
const clientlID = '778o0oivy0yvbz'
const clientlSecret = 'J5OdpznLcsML7Hgq'

// Declare the callback route
app.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestgToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientgID}&client_secret=${clientgSecret}&code=${requestgToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/successGithub');
  })
})

app.get('/linkedin/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestlToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://www.linkedin.com/oauth/v2/accessToken?client_id=${clientlID}&client_secret=${clientlSecret}&grant_type=authorization_code&code=${requestlToken}&redirect_uri=https://hackaton17webazure.azurewebsites.net/linkedin/callback`,

    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/successLinkedIn');
  })
})

app.get('/successGithub', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/successgithub',{ userData: response.data });
  })
});

app.get('/successLinkedIn', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.linkedin.com/v2/userinfo`,
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  }).then((response) => {
    res.render('pages/successlinkedin',{ userData: response.data });
  })
});

app.get('/', function(req, res) {
  res.render('pages/index',{clientg_id: clientgID, clientl_id: clientlID});
});


/*const port = 8080;
const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
    })*/

// Listen 
app.listen(8080, () => {
  console.log("Server started at port 8080");
}); 