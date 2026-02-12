/* eslint-disable */
/**
 * Generated `dataModel` stub.
 *
 * This file is a temporary stub that will be replaced when you run `npx convex dev`.
 * It provides minimal type definitions to allow the build to pass.
 */

import type { GenericId } from "convex/values";

export type DataModel = {
  users: {
    document: {
      _id: GenericId<"users">;
      _creationTime: number;
      name?: string;
      email: string;
      emailVerified?: boolean;
      picture?: string;
      stripeCustomerId?: string;
      createdAt: number;
      updatedAt: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "name"
      | "email"
      | "emailVerified"
      | "picture"
      | "stripeCustomerId"
      | "createdAt"
      | "updatedAt";
    indexes: {
      by_email: ["email"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  projects: {
    document: {
      _id: GenericId<"projects">;
      _creationTime: number;
      userId: GenericId<"users">;
      name: string;
      description?: string;
      status: "active" | "archived";
      domain?: string;
      createdAt: number;
      updatedAt: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "name"
      | "description"
      | "status"
      | "domain"
      | "createdAt"
      | "updatedAt";
    indexes: {
      by_userId: ["userId"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  conversations: {
    document: {
      _id: GenericId<"conversations">;
      _creationTime: number;
      userId: GenericId<"users">;
      title?: string;
      model?: string;
      tokenCount?: number;
      createdAt: number;
      updatedAt: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "title"
      | "model"
      | "tokenCount"
      | "createdAt"
      | "updatedAt";
    indexes: {
      by_userId: ["userId"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  messages: {
    document: {
      _id: GenericId<"messages">;
      _creationTime: number;
      conversationId: GenericId<"conversations">;
      role: "user" | "assistant" | "system" | "tool";
      content: string;
      toolCalls?: any[];
      toolResults?: any[];
      tokens?: number;
      createdAt: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "conversationId"
      | "role"
      | "content"
      | "toolCalls"
      | "toolResults"
      | "tokens"
      | "createdAt";
    indexes: {
      by_conversationId: ["conversationId"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
};

export type TableNames = keyof DataModel;

export type Doc<TableName extends TableNames> =
  DataModel[TableName]["document"];
