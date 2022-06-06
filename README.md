# How to Create a Slack Bot
Slack applications have full access to its platform. It's really the best way to go if you want to create a highly custom and powerful Slack experience. Slack offers a large range of APIs that provide access to read, write, and update all kinds of data in Slack.

Today we will create a **Slack Bot** to send messages to all kinds of conversations using Web APIs and webhooks powered by Serverless Functions built using Next.js.

## A small note on Vercel and Next.js

The great thing about working with Web APIs and webhooks is that you can choose your own Tech Stack to build your Slack Bot. **Next.js** has support for [API Routes](https://nextjs.org/docs/api-routes/introduction), which lets you easily create an API endpoint as a Node.js serverless function. With Vercel, you can deploy [serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions), that handle an array of things such as user authentication, database queries, custom commands and more.

## Creating a Slack app

First, we need to create a Slack app. You can follow along all the way until we get our Slack bot up and running. Click [here](https://api.slack.com/apps/new) to create your application. From there, we can choose how we'd like to configure our app's scopes and settings. Feel free to do either of them, in case you want to speed up the process, here's an [app manifest](https://gist.github.com/ekqt/eb1ecb8698d6d211b1aef2280e0e6518) to get you up and running quickly.

I'd recommend experimenting with a Development Workspace first! Choose your workspace and channels wisely! For more on **Creating a Slack Workspace** see [here](https://slack.com/help/articles/206845317-Create-a-Slack-workspace).

## Posting your first Message

The first thing we will try today is posting your first Slack Bot message. Before being able to test this, we need to (1) configure our application **Scopes** and we need to (2) install our application in our Workspace. We can do both from our app's **OAuth & Permissions**.

In order to determine what scopes do we need, let's review the API method first. This method is called `chat.postMessage`, [here a link](https://api.slack.com/methods/chat.postMessage) to its docs. The reference docs declare the following:

* HTTP Method: `POST`
* Endpoint: `https://slack.com/api/chat.postMessage`
* Required scopes: `chat:write`

Every time we choose to use a specific API Method, we need to make sure our app has the required scopes enabled. For now, let's add `chat:write` and `chat:write.public` to our application **Scopes** and install our application to our Workspace.

`chat:write.public` will come in handy even if it isn't required by the docs to allow our Slack bot to send messages to channels where he/she isn't a member of.

Once we have done these two steps (defining scopes and installing), we should get an **Bot User OAuth Token** (accessible from our app's OAuth & Permissions page and starts with `xoxb-`). We need to pass this token in order to authenticate our message before Slack is able to post it to our Workspace.

### A note on using tokens

The **best** way to communicate your access tokens to Slack is by passing them in our request's `Authorization` HTTP header where the full value, including "Bearer", is case-sensitive and should look something like this:

```http
POST /api/chat.postMessage
Authorization: Bearer xoxb-1234-abcdefgh
```

### Required arguments

As we keep reviewing our API method's docs. We also see that in order for our Slack bot to post a message, we also need at least to declare a `channel` and a `text`. Use this cURL snippet (remember to use your Bot's token) and  Postman to give it a try:

```bash
curl --request POST 'https://slack.com/api/chat.postMessage' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer xoxb-1234-abcdefgh' \
--data-raw '{
  "channel": "general",
  "text": "Hello world :tada:"
}'
```

**Note**: passing `general` as the channel isn't considered a good practice. This is only for testing purposes. Ideally we want to declare a `channel_id` instead of a `channel_name` for `channel`. Here's more on how you can make sure you are [Picking the right conversation](https://api.slack.com/messaging/sending#conversations) (remember to keep in mind additional scopes you may require).

## Responding to Slash Commands

**Slash Commands** allow users to invoke your bot by typing a string into the message box (i.e. `/greet`). They can also contain a payload of data that your Slack bot can use to respond in whatever way they process that payload. [Here](https://slack.com/help/articles/201259356) is a list of Slack built-in slash commands if you want to review what's possible.

From **Slash Commands** you are able to click on **Create a New Command** and here's what you'll need (here's an example of mine):

* Command: `/greet`
* Request URL: `https://meeseeksbot.vercel.app/api/greet`
* Short Description: `Greet Mr. Meeseeks!`

### What happens when your command is invoked?

Slack sends an `HTTP POST` to the Request URL you specific in your command. This request contains a data payload describing the source command, here's an example of what to expect (using our `/greet` example command, more about each field [here](https://api.slack.com/interactivity/slash-commands#app_command_handling)):

```json
{
    "token":"{...}",
    "team_id":"{...}",
    "team_domain":"{...}",
    "channel_id":"{...}",
    "channel_name":"{...}",
    "user_id":"{...}",
    "user_name":"{...}",
    "command":"/greet",
    "text":"",
    "api_app_id":"{...}",
    "is_enterprise_install":"{...}",
    "response_url":"https://hooks.slack.com/commands/{...}",
    "trigger_id":"{...}"
}
```

### Responding to users

There are several options to choose from when responding to a user (see all options [here](https://api.slack.com/interactivity/handling#responses)). Let's write a regular **Message response**. To write one, from our Slash Command payload, we'll use the following fields to compose a message: `user_id`, `user_name`, `response_url`. Slack lets you write messages in Content Blocks and in plain text. For Content Blocks let's style our message using their [Block Kit Builder](https://app.slack.com/block-kit-builder), using the following Payload:

```json
{
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hello, <#${user_id}>! I'm Mr. Meeseeks! Look at me!"
			}
		}
	]
}
```

Feel free to get experimental with using it as you build a better interactivity for your users. [Here's](https://api.slack.com/reference/surfaces/formatting) also a great Guide on how to format your text for your application.

## Next.js API Handler

So, how are we building our response? For that we need to fire up a Next.js project. If you need help starting one, I recommend using [this](https://nextjs.org/docs/getting-started) resource. Once there, let's create an API file named `greet`, set up our `Bot User OAuth Token` environment variable using an `.env.local` file (read how more about it [here](https://nextjs.org/docs/basic-features/environment-variables)) and here's what I ended up writing:

```javascript
export default async function handler() {
    const { response_url, user_id, user_name } = req.body;

    try {
        const headers = {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
            "Content-type": "application/json",
        };

        let raw = `{
            response_type: "in_channel",
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "Hello, <#${user_id}>! I'm Mr. Meeseeks! Look at me!",
                    },
                },
            ],
            text: "Hello, ${user_name}!",
        }`;

        const requestOptions = {
            method: "POST",
            headers,
            body: raw,
        };

        await fetch(`${response_url}`, requestOptions);
        res.status(200).end();
    } catch (error) {
        console.log(error);
    }
}
```