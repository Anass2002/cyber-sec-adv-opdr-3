// usermanager
import { UserManager } from "oidc-client-ts";

const userManager = new UserManager({
  authority: process.env.REACT_APP_ISSUER_BASE_URL,
  client_id: process.env.REACT_APP_USER_MANAGER_CLIENT_ID,
  audience: process.env.REACT_APP_AUDIENCE,
  redirect_uri: process.env.REACT_APP_USER_MANAGER_REDIRECT_URI,
  response_type: "code",
  scope: "openid profile email"
});

export default userManager;
