const {
  gql,
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server-express");
const userActions = require("../database/actions/user");
const serialActions = require("../database/actions/serial");
const serialPartActions = require("../database/actions/serialPart");
const genreActions = require("../database/actions/genre");
const moderationActions = require("../database/actions/moderation");
const User = require("../database/mongo/User");
const Serial = require("../database/mongo/Serial");
const SerialPart = require("../database/mongo/SerialPart");

const { v4: uuidv4 } = require("uuid");

// TODO: Handle User Deletion Mutation

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

  type OperationResult {
    result: String
  }

  type Query {
    authorSerials(authorId: ID!): [Serial]
    genres: [Genre]
    moderationReports: [ModerationReport]
    user(username: String): User
    users: [User]
    userSerials(authorId: ID!): [Serial]
    serial(authorId: ID!, serialSlug: String!): Serial
    serials: [Serial]
    serialPart: SerialPart
    serialParts(id: ID!): [SerialPart]
  }

  type Mutation {
    changeUserRole(newRole: Int!, targetUserId: ID!): User
    createReport(
      reportType: String!
      reportedItem: ID!
      extra_details: String
      reportingUser: ID!
    ): ModerationReport
    createSerial(
      title: String!
      synopsis: String!
      genre: ID!
      nsfw: Boolean
    ): Serial
    createSerialPart(
      title: String!
      content: String
      author: ID!
      parentSerial: ID!
    ): SerialPart
    deleteSerial(serialId: ID!): OperationResult
    deleteSerialPart(partId: ID!): OperationResult
    deleteUser(userId: ID!): User
    editSerial(
      serialId: ID!
      title: String
      synopsis: String
      genre: ID
      nsfw: Boolean
    ): Serial
    login(username: String!, password: String!): LoginResult
    register(
      username: String!
      password: String
      birth_date: String
      role: Int
    ): User
    updateSerialPart(title: String, content: String, partId: ID!): SerialPart
    updateUser(biography: String, viewNSWF: Boolean): User
  }
`;

const resolvers = {
  Query: {
    authorSerials: async (parent, { authorId }) =>
      await serialActions.getAuthorSerials(authorId),
    genres: async () => await genreActions.getGenres(),
    moderationReports: async () => await moderationActions.getReports(),
    users: async () => await userActions.getAllUsers(0, 25),
    user: async (parent, { username }) => await userActions.getUser(username),
    userSerials: async (parent, { authorId }, context, info) =>
      await serialActions.getAuthorSerials(authorId),
    serial: async (parent, { authorId, serialSlug }) =>
      serialActions.getSerial(authorId, serialSlug),
    serials: async () => await serialActions.getSerials(0, 10, true),
    serialPart: async (parent, { partId }) =>
      await serialPartActions.getSingleSerialPart(partId),
    serialParts: async (parent, args, context, info) =>
      await serialPartActions.readSerialParts(args.id),
  },
  Mutation: {
    changeUserRole: async (_, { newRole, targetUserId }, { user }) => {
      if (user.role === 1) {
        return await userActions.changeUserRole(targetUserId, newRole);
      } else {
        throw new ForbiddenError(
          "User must an Administrator to perform this task."
        );
      }
    },
    createReport: async (
      _,
      {
        reportType: report_type,
        reportedItem: reported_item,
        extraDetails: extra_details,
        reportingUser: reporting_user,
      }
    ) => {
      if (!user) {
        throw new AuthenticationError(
          "Creating a serial part requires authentication."
        );
      }
      return await moderationActions.createReport({
        report_type,
        reported_item,
        extra_details,
        reporting_user,
      });
    },
    createSerial: async (_, { title, synopsis, genre, nsfw }, { user }) =>
      await serialActions.createSerial({
        title,
        synopsis,
        genre,
        nsfw,
        userId: user.id,
      }),
    createSerialPart: async (
      _,
      { title, content, author, parentSerial },
      { user }
    ) => {
      if (!user) {
        throw new AuthenticationError(
          "Creating a serial part requires authentication."
        );
      }

      return serialPartActions.createSerialPart({
        title,
        synopsis,
        genre,
        nsfw,
      });
    },
    deleteSerial: async (_, { serialId }, { user }) => {
      const serial = await Serial.findById(serialId).populate("author");
      if (serial && serial.author.id === user.id) {
        await serialActions.deleteSerial({ serialId });
        return {
          result: "Serial Deleted",
        };
      } else {
        throw new ForbiddenError(
          `User ${user.username} does not have permission to delete a serial by ${serial.author.username}`
        );
      }
    },
    deleteSerialPart: async (_, { partId }, { user }) => {
      // !! This might give me trouble if it can't populate the serial's author
      const serialPart = await SerialPart.findById(partId).populate(
        "parent_serial author"
      );
      if (serialPart && serialPart.parent_serial.author.id === user.id) {
        await serialPartActions.deleteSerialPart(partId);
        return {
          result: "Serial Part Deleted",
        };
      } else {
        throw new ForbiddenError(
          `User ${user.username} does not have permission to delete a serialPart by ${serialPart.parent_serial.author.username}`
        );
      }
    },
    editSerial: async (
      _,
      { serialId, title, synopsis, genre, nsfw },
      { user }
    ) =>
      serialActions.editSerial({
        serialId,
        title,
        synopsis,
        genre,
        nsfw,
        userId: user.id,
      }),
    updateUser: async (_, { biography, viewNSFW }, { user }) =>
      await userActions.updateUser({
        biography,
        viewNSFW,
        userId: user.id,
      }),
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
    // TODO: Revisit this, probably doesn't need to pass back a whole user
    register: async (_, { username, password, birth_date, role }) =>
      await addNewUser({ username, password, birth_date, role }),
    updateSerialPart: async (_, { title, content, partId }) => {
      const serialPart = await SerialPart.findById(partId).populate(
        "parent_serial author"
      );
      if (serialPart && serialPart.parent_serial.author.id === user.id) {
        return await serialPartActions.updateSerialPart({
          title,
          content,
          partId,
        });
      } else {
        throw new ForbiddenError(
          `User ${user.username} does not have permission to delete a serialPart by ${serialPart.parent_serial.author.username}`
        );
      }
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
