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
