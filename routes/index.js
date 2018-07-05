const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { catchErrors } = require('../handlers/errorHandlers');
 
//router.get('/', catchErrors((testController.getOverall)));
 
 
//router.get('/loggedIn', catchErrors(testController.overview));

router.post('/loggedIn', catchErrors(testController.overview));



router.get('/loggedIn', catchErrors(testController.overview));

router.get('/', function (req, res) {
    res.sendfile('public/views/landingPage.html',{ root: global.rootDir })
})

//Overview Charts
router.get('/pieData', catchErrors(testController.getRevisionsPie));
router.get('/barData', catchErrors(testController.getRevisionsBar));


//Overview Functions
router.get('/getTopRevs', catchErrors(testController.getTopRevs));
router.get('/getBotRevs', catchErrors(testController.getBotRevs));
router.get('/getOldestArticles', catchErrors(testController.getOldestArticles));
router.get('/getNewestArticles', catchErrors(testController.getNewestArticles));
router.get('/getLargestRegoUser', catchErrors(testController.getLargestRegoUser));
router.get('/getLeastRegoUser', catchErrors(testController.getLeastRegoUser));


//router.get('/getTopRevs', catchErrors(testController.getTopRevs));
//router.get('/getBotRevs', catchErrors(testController.getBotRevs));
//router.get('/getOldestArticles', catchErrors(testController.getOldestArticles));
//router.get('/getNewestArticles', catchErrors(testController.getNewestArticles));

 
 
//router.get('/getAuthorArticleList', catchErrors(testController.getAuthorArticleList));
 
 
//router.get('/getAuthorArticleList', catchErrors(testController.getAuthorArticleList));


router.get('/getAuthorArticleList', catchErrors(testController.getAuthorArticleList));
router.get('/getTimestamps', catchErrors(testController.getTimestamps));

//Individual Article Functions
router.get('/getAllArticleTitles', catchErrors(testController.getAllArticleTitles));
router.get('/getTopUsersForArticle', catchErrors(testController.getTopUsersForArticle));
router.get('/pieDataIndividualArticle', catchErrors(testController.getRevisionsPieByTitle));
router.get('/barDataIndividualArticle', catchErrors(testController.getRevisionsBarByTitle));
router.get('/barDataSpecificUser', catchErrors(testController.getRevisionsBarByTitleAndUser));
router.get('/getLastTime', catchErrors(testController.getLastTime));

//Login/Register Functions
router.post('/register', catchErrors(testController.addUser));
router.post('/checkuser', catchErrors(testController.loginUser));


 

//router.get('/pieData', catchErrors(testController.getRevisionsPieByTitle));
//router.get('/barData', catchErrors(testController.getRevisionsBarByTitle));

//router.get('/', catchErrors(testController.getRevisionsBarByTitleAndUser));
//router.get('/', catchErrors(testController.getLargestAndLowestRevisionsByRegisteredUser));

//router.get('/', testController.homePage);

module.exports = router;