// app.js
const express = require("express");
const cors = require("cors");
const { auth } = require("express-oauth2-jwt-bearer");
const axios = require("axios");
const { config } = require('dotenv');

const app = express();

config();

const PORT = process.env.PORT;
const opa_endpoint = process.env.OPA_ENDPOINT;

const jwtCheck = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

var whitelist = [process.env.WHITELIST];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

function convertIPv6ToIPv4(ip) {
  if (ip.substr(0, 7) === "::ffff:") {
      return ip.substr(7);
  }
  return ip;
}

app.use((req, res, next) => {
  req.ip = convertIPv6ToIPv4(req.ip);
  next();
});

app.use(cors(corsOptions));
app.use(jwtCheck);

app.use(async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const clientIp = convertIPv6ToIPv4(req.ip);
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
    const opaResponse = await axios.post(opa_endpoint, axiosData, axiosConfig);

    if (opaResponse.data.result === true) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Error during OPA authorization:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const api_text = "If you see this, you have access to this API!";

app.get("/api", (req, res) => {
  res.json(api_text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
