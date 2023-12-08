/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/lib/auth").Auth;
  type DatabaseUserAttributes = {
    name: string;
    email: string;
    picture: string;
  };
  type DatabaseSessionAttributes = {};
}
