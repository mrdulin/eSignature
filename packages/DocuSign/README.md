# DocuSign

DocuSign research

## Introduction

This project use `Service Integration Authentication`

Service Integration Authentication uses JSON Web Token (JWT) Profile for OAuth 2.0 Client Authentication and Authorization Grants (RFC 7523) to create an access token. It is ideal for service integrations that do not involve a user agent like a browser or web view control. The result is an access token that represents the application or an impersonated user.

Service integrations offer two ways to give consent:

* User consent - the way this project used

* Admin consent

How the flow works:

For user consent, the initial part of the flow is the same as Authorization Code Grant.

For admin consent, the administrator gives consent on behalf of all the users within the organization’s email domain. See the DocuSign Organization Administration guide to learn more about organizations.

In both cases, the goal is to obtain a user ID.

Your application uses its integrator key and the user ID to create a JWT token. The token is signed with your application’s private RSA key.
Your application uses the authorization code to request an access token.
Your application uses the oauth/userinfo endpoint to find the user’s base URI (API server) information.

## References

* https://www.docusign.com/blog/dsdev-using-the-oauth-jwt-flow/

* https://github.com/docusign/OAuth_JWT_recipes

* https://stackoverflow.com/questions/46412305/how-can-i-make-an-application-and-grant-it-admin-consent-from-the-demo-account?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

* https://docs.docusign.com/esign/guide/authentication/auth_overview.html

* http://docusign.github.io/docusign-node-client/
