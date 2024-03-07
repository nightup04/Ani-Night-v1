const express = require("express")
const app = express()
const path = require("path")
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const indexRoute = require("./routes/index")
const dashboard = require('./routes/dashboard')
const editActicleRoute = require('./routes/edit')
const searchRoute = require('./routes/search')
const rulesRoute = require('./routes/rules')
const commentRoute = require('./routes/comment') 
const readeRoute = require("./routes/read")
const playRoute = require("./routes/play")
const channelRoute = require("./routes/channel") 
const acticleRoute = require("./routes/actcile")
const trendingRoute = require("./routes/trending") 
const videosRoute = require("./routes/videos")
const loginRoute = require('./routes/pages/login') 
const singupRoute = require("./routes/pages/singup")
const profileRoute = require("./routes/pages/profile")
const videosprofileRoute = require("./routes/pages/videos/videos")
const vidoechannelRoute = require("./routes/pages/channel/video")
const uploadRoute = require('./routes/pages/uploads/uplaods')
const updateReward = require('./routes/admin/updateReward')
const admin = require('./routes/admin')

app.use(session({
    secret: '12345678900987654321',
    resave: false,
    saveUninitialized: false
  }));

app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/public')));

app.use(uploadRoute)
app.use(updateReward)
app.use(admin)
app.use(indexRoute)
app.use(dashboard)
app.use(searchRoute)
app.use(rulesRoute)
app.use(editActicleRoute)
app.use(commentRoute)
app.use(readeRoute)
app.use(playRoute)
app.use(channelRoute)
app.use(acticleRoute)
app.use(trendingRoute)
app.use(videosRoute)
app.use(loginRoute)
app.use(singupRoute)
app.use(profileRoute)
app.use(videosprofileRoute) 
app.use(vidoechannelRoute) 

app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(3000,()=> { 
    console.log(`server is Runing to http://localhost:3000`)
})