/*
 db/schema.js contains database schema description for application models
 by default (when using jugglingdb as ORM) this file uses database connection
 described in config/database.json. But it's possible to use another database
 connections and multiple different schemas, docs available at

 http://railwayjs.com/orm.html

 Example of model definition:

 define('User', function () {
     property('email', String, { index: true });
     property('password', String);
     property('activated', Boolean, {default: false});
 });

 Example of schema configured without config/database.json (heroku redistogo addon):
 schema('redis', {url: process.env.REDISTOGO_URL}, function () {
     // model definitions here
 });

*/

var List = describe('List', function () {
    property('name', String);
    set('restPath', pathTo.lists);
});

var Ebay = describe('Ebay', function () {
    property('ebay_id', String);
    set('restPath', pathTo.ebays);
});

var Ebaysale = describe('Ebaysale', function () {
    property('id', String);
    property('transaction_id', String);
    property('item_id', String);
    property('ebay_id', String);
    property('actual_shipping_cost', String);
    property('cost', String);
    set('restPath', pathTo.ebaysales);
});

