package main

import data.authz

# deny all
default allow = false

allow {
    is_authorized_issuer(claims.iss)
    is_authorized_subject(claims.sub)
    is_firefox(input.userAgent)
    is_valid_ip(input.ip)
}

# check the issuer (domain of your app, blabla.auth.com)
is_authorized_issuer(issuer) {
    issuer == "https://domain/"
}

# check the subject (adjust variable, start with auth0|...)
is_authorized_subject(subject) {
    subject == "user_sub"
}

# check if the userAgent is for example Firefox
is_firefox(userAgent) {
    contains(userAgent, "Firefox")
}

# check if the IP is allowed (this is the first ip address of the docker compose subnet of mynetwork)
is_valid_ip(ip) {
    allowed_ips := {"::ffff:172.20.0.1"}
    allowed_ips[ip]
}

# extract claims
claims := payload {
    [_, payload, _] := io.jwt.decode(bearer_token)
}

# extract bearer token
bearer_token := t {
    v := input.attributes.request.http.headers.authorization
    startswith(v, "Bearer ")
    t := substring(v, count("Bearer "), -1)
}