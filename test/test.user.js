var mongoose = require('mongoose');
var User = require("../server/models/User");
var chaiHttp = require('chai-http');
var chai = require('chai'),
    chaiHttp = require('chai-http');
chai.use(chaiHttp);
var db;

describe('User', function () {

    before(function (done) {
        db = mongoose.connect("mongodb://aliatwa:159951ali@ds137605.mlab.com:37605/poster", {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true
            //useMongoClient: true
        });
        done();
    });

    after(function (done) {
        mongoose.connection.close()
        done();
    });

    beforeEach(function (done) {
        var user = new User({
            email: 'hghgh@hgghgh.hg',
            password: 'testy'
        });

        user.save(function (error) {
            if (error) console.log('error' + error.message);
            else console.log('no error to register user');
            done();
        });
    });

    it('find a user by email', function (done) {
        User.findOne({
            email: 'hghgh@hgghgh.hg'
        }, function (err, user) {
            user.email.should.eql('hghgh@hgghgh.hg');
            console.log("email: ", user.email)
            done();
        });
    });

    it('Delete user', function (done) {
        chai.request('http://localhost:5000')
            .post('/user/delete')
            .send({
                'id': '5c6ab025ba9e910a043a3fbf'
            })
            .end(function (err, res) {
                console.log(res)
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('SUCCESS');
                res.body.SUCCESS.should.be.a('object');
                res.body.SUCCESS.should.have.property('name');
                done();
            });
    });

    afterEach(function (done) {
        User.deleteOne({}, function () {
            done();
        });
    });

});