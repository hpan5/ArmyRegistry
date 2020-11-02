const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = Schema({
    name: String,
    rank: String,
    sex: String,
    startDate: Date,
    phone: String,
    email: String,
    superior: { type: Schema.Types.ObjectId, ref: 'Soldier' },
    direct_subordinates:[{ type: Schema.Types.ObjectId, ref: 'Soldier' }],
    _id: Schema.Types.ObjectId
})

schema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = mongoose.model('Soldier', schema);
//image: {data: Buffer, contentType: String},