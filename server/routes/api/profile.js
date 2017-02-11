/**
 * Created by ThinkPad on 2017/1/13.
 */
var express = require('express');
var router = express.Router();

var multer  = require('multer')
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


router.post( "/photoUpload", upload.single('photo') ,function ( req, res ) {
  req.redis.set( req.session.email +  req.ns.SEPARATOR +  req.ns.PHOTO, new Buffer( req.file.buffer ) )
    .then( function () {
      res.send( "ok" )
    } )
} )

router.get( '/photo/:email', function ( req, res ) {
  var email =  req.params.email
  req.redis.getBuffer( email +  req.ns.SEPARATOR + req.ns.PHOTO , function ( err, result ) {
    res.type( 'png' ).send( result )
  } )
} )

router.post( '/edit', function ( req, res ) {
  req.mongo.collection( 'user' ).updateOne( { email: req.session.email }, { $set: { profile: req.body } }, function () {
    res.send( "ok" )
  } )
})


module.exports = router
