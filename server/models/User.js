const mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

let UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true
        },
        password: String,
        role: String,
        verified: Boolean,
        emailVerifyToken: String,
        passwordResetToken: String,
        passwordResetExpires: Date,
        profile: {
            name: String,
            gender: String,
            location: String,
            website: String,
            picture: String
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan'
        },
        schedules: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Schedule'
            }
        ],
        saved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Saved'
            }
        ],
        invoices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Invoice'
            }
        ]
    },
{ timestamps: true })

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.addSchedule = function (post_id) {
    if (this.schedules.indexOf(post_id) === -1) {
        this.schedules.push(post_id)
    }
    return this.save()
}
UserSchema.methods.addInvoice = function (invoice_id) {
    if (this.invoices.indexOf(invoice_id) === -1) {
        this.invoices.push(invoice_id)
    }
    return this.save()
}
UserSchema.methods.savePost = function (fs) {
    this.saved.push(fs)
}
module.exports = mongoose.model('User', UserSchema)