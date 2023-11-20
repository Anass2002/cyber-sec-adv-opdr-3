package main

import data.authz

default allow = false

# Main allow rule
allow {
    is_authorized_issuer(claims.iss)
    is_authorized_subject(claims.sub)
    is_firefox(input.userAgent)
    is_valid_ip(input.ip)
}

# Function to check the issuer (Example: https://name.eu.auth0.com)
is_authorized_issuer(issuer) {
    issuer == "DOMAIN"
}

# Function to check the subject (Example: auth0|1111cccc11cc1111c1c1c11)
is_authorized_subject(subject) {
    subject == "user_sub"
}

# Function to check if the userAgent is Firefox
is_firefox(userAgent) {
    contains(userAgent, "Firefox")
}

# Function to check if the IP is valid (will always get the first IP in the subnet of mynetwork)
is_valid_ip(ip) {
    allowed_ips := {"172.28.0.1"}
    allowed_ips[ip]
}

# Claims extraction
claims := payload {
    [_, payload, _] := io.jwt.decode(bearer_token)
}

# Extract bearer token
bearer_token := t {
    v := input.attributes.request.http.headers.authorization
    startswith(v, "Bearer ")
    t := substring(v, count("Bearer "), -1)
}