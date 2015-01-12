load('application');

before(loadEbay, {
    only: ['show', 'edit', 'update', 'destroy']
    });

action('new', function () {
    this.title = 'New ebay';
    this.ebay = new Ebay;
    render();
});

action(function create() {
    Ebay.create(req.body.Ebay, function (err, ebay) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: ebay && ebay.errors || err});
                } else {
                    send({code: 200, data: ebay.toObject()});
                }
            });
            format.html(function () {
                if (err) {
                    flash('error', 'Ebay can not be created');
                    render('new', {
                        ebay: ebay,
                        title: 'New ebay'
                    });
                } else {
                    flash('info', 'Ebay created');
                    redirect(path_to.ebays);
                }
            });
        });
    });
});

action(function index() {
    this.title = 'Ebays index';
    Ebay.all(function (err, ebays) {
        switch (params.format) {
            case "json":
                send({code: 200, data: ebays});
                break;
            default:
                render({
                    ebays: ebays
                });
        }
    });
});

action(function show() {
    this.title = 'Ebay show';
    switch(params.format) {
        case "json":
            send({code: 200, data: this.ebay});
            break;
        default:
            render();
    }
});

action(function edit() {
    this.title = 'Ebay edit';
    switch(params.format) {
        case "json":
            send(this.ebay);
            break;
        default:
            render();
    }
});

action(function update() {
    var ebay = this.ebay;
    this.title = 'Edit ebay details';
    this.ebay.updateAttributes(body.Ebay, function (err) {
        respondTo(function (format) {
            format.json(function () {
                if (err) {
                    send({code: 500, error: ebay && ebay.errors || err});
                } else {
                    send({code: 200, data: ebay});
                }
            });
            format.html(function () {
                if (!err) {
                    flash('info', 'Ebay updated');
                    redirect(path_to.ebay(ebay));
                } else {
                    flash('error', 'Ebay can not be updated');
                    render('edit');
                }
            });
        });
    });
});

action(function destroy() {
    this.ebay.destroy(function (error) {
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
                    flash('error', 'Can not destroy ebay');
                } else {
                    flash('info', 'Ebay successfully removed');
                }
                send("'" + path_to.ebays + "'");
            });
        });
    });
});

function loadEbay() {
    Ebay.find(params.id, function (err, ebay) {
        if (err || !ebay) {
            if (!err && !ebay && params.format === 'json') {
                return send({code: 404, error: 'Not found'});
            }
            redirect(path_to.ebays);
        } else {
            this.ebay = ebay;
            next();
        }
    }.bind(this));
}
