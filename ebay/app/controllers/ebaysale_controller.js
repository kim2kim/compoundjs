load('application');

before(loadEbaysale, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New ebaysale';
    this.ebaysale = new Ebaysale;
    render();
});

action(function pullebay(){
	alert('hello');
	var Service = require("/Users/khimung/Documents/ebaysoap/ebay/ebaySvc");
	var EC2 = require("lib/EC2");
	var someRequest = new Service.GetSellingManagerSaleRecord.GetSellingManagerSaleRecordRequest();
	var json = { eBayAuthToken: 1, someString: "1" };
	someRequest = new Service.TestRequest(json);
	render();
});

action(function create() {
    Ebaysale.create(req.body.Ebaysale, function (err, ebaysale) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: ebaysale && ebaysale.errors || err});
                } else {
                    send({code: 200, data: ebaysale.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Ebaysale can not be created');
                    render('new', {
                        ebaysale: ebaysale,
                        title: 'New ebaysale'
                    });
                } else {
                    flash('info', 'Ebaysale created');
                    redirect(path_to.ebaysale);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Ebaysales index';
    Ebaysale.all(function (err, ebaysale) {
        switch (params.format) {
            case "json":
                send({code: 200, data: ebaysale});
                break;
            default:
                render({
                    ebaysale: ebaysale
                });
        }
    });
});

action(function show() {
    this.title = 'Ebaysale show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.ebaysale});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Ebaysale edit';
    switch(params.format) {
        case "json":
            send(this.ebaysale);
            break;
        default:
            render();
    }
});

action(function update() {
    var ebaysale = this.ebaysale;
    this.title = 'Edit ebaysale details';
    this.ebaysale.updateAttributes(body.Ebaysale, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: ebaysale && ebaysale.errors || err});
                } else {
                    send({code: 200, data: ebaysale});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Ebaysale updated');
                    redirect(path_to.ebaysale(ebaysale));
                } else {
                    flash('error', 'Ebaysale can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.ebaysale.destroy(function (error) {
        respondTo(function (format) {
            format.json(function () {
                if (error) {
                    send({code: 500, error: error});
                } else {
                    send({code: 200});
                }
            });
            format.html(function () {
                if (error) {
                    flash('error', 'Can not destroy ebaysale');
                } else {
                    flash('info', 'Ebaysale successfully removed');
                }
                send("'" + path_to.ebaysale + "'");
            });
        });
    });
});

function loadEbaysale() {
    Ebaysale.find(params.id, function (err, ebaysale) {
        if (err || !ebaysale) {
            if (!err && !ebaysale && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.ebaysale);
        } else {
            this.ebaysale = ebaysale;
            next();
        }
    }.bind(this));
}
