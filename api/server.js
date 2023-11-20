const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { auth } = require("express-oauth2-jwt-bearer");
const { config } = require("dotenv");

const app = express();

// Load environment variables from .env file
config();

const PORT = process.env.PORT;

const auth0Audience = process.env.AUDIENCE; // Auth0 audience
const auth0IssuerBaseURL = process.env.DOMAIN; // Auth0 issuer URL
const tokenSigningAlg = "RS256"; // token signing algorithm

const whitelist_ip = process.env.IP;
const OPA_endpoint = process.env.OPA; // OPA endpoint

const jwtCheck = auth({
  audience: auth0Audience,
  issuerBaseURL: auth0IssuerBaseURL,
  tokenSigningAlg: tokenSigningAlg,
});

const whitelist = [whitelist_ip];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(jwtCheck);

app.use(async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const clientIp = req.ip;
    const userAgent = req.get("User-Agent");

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const axiosData = {
      input: {
        userAgent,
        ip: clientIp,
        attributes: {
          request: {
            http: {
              headers: {
                authorization: token,
              },
            },
          },
        },
      },
    };

    // Use Axios to send the request to OPA
    const opaResponse = await axios.post(OPA_endpoint, axiosData, axiosConfig);

    if (opaResponse.data.result === true) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error during OPA authorization:", error.message);
    res
      .status(500)
      .json({ error: "Internal server error: error accessing API or OPA" });
  }
});

const apiText = "Congratulations! U got access to this API, if u see this :)";

app.get("/api", (req, res) => {
  res.json(apiText);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// TESTING WITH POSTMAN
// https://DOMAIN/authorize?response_type=code&client_id=CLIENT-ID&redirect_uri=CALLBACK-URL&audience=AUDIENCE-API&scope=openid%20profile%20email&state=state1
/* POST NAAR https://DOMAIN/oauth/token?=
grant_type:authorization_code
client_id:CLIENTID
client_secret:DAS-SECRET
code:CALLBACK CODE
redirect_uri:CALLBACK-URL
*/
