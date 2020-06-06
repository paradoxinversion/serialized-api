const {
  gql,
  ApolloError,
  AuthenticationError,
} = require("apollo-server-express");
const userActions = require("../database/actions/user");
const serialActions = require("../database/actions/serial");
const serialPartActions = require("../database/actions/serialPart");
const genreActions = require("../database/actions/genre");
const moderationActions = require("../database/actions/moderation");
const User = require("../database/mongo/User");
const { v4: uuidv4 } = require("uuid");

const typeDefs = gql`
  type User {
    id: ID
    username: String
    birth_date: String
    join_date: String
    biography: String
    role: String
    view_nsfw: Boolean
    account_status: Int
  }

  type Serial {
    id: ID
    title: String
    synopsis: String
    genre: String
    nsfw: Boolean
    creation_date: String
    last_modified: String
    author: User
    slug: String
  }

  type SerialPart {
    title: String
    content: String
    parent_serial: Serial
    part_number: Int
    nsfw: Boolean
    creation_date: String
    last_modified: String
    author: User
    slug: String
  }

  type ModerationReport {
    report_type: String
    reported_item: String
    extra_details: String
    reporting_user: User
  }

  type Like {
    like_type: String
    subject: String
    user: User
  }

  type Subscription {
    subscriber: User
    subscribed_object: String
    subscription_type: String
  }

  type Genre {
    name: String
    description: String
  }

  type LoginResult {
    token: String
  }

  type Query {
    genres: [Genre]
    moderationReports: [ModerationReport]
    users: [User]
    userSerials(authorId: ID!): [Serial]
    serials: [Serial]
    serialParts(id: ID!): [SerialPart]
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult
    updateUser(biography: String, viewNSWF: Boolean): User
  }
`;

const resolvers = {
  Query: {
    genres: async () => await genreActions.getGenres(),
    moderationReports: async () => await moderationActions.getReports(),
    users: async () => await userActions.getAllUsers(0, 25),
    userSerials: async (parent, args, context, info) => {
      console.log(context);
      return await serialActions.getAuthorSerials(args.authorId);
    },
    serials: async () => await serialActions.getSerials(0, 10, true),
    serialParts: async (parent, args, context, info) =>
      await serialPartActions.readSerialParts(args.id),
  },
  Mutation: {
    updateUser: async (parent, { biography, viewNSFW }, { user }) => {
      return await userActions.updateUser({
        biography,
        viewNSFW,
        userId: user.id,
      });
    },
    login: async (_, { username, password }, { tokenManager }) => {
      const user = await User.findOne({ username });
      if (!user) {
        const error = new ApolloError(
          "No user found with username " + username,
          400
        );
        throw error;
      }
      if (await user.validatePassword(password)) {
        const signingOptions = {
          jwtid: uuidv4(),
          expiresIn: "2w",
          issuer: "serialized-test",
          audience: "serialized",
          subject: user.id,
        };
        const payload = {
          username: user.username,
        };
        const token = tokenManager.sign(payload, signingOptions);
        return {
          token,
        };
      } else {
        throw new AuthenticationError("Incorrect username or password.");
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
