exports.render = function(req, res) {
    res.render('index', {
        title: 'Eendenkuikens Project',
        user: JSON.stringify(req.user)
    });
};