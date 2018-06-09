const User = require("../models/user");
const Song = require("../models/song");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = `
	type Query {
		users: [User],
		user(id: ID!): User,
		songs: [Song],
		song(id: ID!): Song,
	}

	type Mutation {
		addSong(userId: ID!, title: String): Song
	}

	type User {
		id: ID!
		email: String
	}

	type Song {
		id: ID!
		user: ID!
		title: String
	}
	`;

const resolvers = {
	Query: {
		users: (root, args, context, info) => {
			const foundItems = new Promise((resolve, reject) => {
				User.find({}, (err, users) => {
					err ? reject(err) : resolve(users);
				});
			});
			return foundItems;
		},
		user: (root, args, context, info) => {
			const foundItems = new Promise((resolve, reject) => {
				User.findById(args.id, (err, user) => {
					if (err) {
						reject(err);
					}
					resolve(user);
				});
			});
			return foundItems;
		},
		songs: (root, args, context, info) => {
			const foundItems = new Promise((resolve, reject) => {
				Song.find({}, (err, songs) => {
					err ? reject(err) : resolve(songs);
				});
			});
			return foundItems;
		},
		song: (root, args, context, info) => {
			const foundItems = new Promise((resolve, reject) => {
				Song.findById(args.id, (err, song) => {
					if (err) {
						reject(err);
					}
					resolve(song);
				});
			});
			return foundItems;
		}
	},
	Mutation: {
		addSong: (_, { userId, title }) => {
			const promiseSong = new Promise((resolve, reject) => {
				const newSong = new Song({ user: userId, title: title });
				newSong.save(function(err) {
					if (err) {
						reject(err);
					}
					resolve(this);
				});
			});
			return promiseSong;
		}
	}
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
});

module.exports = schema;
