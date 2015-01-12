var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function EbaysaleStub () {
    return {
        id: '',
        transaction_id: '',
        item_id: '',
        ebay_id: '',
        actual_shipping_cost: '',
        cost: ''
    };
}

describe('EbaysaleController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /ebaysales/new
     * Should render ebaysales/new.ejs
     */
    it('should render "new" template on GET /ebaysales/new', function (done) {
        request(app)
        .get('/ebaysales/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/ebaysales\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /ebaysales
     * Should render ebaysales/index.ejs
     */
    it('should render "index" template on GET /ebaysales', function (done) {
        request(app)
        .get('/ebaysales')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/ebaysales\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /ebaysales/:id/edit
     * Should access Ebaysale#find and render ebaysales/edit.ejs
     */
    it('should access Ebaysale#find and render "edit" template on GET /ebaysales/:id/edit', function (done) {
        var Ebaysale = app.models.Ebaysale;

        // Mock Ebaysale#find
        Ebaysale.find = sinon.spy(function (id, callback) {
            callback(null, new Ebaysale);
        });

        request(app)
        .get('/ebaysales/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebaysale.find.calledWith('42').should.be.true;
            app.didRender(/ebaysales\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /ebaysales/:id
     * Should render ebaysales/index.ejs
     */
    it('should access Ebaysale#find and render "show" template on GET /ebaysales/:id', function (done) {
        var Ebaysale = app.models.Ebaysale;

        // Mock Ebaysale#find
        Ebaysale.find = sinon.spy(function (id, callback) {
            callback(null, new Ebaysale);
        });

        request(app)
        .get('/ebaysales/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebaysale.find.calledWith('42').should.be.true;
            app.didRender(/ebaysales\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /ebaysales
     * Should access Ebaysale#create when Ebaysale is valid
     */
    it('should access Ebaysale#create on POST /ebaysales with a valid Ebaysale', function (done) {
        var Ebaysale = app.models.Ebaysale
        , ebaysale = new EbaysaleStub;

        // Mock Ebaysale#create
        Ebaysale.create = sinon.spy(function (data, callback) {
            callback(null, ebaysale);
        });

        request(app)
        .post('/ebaysales')
        .send({ "Ebaysale": ebaysale })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Ebaysale.create.calledWith(ebaysale).should.be.true;

            done();
        });
    });

    /*
     * POST /ebaysales
     * Should fail when Ebaysale is invalid
     */
    it('should fail on POST /ebaysales when Ebaysale#create returns an error', function (done) {
        var Ebaysale = app.models.Ebaysale
        , ebaysale = new EbaysaleStub;

        // Mock Ebaysale#create
        Ebaysale.create = sinon.spy(function (data, callback) {
            callback(new Error, ebaysale);
        });

        request(app)
        .post('/ebaysales')
        .send({ "Ebaysale": ebaysale })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Ebaysale.create.calledWith(ebaysale).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /ebaysales/:id
     * Should redirect back to /ebaysales when Ebaysale is valid
     */
    it('should redirect on PUT /ebaysales/:id with a valid Ebaysale', function (done) {
        var Ebaysale = app.models.Ebaysale
        , ebaysale = new EbaysaleStub;

        Ebaysale.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/ebaysales/1')
        .send({ "Ebaysale": ebaysale })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/ebaysales/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /ebaysales/:id
     * Should not redirect when Ebaysale is invalid
     */
    it('should fail / not redirect on PUT /ebaysales/:id with an invalid Ebaysale', function (done) {
        var Ebaysale = app.models.Ebaysale
        , ebaysale = new EbaysaleStub;

        Ebaysale.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/ebaysales/1')
        .send({ "Ebaysale": ebaysale })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /ebaysales/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Ebaysale on DELETE /ebaysales/:id');

    /*
     * DELETE /ebaysales/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Ebaysale on DELETE /ebaysales/:id if it fails');
});
