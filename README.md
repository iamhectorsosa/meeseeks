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
* Request URL: `https://{...}.vercel.app/api/greet`
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
				"text": "Hello, <@${user_id}>! I'm Mr. Meeseeks! Look at me!"
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
    const { response_url, user_id } = req.body;

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
                        text: "Hello, <@${user_id}>! I'm Mr. Meeseeks! Look at me!",
                    },
                },
            ],
            text: "Hello, I'm Mr. Meeseeks! Look at me!",
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

Here what I've done adding multiple Slash commands:

![Meeseeks Slack Bot](https://res.cloudinary.com/dmca9ldbv/image/upload/v1654635710/blog/how-to-create-a-slack-bot/Preview_i8cvmx.png)

## Exploring Mentions with your Bot

How let's explore another highly common use case for your bot: **Handling mentions**. Slacks enables mentions via the subscription of events. The [Events API](https://api.slack.com/apis/connections/events-api) is a streamlined, easy way to build bots that responds to activities in Slack.

To being working with Events, find the "Event Subscriptions" configuration page and use the toggle to turn them on. A Request URL will be required where Slack will send `HTTP POST` requests when the event is triggered.

### Digital Handshake

The events sent to your Request URL may contain sensitive information associated with the workspaces having approved your Slack app. To ensure that events are being delivered to a server under your direct control, we must verify your ownership by issuing you a challenge request.

The first thing your application will require is a Request URL where Slack will send an HTTP Post request that doesn't require Authentication but you need to have a server respond code of `HTTP 200 OK` and return the challenge as well. Here's how I implemented mine:

```javascript
const { challenge } = req.body;
res.status(200).json({ challenge: `${challenge}` });
```

Once your URL es verified, go ahead and select an event that you wish to register to. I'm gonna go with `app_mention`. Also verify that your bot has the required scopes for the event you registered. In this case `app_mentions:read` is required. Here's the basic event structure payload you can expect:

```json
{
  token: '{..}',
  team_id: '{..}',
  api_app_id: '{..}',
  event: {
    client_msg_id: '{..}',
    type: 'app_mention',
    text: '<@U03JZTCSEC8>',
    user: '{..}',
    ts: '{..}',
    team: '{..}',
    blocks: [ [Object] ],
    channel: '{..}',
    event_ts: '{..}'
  },
  type: 'event_callback',
  event_id: '{..}',
  event_time: 1654874099,
  authorizations: [
    {
      enterprise_id: null,
      team_id: '{..}',
      user_id: '{..}',
      is_bot: true,
      is_enterprise_install: false
    }
  ],
  is_ext_shared_channel: false,
  event_context: '{..}'
}
```

Then, once I identify how I would like to handle the event. I process my handler function accordingly. Note that the Event API doesn't have a `response_url` as the Slash Command does, so take that into account. Also `app_mentions` type events only apply for Mentions in Channels whether it is the invite mention or subsequent mentions of your Slack Bot.

## Conclusion

If you have a Slack Workspace with your friends or at work, you can definitely give [Meeseeks](https://meeseeksbot.vercel.app/) a try. This Slack Bot is opened sourced and publicly distributed (unless Slack takes it down after its review). For more details and information you can reference the [Meeseeks GitHub repository](https://github.com/ekqt/meeseeks) since it is Open-sourced.