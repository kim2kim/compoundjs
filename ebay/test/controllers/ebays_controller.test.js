var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function EbayStub () {
    return {
        ebay_id: ''
    };
}

describe('EbayController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /ebays/new
     * Should render ebays/new.ejs
     */
    it('should render "new" template on GET /ebays/new', function (done) {
        request(app)
        .get('/ebays/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/ebays\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /ebays
     * Should render ebays/index.ejs
     */
    it('should render "index" template on GET /ebays', function (done) {
        request(app)
        .get('/ebays')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/ebays\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /ebays/:id/edit
     * Should access Ebay#find and render ebays/edit.ejs
     */
    it('should access Ebay#find and render "edit" template on GET /ebays/:id/edit', function (done) {
        var Ebay = app.models.Ebay;

        // Mock Ebay#find
        Ebay.find = sinon.spy(function (id, callback) {
            callback(null, new Ebay);
        });

        request(app)
        .get('/ebays/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebay.find.calledWith('42').should.be.true;
            app.didRender(/ebays\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /ebays/:id
     * Should render ebays/index.ejs
     */
    it('should access Ebay#find and render "show" template on GET /ebays/:id', function (done) {
        var Ebay = app.models.Ebay;

        // Mock Ebay#find
        Ebay.find = sinon.spy(function (id, callback) {
            callback(null, new Ebay);
        });

        request(app)
        .get('/ebays/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebay.find.calledWith('42').should.be.true;
            app.didRender(/ebays\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /ebays
     * Should access Ebay#create when Ebay is valid
     */
    it('should access Ebay#create on POST /ebays with a valid Ebay', function (done) {
        var Ebay = app.models.Ebay
        , ebay = new EbayStub;

        // Mock Ebay#create
        Ebay.create = sinon.spy(function (data, callback) {
            callback(null, ebay);
        });

        request(app)
        .post('/ebays')
        .send({ "Ebay": ebay })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Ebay.create.calledWith(ebay).should.be.true;

            done();
        });
    });

    /*
     * POST /ebays
     * Should fail when Ebay is invalid
     */
    it('should fail on POST /ebays when Ebay#create returns an error', function (done) {
        var Ebay = app.models.Ebay
        , ebay = new EbayStub;

        // Mock Ebay#create
        Ebay.create = sinon.spy(function (data, callback) {
            callback(new Error, ebay);
        });

        request(app)
        .post('/ebays')
        .send({ "Ebay": ebay })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebay.create.calledWith(ebay).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /ebays/:id
     * Should redirect back to /ebays when Ebay is valid
     */
    it('should redirect on PUT /ebays/:id with a valid Ebay', function (done) {
        var Ebay = app.models.Ebay
        , ebay = new EbayStub;

        Ebay.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/ebays/1')
        .send({ "Ebay": ebay })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/ebays/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /ebays/:id
     * Should not redirect when Ebay is invalid
     */
    it('should fail / not redirect on PUT /ebays/:id with an invalid Ebay', function (done) {
        var Ebay = app.models.Ebay
        , ebay = new EbayStub;

        Ebay.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/ebays/1')
        .send({ "Ebay": ebay })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /ebays/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Ebay on DELETE /ebays/:id');

    /*
     * DELETE /ebays/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Ebay on DELETE /ebays/:id if it fails');
});
