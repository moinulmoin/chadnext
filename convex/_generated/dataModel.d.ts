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
  runs: {
    document: {
      _id: GenericId<"runs">;
      _creationTime: number;
      userId: GenericId<"users">;
      instruction: string;
      status: "queued" | "running" | "succeeded" | "failed";
      output?: string;
      errorMessage?: string;
      tokensUsed: number;
      costCents: number;
      model: string;
      createdAt: number;
      completedAt?: number;
      isSeed?: boolean;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "instruction"
      | "status"
      | "output"
      | "errorMessage"
      | "tokensUsed"
      | "costCents"
      | "model"
      | "createdAt"
      | "completedAt"
      | "isSeed";
    indexes: {
      by_userId: ["userId"];
      by_userId_and_status: ["userId", "status"];
      by_status_and_createdAt: ["status", "createdAt"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  usageCounters: {
    document: {
      _id: GenericId<"usageCounters">;
      _creationTime: number;
      userId: GenericId<"users">;
      day: string;
      runsCreated: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "day"
      | "runsCreated";
    indexes: {
      by_userId_and_day: ["userId", "day"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  // Additive stubs (replaced by real codegen on `npx convex dev`).
  approvals: {
    document: {
      _id: GenericId<"approvals">;
      _creationTime: number;
      userId: GenericId<"users">;
      threadId: string;
      toolCallId: string;
      toolName: string;
      args: string;
      status: "pending" | "approved" | "denied" | "consumed";
      createdAt: number;
      decidedAt?: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "threadId"
      | "toolCallId"
      | "toolName"
      | "args"
      | "status"
      | "createdAt"
      | "decidedAt";
    indexes: {
      by_userId: ["userId"];
      by_thread: ["threadId"];
      by_toolCallId: ["toolCallId"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  sigmaMemories: {
    document: {
      _id: GenericId<"sigmaMemories">;
      _creationTime: number;
      userId: GenericId<"users">;
      content: string;
      createdAt: number;
    };
    fieldPaths:
      | "_id"
      | "_creationTime"
      | "userId"
      | "content"
      | "createdAt";
    indexes: {
      by_userId: ["userId"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
};

export type TableNames = keyof DataModel;

export type Doc<TableName extends TableNames> =
  DataModel[TableName]["document"];
