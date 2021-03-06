# adobe-sign

adobe sign research

## API Introduction

Adobe Sign's REST API provides a powerful and easy way to integrate Adobe Sign functionality into your own applications.

Developers can integrate with Adobe Sign using Adobe Sign REST API.In order to call the Adobe Sign APIs, you must first create an application.

## How to get started

1.  Obtain a unique set of credentials (an ID and a secret) for use in your application. Account administrators can generate these credentials through the Adobe Sign API page in the account settings.

2.  API calls require an OAuth Access Token. Each operation on a resource requires specific OAuth scope(s), and your application will need to request all of the needed scopes during the OAuth authorization process.

3.  Use this OAuth access token in the following REST endpoints to perform operations on behalf of the user who authorized the API access.

## docker

- 使用 Dockerfile 构建 image, 并启动容器

```bash
➜  adobe-sign git:(master) ✗ docker run -p 18081:18081 -d adobe-sign:v1.0
e8652613f7759677fd67741fd52dcfe6887735ffa6b71691f0e758a7935b9252
➜  adobe-sign git:(master) ✗ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
e8652613f775        adobe-sign:v1.0     "npm start"              4 seconds ago       Up 7 seconds        0.0.0.0:18081->18081/tcp   objective_wescoff
22dfcbae5d19        nginx:v1.1          "nginx -g 'daemon of…"   27 minutes ago      Up 27 minutes       0.0.0.0:3001->80/tcp       webserver
➜  adobe-sign git:(master) ✗ docker logs e86

> adobe-sign@1.0.0 start /usr/workspace/adobe-sign
> node src/server.js

HTTP Server is running on: http://localhost:18080
HTTPS Server is running on: https://localhost:18081
```

- 使用 docker-compose

`docker-compose up`

https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

## Web Management Console

login url address: https://secure.echosign.com/public/login

![Dashboard](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1q28nxzj31kw0vq44g.jpg)

![Manage](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1qttlugj31kw0ymwjm.jpg)

![Send](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1sn22rvj31kw10a416.jpg)

![Edit document, add signature field form control](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1uugap0j31kw0vqq80.jpg)

![successfully sent for signature](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1w8y58uj31kw0vqae3.jpg)

![Create signature](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tNc79gy1fqq8xhrqq1j31kw0vqq4i.jpg)

![Account](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tNc79gy1fqq8ykwdgvj31kw0vqads.jpg)

![Written signature - step1](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1yhsnv9j31kw0vqn16.jpg)

![Written signature - step2](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy20jf7hdj31kw0vq0ux.jpg)

![Written signature - step3](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tKfTcgy1fqy1zwxh4xj31kw0tzq57.jpg)

![Create a new integration](https://raw.githubusercontent.com/mrdulin/pic-bucket-01/master/006tNc79gy1fqrb66yttyj31kw1ghq68.jpg)

## References

- Feature comparison — Adobe Sign https://acrobat.adobe.com/us/en/sign/pricing/compare-plans.html

- Service Account Integration: https://www.adobe.io/apis/cloudplatform/console/authentication/jwt_workflow.html

- adobe sign js sdk: https://github.com/adobe-sign/AdobeSignJsSdk

- https://cn.engadget.com/2016/04/26/adobe-sign-hands-on/

- https://helpx.adobe.com/cn/sign/how-to/get-started.html

- https://helpx.adobe.com/cn/support/sign.html

- https://secure.na1.echosign.com/public/static/oauthDoc.jsp

- https://secure.na1.echosign.com/public/docs/restapi/v5

- https://www.adobe.io/apis/documentcloud/sign/docs/developer-guides.html

- plan & price: https://acrobat.adobe.com/us/en/sign/pricing/plans.html?promoid=FVYPZ681&mv=other

- forums: https://forums.adobe.com/community/adobesign

## issues

- Service Account Integration or OAuth Integration?

I think our usage should be that we (the company), as the resource owner, send the user a signed agreement instead of redirecting the user to the adobe-sign or docusign login authorization page in the browser. This application belongs to the user application, and the user authorizes the application to use their resources on the adobe-sign or docusign server.

> For integrations that need to access services or content on behalf of an organization (rather than an end user), select the Service Account integration option.

https://forums.adobe.com/message/10370469#10370469

- Needs user email

When adobe-sign and docusign send the signing agreement, the recipient information filled in requires an email address, so we must get the user's email address information.

- How would the flow work when initiated from the chat interface?

Currently I don't know much about the chat interface, but I think it should be similar to the chat bot in the facebook messenger platform. I think the process is like this. For example, NH, the user enters his intention in the chatbot UI? After dialogflow analysis, through Call the API provided by adobe-sign or docusign to access resources (such as the Non-Disclosure Agreement) that we (the company) have on the adobe service, get the url link address of the signing agreement, respond to the user in the chatbot UI, and the user clicks the link , Open the signed agreement in the browser and perform electronic signature or handwritten signature.

- document watermark

This watermark is the result of a developer account. You need a trial or paid account to remove the watermark. You can find information on the plans here: https://acrobat.adobe.com/us/en/sign/pricing/compare-plans.html
