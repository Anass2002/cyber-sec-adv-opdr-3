import { UserManager } from "oidc-client-ts";

const userManager = new UserManager({
  authority: process.env.REACT_APP_AUTHORITY,
  client_id: process.env.REACT_APP_CLIENT_ID,
  audience: process.env.REACT_APP_AUDIENCE,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  response_type: process.env.REACT_APP_RESPONSE_TYPE,
  scope: process.env.REACT_APP_SCOPE,
});

export default userManager;
