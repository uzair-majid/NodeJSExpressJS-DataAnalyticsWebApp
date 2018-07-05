
const mongoose = require('mongoose');
const Revision = mongoose.model('Revision');
const User = mongoose.model('User');

var fs = require("fs");

exports.homePage = (req, res) => {
    res.render("overview");
};


exports.addUser = async (req, res) => {
    var uname = req.body.uname;
    var pass = req.body.pass;
    var email = req.body.email;
    var check = {};
    check.success = null;

    // console.log(uname+"----"+ pass);

    var newuser = new User({ username: uname, password: pass, email: email });
    var checkuser = await User.getUser(newuser);

    if (checkuser != null) {
        // req.flash('info', 'username or email already taken');
        check.success = false;
        // return;
    }
    else {

        if (newuser.username != null) {
            var result = await User.saveUser(newuser);
            check.success = true;
            // res.render('landingPage.html');
        }

    }
    // console.log(check.success);
    res.send(check);

}




exports.loginUser = async (req, res) => {


    var email = req.body.email;
    var pass = req.body.password;
    var check = {};
    check.success = false;
    var username = ""
    var user = new User({ username: username, email: email });
    var checkuser = await User.getUser(user);
    if (checkuser == null) {
        success = false; //  // incorrect email or password!
    }

    else {
        if (checkuser != null && (pass === checkuser.password && email == checkuser.email)) {

            // success = false;
            check.success = true;
            sess = req.session;
            sess.authorised = true;
        }




    }
    res.send(check);


}



exports.overview = async (req, res) => {

    sess = req.session;

    if ("authorised" in sess) {
        console.log('user is logged in')
        //Render the pug file
        res.render('overview');

    } else {
        console.log('user needs to log in')
        res.sendFile('public/views/landingPage.html',{ root: global.rootDir });
    }

}

/******* Add below functions to getOverall controller above *******/
exports.getRevisionsPie = async (req, res) => {
    // 1. Query the database for articles
    // const r = await Rev.getRevisions();

    const a = await Revision.getOtherRevisions();
    // console.log(a);
    //var x = a;
    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    var botnumber = 0;
    var adminnumber = 0;
    var regularnumber = 0;

    const anonnumber = await Revision.getAnonRevisions();

    for (var i = 0; i < a.length; i++) {
        var user = a[i]._id;
        if (adminnames.indexOf(user, 0) > -1) {
            adminnumber += a[i].count;
        }
        else if (botnames.indexOf(user, 0) > -1) {
            botnumber += a[i].count;
        }
        else {
            regularnumber += a[i].count;
        }

    }

    var response = { 'Regular': regularnumber, 'Bot': botnumber, 'Admin': adminnumber, 'Anon': anonnumber }
    console.log(response);
    res.json(response);


}

exports.getRevisionsBar = async (req, res) => {
    // 1. Query the database for articles
    // const r = await Rev.getRevisions();

    const a = await Revision.getOtherRevisionsByYearAndUser();
    // console.log(a);

    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    // var botnumber = 0;
    // var adminnumber = 0;
    //var regularnumber = 0;
    var output = [];
    var anon = await Revision.getAnonRevisionsByYearAndUser();
    var response = [];

    for (var i = 0; i < a.length; i++) {
        var year = a[i]._id;
        var newYear = year.year;
        var anonnumber = (i < anon.length) ? anon[i].count : 0; // dont let anon index catch a exception
        var userarray = a[i].user;
        var botnumber = 0;
        var adminnumber = 0;
        var regularnumber = 0; 1

        for (var j = 0; j < userarray.length; j++) {
            var user = userarray[j].user;  // each user in user array
            var count = userarray[j].count;
            if (adminnames.indexOf(user, 0) > -1) {
                adminnumber += count;
            }
            else if (botnames.indexOf(user, 0) > -1) {
                botnumber += count;
            }
            else {
                regularnumber += count;
            }
        }
        output.push({ year: year, regularusers: regularnumber, adminusers: adminnumber, botusers: botnumber, anonusers: anonnumber });
        response[i] = { 'Year': newYear, 'RegularUsers': regularnumber, 'Bots': botnumber, 'Admins': adminnumber, 'Anon': anonnumber };


    }

    console.log(response);
    res.json(response);

}

exports.getRevisionsPieByTitle = async (req, res) => {

    var input = req.query.title;

    const a = await Revision.getTitleOtherRevisionsByUser(input);
    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    var botnumber = 0;
    var adminnumber = 0;
    var regularnumber = 0;
    var anonnumber = 0;
    const b = await Revision.getTitleAnonRevisionsByUser(input);

    for (var i = 0; i < a.length; i++) {
        var user = a[i]._id;
        if (adminnames.indexOf(user, 0) > -1) {
            adminnumber += a[i].count;
        }
        else if (botnames.indexOf(user, 0) > -1) {
            botnumber += a[i].count;
        }
        else {
            regularnumber += a[i].count;
        }

    }

    for (var i = 0; i < b.length; i++) {
        anonnumber += b[i].count       // sum all anon user revisions
    }

    console.log("Regular: " + regularnumber);
    console.log("Bot: " + botnumber);
    console.log("Admin: " + adminnumber);
    console.log("Anon: " + anonnumber);

    var response = { 'Regular': regularnumber, 'Bot': botnumber, 'Admin': adminnumber, 'Anon': anonnumber };
    res.send(response);

}

exports.getRevisionsBarByTitle = async (req, res) => {
    // 1. Query the database for articles
    // const r = await Rev.getRevisions();

    var input = req.query.title;

    const a = await Revision.getTitleOtherRevisionsByYearAndUser(input);
    // console.log(a);

    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    // var botnumber = 0;
    // var adminnumber = 0;
    //var regularnumber = 0;
    var output = [];
    var anon = await Revision.getTitleAnonRevisionsByYearAndUser(input);
    var response = [];

    for (var i = 0; i < a.length; i++) {
        var year = a[i]._id;
        var newYear = year.year;
        var anonnumber = (i < anon.length) ? anon[i].count : 0; // dont let anon index catch a exception
        var userarray = a[i].user;
        var botnumber = 0;
        var adminnumber = 0;
        var regularnumber = 0;

        for (var j = 0; j < userarray.length; j++) {
            var user = userarray[j].user;  // each user in user array
            var count = userarray[j].count;
            if (adminnames.indexOf(user, 0) > -1) {
                adminnumber += count;
            }
            else if (botnames.indexOf(user, 0) > -1) {
                botnumber += count;
            }
            else {
                regularnumber += count;
            }
        }
        output.push({ year: year, regularusers: regularnumber, adminusers: adminnumber, botusers: botnumber, anonusers: anonnumber });
        response[i] = { 'Year': newYear, 'RegularUsers': regularnumber, 'Bots': botnumber, 'Admins': adminnumber, 'Anon': anonnumber };


    }

    console.log(output);
    res.json(response);


}

exports.getRevisionsBarByTitleAndUser = async (req, res) => {

    const a = await Revision.getTitleAndUserRevisionsByYear(req.query.title, req.query.user);
    var response = [];
    for (var i = 0; i < a.length; i++) {
        response[i] = { 'Year': a[i]._id, 'Revisions': a[i].count };

    }

    console.log(response);
    res.send(response);
}

exports.getLargestRegoUser = async (req, res) => {

    const a = await Revision.getTitleLargestRegisteredUserRevisions();

    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    var check = [];
    var output = [];
    var regularnumber = 0;

    for (var i = 0; i < a.length; i++) {
        var title = a[i]._id;
        var userarray = a[i].user;


        for (var j = 0; j < userarray.length; j++) {
            var user = userarray[j].user;  // each user in user array


            if (adminnames.indexOf(user, 0) > -1 || botnames.indexOf(user, 0) > -1) { // if user is not registered , move to next user
                continue;
            }

            else {
                regularnumber++; //count regular users within article
            }
        }
        check[i] = { 'title': title, 'users': regularnumber }
    }
    check.sort(function (a, b) {
        return (a.users - b.users);
    });

    most = check[check.length - 1].title.title;

    res.send(most);

}

exports.getLeastRegoUser = async (req, res) => {

    const a = await Revision.getTitleLargestRegisteredUserRevisions();

    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    var adminnames = admin.split("\n").sort();
    var botnames = bot.split("\n").sort();
    var check = [];
    var output = [];
    var regularnumber = 0;

    for (var i = 0; i < a.length; i++) {
        var title = a[i]._id;
        var userarray = a[i].user;


        for (var j = 0; j < userarray.length; j++) {
            var user = userarray[j].user;  // each user in user array


            if (adminnames.indexOf(user, 0) > -1 || botnames.indexOf(user, 0) > -1) { // if user is not registered , move to next user
                continue;
            }

            else {
                regularnumber++; //count regular users within article
            }
        }
        check[i] = { 'title': title, 'users': regularnumber }
    }
    check.sort(function (a, b) {
        return (a.users - b.users);
    });

    least = check[0].title.title;

    res.send(least);

}

/******* Add above functions to getOverall controller *******/

function readfile(adminarray, botarray) {

    var admin = fs.readFileSync("./Admin.txt").toString();
    var bot = fs.readFileSync("./Bot.txt").toString();
    adminarray = admin.split("\n").sort();
    botarray = bot.split("\n").sort();
    return adminarray, botarray;
}


/*
New functions for the AJAX version
*/


exports.getTopRevs = async (req, res) => {

    var articleNum = Number(req.query.quantity);

    if (typeof req.query.quantity == 'undefined') { //if there is no quantity value, return to default val of 3
        articleNum = 3;
    }

    result = await Revision.getTopArticleList(articleNum);

    res.send(result);

}


exports.getBotRevs = async (req, res) => {

    var articleNum = Number(req.query.quantity);

    if (typeof req.query.quantity == 'undefined') { //if there is no quantity value, return to default val of 3
        articleNum = 3;
    }

    result = await Revision.getBottomArticleList(articleNum);

    res.send(result);

}

exports.getOldestArticles = async (req, res) => {

    result = await Revision.getOldestArticleList();

    res.send(result);

}

exports.getNewestArticles = async (req, res) => {

    result = await Revision.getAgeLatestArticleList();

    res.send(result);

}

exports.getAuthorArticleList = async (req, res) => {

    var name = req.query.authorName;

    //First get the names of all users with matching the string
    var userList = await Revision.getUserMatching(name);
    console.log("this is the userlist " + userList.length + " this is the end")
    var resultList = [];
    for (var x = 0; x < userList.length; x++) {
        console.log(userList[x]._id)
        var addToResultList = await Revision.getArtcilesEdittedByAnAuthor(userList[x]._id)
        console.log(addToResultList.length)
        for (var z = 0; z < addToResultList.length; z++) {
            var myIndex = resultList.length;
            resultList[myIndex] = addToResultList[z]
            resultList[myIndex].user = userList[x]._id;
        }
    }
    console.log('result list:' + resultList.length)

    //result = await Revision.getArtcilesEdittedByAnAuthor(name)
    res.send(resultList);

}

exports.getAllArticleTitles = async (req, res) => {
    var newresult = await Revision.getAllArticleTitles();
    res.send(newresult);
}


exports.getTopUsersForArticle = async (req, res) => {

    var artTitle = req.query.title;

    result = await Revision.getTopUsers(artTitle, 5);
    res.send(result)
}


exports.getLastTime = async (req, res) => {

    var searchedArticle = req.query.title;

    var j = await Revision.getLastUpdatedTime(searchedArticle);
    var lastupdated = j[0]._id;
    res.json(lastupdated);

}
exports.getTimestamps = async (req, res) => {

    result = await Revision.getTimestamps(req.query.title, req.query.authorName);

    res.send(result)

}