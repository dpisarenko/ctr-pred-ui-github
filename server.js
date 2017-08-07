//server.js
'use strict'
//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var User = require('./model/users');
var File = require('./model/files')
var CtrEstimate = require('./model/ctrEstimate')
var DataProcessingError = require('./model/dataProcessingError')
var jsSHA = require('sha.js')
var nodemailer = require('nodemailer')
var mailGun = require('nodemailer-mailgun-transport')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

// mongoDB contains the credentials for accessing a Mongo database on mLab
var mongoDB = 'mongodb://';
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

function isNotNull(obj)
{
 return obj && obj !== 'null' && obj !== 'undefined';
}

function isNull(obj)
{
 return !isNotNull(obj);
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

function calculateHash(pw) {
  var sha256 = new jsSHA('sha256');
  sha256.update(pw);
  return sha256.digest('hex');
}

function isAdmin(emailAddr, pw) {
  return (emailAddr.trim() === "dp@altruix.co") 
    && (pw.trim() === '4F!<ij5MLRw><vqrd1%Nno5S7OS}&+')
}

router.route('/mail')
  .post(function (req, res) {
    var emailAddr = req.body.email;
    var pw = req.body.pw;
    console.log("emailAddr:" + emailAddr)
    console.log("pw:" + pw)
    res.json({success: true})
    // Uncomment the following code to actually send the mail
    /*
    var auth = {
      auth: {
        api_key: '',
        domain: ''
      }
    }
    var nodemailerMailgun = nodemailer.createTransport({
      service: 'Mailgun',
      auth: {
       user: '',
       pass: ''   
      }
    })
    nodemailerMailgun.sendMail({
      from: 'dp@altruix.co',
      to: emailAddr, // An array if you have multiple recipients.
      subject: "Access credentials",
      text: 'Your password: ' + pw,
    }, function (err, info) {
      if (err) {
        console.log('Error: ' + err);
      }
      else {
        console.log('Response: ' + info);
      }
    });
    */
  })

router.route('/auth')
  .post(function(req, res) {
    var emailAddr = req.body.email;
    var pw = req.body.pw
    var success = false
    var activated = false
    if (isAdmin(emailAddr, pw)) {
      success = true
      activated = true
      res.json({success: success, activated: activated, admin: true})
      return
    }
    var hash = calculateHash(pw)
    User.findOne({email: emailAddr, pwHash: hash}, function(err, doc) {
      if (err) {
        res.send(err);
        return
      }
      success = true
      activated = doc.activated
      res.json({success: success, activated: activated, admin: false})
      return
    })
  })

router.route('/unactivated-users')
  .get(function(req, res) {
    User.find({activated: false, rejected: false}, function(err, docs) {
      if (err) {
        res.send(err);
      }
      res.json(docs)
    });
  })

router.route('/activateUser')
  .post(function (req, res) {
    var emailAddr = req.body.email;
    var conditions = {email: emailAddr}
    var update = {activated: true}
    User.update(conditions, update, {}, function(err, numAffected) {
      if (err) {
        res.send(err)
      }
    })
  })

router.route('/rejectUser')
  .post(function (req, res) {
    var emailAddr = req.body.email;
    var conditions = {email: emailAddr}
    var update = {rejected: true}
    User.update(conditions, update, {}, function(err, numAffected) {
      if (err) {
        res.send(err)
      }
    })
  })

router.post('/campaign-data', upload.single("file"), function (req, res) {
    var emailAddr = req.body.email;
    var filename = req.file.filename
    var file = new File({
      email: emailAddr, 
      filename: filename
    })
    file.save(function(err) {
      if (err) {
        res.json({ success: false, errorMessage: 'File could not be created (DB error)'});
      }
      res.json({ success: true, errorMessage: ''});
    });
  })

function saveDoc(doc) {
  doc.save(function(err) {
    if (err) {
      console.log("err:" + err)
      return
    }
    console.log("Object saved successfully")
  })
}

router.route('/insert-sample-data')
  .post(function(req, res) {
    saveDoc(
      new CtrEstimate({
        email:'dp@altruix.cc',
        keywords:'buy car berlin',
        ctrEstimate:0.5
      })
    )
    saveDoc(
      new CtrEstimate({
        email:'dp@altruix.cc',
        keywords:'buy VW berlin',
        ctrEstimate:0.7
      })
    )
    saveDoc(
      new CtrEstimate({
        email:'dp@altruix.cc',
        keywords:'buy BMW berlin',
        ctrEstimate:2.5
      })
    )
    saveDoc(
      new DataProcessingError({
        email: 'dp@altruix.cc',
        message: "Error: The submitted file 'sampleFile.dat' is not an Excel document."
      })
    )
    saveDoc(
      new DataProcessingError({
        email: 'dp@altruix.cc',
        message: "Warning: The file 'myFile.xls' does not contain a list of keyword combinations," +
        " for which CTR rates can be estimated."
      })
    )      
    res.json({success: true})
  })
  
router.route('/users')
  .post(function(req, res) {
    var emailAddr = req.body.email;
    User.findOne({email: emailAddr}, function(err, doc) {
      if (err) {
        res.send(err);
      }
      if (isNull(doc)) {
        var pw = generatePassword()
        var hash = calculateHash(pw)
        var user = new User({
          email: emailAddr, 
          pwHash: hash, 
          activated: false, 
          rejected:false
        })
        user.save(function(err) {
          if (err) {
            res.json({ success: false, errorMessage: 'User could not be created (DB error)', result: '' });
          }
          res.json({ success: true, errorMessage: '', result: pw });
        });
      } else {
        console.log("User with the e-mail already exists")
        res.json({ success: false, errorMessage: 'User with the e-mail already exists' });
      }
    });
  });

router.route('/ctr-estimates')
  .post(function(req, res) {
    var emailAddr = req.body.email;
    CtrEstimate.find({email: emailAddr}, function(err, docs) {
      if (err) {
        res.send(err)
      }
      res.json(docs)
    })
  })

router.post('/data-proc-errors', function(req, res) {
  var emailAddr = req.body.email;
  DataProcessingError.find({email: emailAddr}, function(err, docs) {
    if (err) {
      res.send(err)
    }
    res.json(docs)
  })
})

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});