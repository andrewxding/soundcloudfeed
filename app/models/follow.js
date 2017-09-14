var mongoose = require('mongoose');

var followSchema = mongoose.Schema(
	{
	username		: String,
	followers		: [String],
	following		: [String]


	},
	{
		collection: "Follow"
	}
);
module.exports = mongoose.model('Follow', followSchema);