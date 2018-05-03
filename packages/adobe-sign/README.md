# adobe-sign

adobe sign research

## API Introduction

Adobe Sign's REST API provides a powerful and easy way to integrate Adobe Sign functionality into your own applications.

Developers can integrate with Adobe Sign using Adobe Sign REST API.In order to call the Adobe Sign APIs, you must first create an application.

## How to get started

1.  Obtain a unique set of credentials (an ID and a secret) for use in your application. Account administrators can generate these credentials through the Adobe Sign API page in the account settings.

2.  API calls require an OAuth Access Token. Each operation on a resource requires specific OAuth scope(s), and your application will need to request all of the needed scopes during the OAuth authorization process.

3.  Use this OAuth access token in the following REST endpoints to perform operations on behalf of the user who authorized the API access.

## Web Management Console

login url address: https://secure.echosign.com/public/login

![Dashboard](https://ws3.sinaimg.cn/large/006tKfTcgy1fqy1q28nxzj31kw0vq44g.jpg)

![Manage](https://ws1.sinaimg.cn/large/006tKfTcgy1fqy1qttlugj31kw0ymwjm.jpg)

![Send](https://ws2.sinaimg.cn/large/006tKfTcgy1fqy1sn22rvj31kw10a416.jpg)

![Edit document, add signature field form control](https://ws4.sinaimg.cn/large/006tKfTcgy1fqy1uugap0j31kw0vqq80.jpg)

![successfully sent for signature](https://ws2.sinaimg.cn/large/006tKfTcgy1fqy1w8y58uj31kw0vqae3.jpg)

![Create signature](https://ws4.sinaimg.cn/large/006tNc79gy1fqq8xhrqq1j31kw0vqq4i.jpg)

![Account](https://ws1.sinaimg.cn/large/006tNc79gy1fqq8ykwdgvj31kw0vqads.jpg)

![Written signature - step1](https://ws2.sinaimg.cn/large/006tKfTcgy1fqy1yhsnv9j31kw0vqn16.jpg)

![Written signature - step2](https://ws2.sinaimg.cn/large/006tKfTcgy1fqy20jf7hdj31kw0vq0ux.jpg)

![Written signature - step3](https://ws2.sinaimg.cn/large/006tKfTcgy1fqy1zwxh4xj31kw0tzq57.jpg)

## others

This watermark is the result of a developer account. You need a trial or paid account to remove the watermark. You can find information on the plans here: https://acrobat.adobe.com/us/en/sign/pricing/compare-plans.html

For integrations that need to access services or content on behalf of an organization (rather than an end user), select the Service Account integration option.

![Create a new integration](https://ws3.sinaimg.cn/large/006tNc79gy1fqrb66yttyj31kw1ghq68.jpg)

## References

* Feature comparison — Adobe Sign https://acrobat.adobe.com/us/en/sign/pricing/compare-plans.html

* Service Account Integration: https://www.adobe.io/apis/cloudplatform/console/authentication/jwt_workflow.html

* adobe sign js sdk: https://github.com/adobe-sign/AdobeSignJsSdk

* https://cn.engadget.com/2016/04/26/adobe-sign-hands-on/

* https://helpx.adobe.com/cn/sign/how-to/get-started.html

* https://helpx.adobe.com/cn/support/sign.html

* https://secure.na1.echosign.com/public/static/oauthDoc.jsp

* https://secure.na1.echosign.com/public/docs/restapi/v5

* https://www.adobe.io/apis/documentcloud/sign/docs/developer-guides.html

* plan & price: https://acrobat.adobe.com/us/en/sign/pricing/plans.html?promoid=FVYPZ681&mv=other

* forums: https://forums.adobe.com/community/adobesign

## issues

1.  Service Account Integration or OAuth Integration?

I think our usage should be that we (the company), as the resource owner, send the user a signed agreement instead of redirecting the user to the adobe-sign or docusign login authorization page in the browser. This application belongs to the user application, and the user authorizes the application to use their resources on the adobe-sign or docusign server.

2.  Needs user email

When adobe-sign and docusign send the signing agreement, the recipient information filled in requires an email address, so we must get the user's email address information.

3.  How would the flow work when initiated from the chat interface?

Currently I don't know much about the chat interface, but I think it should be similar to the chat bot in the facebook messenger platform. I think the process is like this. For example, NH, the user enters his intention in the chatbot UI? After dialogflow analysis, through Call the API provided by adobe-sign or docusign to access resources (such as the Non-Disclosure Agreement) that we (the company) have on the adobe service, get the url link address of the signing agreement, respond to the user in the chatbot UI, and the user clicks the link , Open the signed agreement in the browser and perform electronic signature or handwritten signature.
