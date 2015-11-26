var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var GrantsSchema = new Schema(
	{
	  name: String,
	  link: String,
	  deadline: Date,
	  category: String,
	  eligibility: String,
	  award: Number,
	  description: String
	},
	{
	  collection: 'grants'
	}
);

mongoose.model('Grants', GrantsSchema);