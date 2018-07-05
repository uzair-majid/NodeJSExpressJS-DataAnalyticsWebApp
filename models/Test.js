var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/** Schema Creation **/



const testSchema = new mongoose.Schema({
	    user: {
	        type: String
    },
    year: {
        type: String
    },
    count: {
        type: Number
    }

}); 
/** Schema Creation **/

/**************************** Rohin's User Stories ****************************/

/* Top 3 Articles with the largest amnount of revisions */

testSchema.statics.getTopArticleList = function (articleNum) {

	return this.aggregate([

		{ '$group': { _id: "$title", count: { $sum: 1 } } },
		{ '$sort': { count: -1 } },
		{ '$limit': articleNum}
		]);
}

/* Top 3 Articles with the smallest amnount of revisions */

testSchema.statics.getBottomArticleList = function (articleNum) {
	return this.aggregate([
		{'$group':{_id:"$title", count: {$sum: 1}}},
		{'$sort':{count:1}},
		{'$limit':articleNum}
    ])	
}

/* Top 3 oldest articles according to creation date */
testSchema.statics.getOldestArticleList = function () {
    return this.aggregate([
        { '$sort': { 'timestamp': 1 } },    
     { '$group': 
            { 
            _id: "$title", 
            Created:{'$first':'$timestamp'} 
            }
    },
    {
     '$project':
            {
            
                age_Years: { "$divide": [{"$subtract": [ new Date(), "$Created" ] }, (365*24*60*60*1000)] }
            }
    },
    
    {'$sort':{age_Years:-1}}, 
    
    {'$limit':3}
]
    // { allowDiskUse : true } = mongoshell query //
).allowDiskUse(true); // comment out in mongoshell //
}


/* Top 3 latest articles according to creation date */
testSchema.statics.getAgeLatestArticleList = function () {
    return this.aggregate([
        { '$sort': { 'timestamp': 1 } },    
     { '$group': 
            { 
            _id: "$title", 
            Created:{'$first':'$timestamp'} 
            }
    },
    {
     '$project':
            {
            
                age_Years: { "$divide": [{"$subtract": [ new Date(), "$Created" ] }, (365*24*60*60*1000)] }
            }
    },
    
    {'$sort':{age_Years:1}}, 
    
    {'$limit':3}
]
    // { allowDiskUse : true } = mongoshell query //
).allowDiskUse(true); // comment out in mongoshell //
}

/**************************** Rohin's User Stories ****************************/


testSchema.statics.getOtherRevisions = function () {
    var result = this.aggregate([
        { '$match': { anon: null } },
        { '$group': { _id: "$user", count: { $sum: 1 } } }
         
    ]
    )

     
    return result;
} 

testSchema.statics.getAnonRevisions = function () {

    var result = this.find({ anon: '' }).count();


    return result;

}

testSchema.statics.getOtherRevisionsByYearAndUser = function () {


    var result = this.aggregate([

        { '$match': { anon: null } },
        {
            $project: {

                year: { "$substr": ["$timestamp", 0, 4] },
                user: 1,
                //title:1
            }
        },

        {
            '$group': {
                _id: { year: '$year', user: '$user' },
                count: { '$sum': 1 }
            }
        },

        {
            '$group': {
                _id: { year: '$_id.year' }, user: {
                    $push: {
                        user: "$_id.user", count: "$count"
                    }
                }

            }
        },
        { '$sort': { "_id.year": 1 } }
         



    ])

    return result;

}

testSchema.statics.getAnonRevisionsByYearAndUser = function () {
    var result = this.aggregate([
        { '$match': { anon: '' } },
        { '$group': { _id: { "$substr": ["$timestamp", 0, 4] }, count: { $sum: 1 } } },
        { '$sort': { "_id": 1 } }])
    return result;
}

//Returns titles of all articles written by a given author (and the number of revisions for each article)
testSchema.statics.getArtcilesEdittedByAnAuthor = function (authorName) {
	return this.aggregate([
		{ $match: { user: authorName } },
		{ $group: { _id: "$title", count: { $sum: 1 }} },
		{ $sort: { count: -1 } }
	]);
}

//Returns the time stamps of revisions by a specifc user for a specifc article
testSchema.statics.getTimestamps = function (authorName, articleName) {
	return this.find(
		{ 'user': authorName, 'title': articleName },
        { 'timestamp': true },
	).sort({'timestamp':1})
}

/*
SUMMARY INFO
Summary Info of article consists of title, total num of revisions, top users (based on num of revisions)

The following functions find these
*/

//Gets total number of revisions for a specifc article
testSchema.statics.getNumRevisions = function (articleName) {
	return this.aggregate([
		{ $match: { title: articleName } },
		{ $group: { _id: "$title", count: { $sum: 1 } } }
	]);
}

//Gets top users for a specifc article
testSchema.statics.getTopUsers = function (articleName, numUsers) {
	return this.aggregate([
		{ $match: { title: articleName } },
		{ $group: { _id: "$user", count: { $sum: 1 } } },
		{ '$sort': { count: -1 } },
		{ '$limit': numUsers }
	]);
}

testSchema.statics.getTitleOtherRevisionsByUser = function (articlename) {
    return this.aggregate([
        { $match: { title: articlename, anon: null } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { '$sort': { count: 1 } },

    ]);
}

testSchema.statics.getTitleAnonRevisionsByUser = function (articlename) {
    return this.aggregate([
        { $match: { title: articlename, anon: '' } },
        { $group: { _id: "$user", count: { $sum: 1 } } },
        { '$sort': { count: -1 } },

    ]);
}

testSchema.statics.getTitleOtherRevisionsByYearAndUser = function (articlename) {


    var result = this.aggregate([

        { '$match': { title: articlename ,anon: null } },
        {
            $project: {

                year: { "$substr": ["$timestamp", 0, 4] },
                user: 1,
                //title:1
            }
        },

        {
            '$group': {
                _id: { year: '$year', user: '$user' },
                count: { '$sum': 1 }
            }
        },

        {
            '$group': {
                _id: { year: '$_id.year' }, user: {
                    $push: {
                        user: "$_id.user", count: "$count"
                    }
                }

            }
        },
        { '$sort': { "_id.year": 1 } }




    ])

    return result;

}

testSchema.statics.getTitleAnonRevisionsByYearAndUser = function (articlename) {
    var result = this.aggregate([
        { '$match': { title: articlename ,anon: '' } },
        { '$group': { _id: { "$substr": ["$timestamp", 0, 4] }, count: { $sum: 1 } } },
        { '$sort': { "_id": 1 } }])
    return result;
}

testSchema.statics.getTitleAndUserRevisionsByYear = function (articlename,user) {
    var result = this.aggregate([

        { '$match': { title: articlename, user: user } },
        { '$group': { _id: { "$substr": ["$timestamp", 0, 4] }, count: { $sum: 1 } } },
        { '$sort': { "_id": 1 } }
    ])
    return result;
}

testSchema.statics.getTitleLargestRegisteredUserRevisions = function () {
    var result = this.aggregate([

        { '$match': { anon: null } },

        {
            '$group': {
                _id: { title: '$title', user: '$user' },
                count: { '$sum': 1 }
            }
        },
        {
            '$group': {
                _id: { title: '$_id.title' }, user: {
                    $push: {
                        user: "$_id.user"
                    }
                }

            }
        }
    ])

    return result;
}
 


testSchema.statics.getAllArticleTitles = function() {

    return this.aggregate([

		{ '$group': { _id: "$title", count: { $sum: 1 } } },
        {'$sort':{ _id: 1 }  }

		]);

}


testSchema.statics.getLastUpdatedTime = function(articlename){
    var result = this.aggregate([
        {'$match':{'title':articlename}},
        {'$group':{_id:"$timestamp"}},
        {'$sort':{_id:-1}},
        {'$limit':1}
        ])
    return result;
}

//Finds all users containing a string in their name (case insensitive)
testSchema.statics.getUserMatching = function(titleString) {
    return this.aggregate([
       // {'$match':{"user" : {$regex: /tvo/i}}},
       {'$match':{"user" : {$regex: new RegExp(titleString, "i")}}},
        {'$group': {_id:'$user'}}
        ])
}



module.exports = mongoose.model('Revision', testSchema);

var Revision = mongoose.model('Revision', testSchema, 'revisions');
 
 
module.exports = Revision;
 

