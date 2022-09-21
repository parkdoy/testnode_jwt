//스키마

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true }
	},
	{ collection: 'users' }
);

//모듈로 관리
const model = mongoose.model('UserSchema', UserSchema);
module.exports = model;