import { gql } from "apollo-server";

export default gql`
  type Query {
    me: LoginResponse! @auth @proof(level: 1)
    chat: ChatResponse! @auth @proof(level: 3)
  }

  type Mutation {
    login(name: String!, password: String!): LoginResponse! @proof(level: 2)
    createAccount(name: String!, password: String!): BaseAccount!
      @proof(level: 3)
  }

  type BaseAccount implements BaseModel {
    id: ID!
    name: String!
    password: String!
    authVersion: Int!

    banned: Boolean!
    nextAllowedAction: String
    timeRemaining: Int

    hero: Hero

    access: AccessRole
  }

  type LoginResponse {
    account: BaseAccount!
    token: String!
    now: String!
  }

  type ChatResponse {
    token: String!
  }

  enum AccessRole {
    Admin
  }
`;
