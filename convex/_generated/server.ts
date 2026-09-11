type ConvexHandlerDefinition = {
  args?: unknown;
  returns?: unknown;
  handler: (...args: any[]) => any;
};

export function query<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}

export function mutation<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}

export function action<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}

// Loose any-typed shims for internal functions — replaced by real codegen
// when `npx convex dev` runs. Same passthrough shape as the public wrappers.
export function internalQuery<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}

export function internalMutation<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}

export function internalAction<T extends ConvexHandlerDefinition>(definition: T): T {
  return definition;
}
