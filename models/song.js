const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SongSchema = Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		title: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Song", SongSchema);
