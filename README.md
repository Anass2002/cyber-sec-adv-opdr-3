# Branch Samrat of cyber-sec-adv-opdr-3

## Make .env file in api/ and spa/ and subnet in docker compose file to configure

Make sure to adjust the policy too in `opa/policies/auth.rego` with corresponding variables.

## NPM installing

Go to dir `api/` and run `npm install` and do the same in dir `spa/`

## SPA (React) Build

Go to dir `spa/` and run: `npm run build`

## Run docker compose

Run in root dir: `docker compose up --build` (optional: -d)
