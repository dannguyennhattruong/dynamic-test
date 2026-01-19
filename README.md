# Telegram Mini App + Dynamic connect

Steps to have the Telegram Mini App (TMA) + Bot running

1. Create a Bot on Telegram using Botfather, [link to tutorial](https://core.telegram.org/bots/tutorial#getting-ready)
2. Clone this repo, run `cp .env.sample .env` and use your own Dynamic environment ID by replacing `NEXT_PUBLIC_DYNAMIC_ENV_ID` in the `.env` file
3. Deploy your website online. [link to tutorial](https://vercel.com/docs/deployments/git#deploying-a-git-repository)
4. Using Botfather, add the website url that should be opened for your TMA. [link to tutorial](https://docs.ton.org/develop/dapps/telegram-apps/step-by-step-guide#3-set-up-bot-mini-app)
5. Use Bot `TOKEN` from Telegram and your website url as LOGIN_URL in the `.env` file.
6. Run telegram bot `ts-node scripts/bot.ts`. If you do not have `ts-node` you can install it by running `npm -g i ts-node`
7. Go to your Telegram Bot and type `/start`

[Build Around the Booming Telegram Ecosystem](https://www.dynamic.xyz/ecosystems/telegram)

# How to get env values

1. Visit: https://app.dynamic.xyz/ to get `NEXT_PUBLIC_DYNAMIC_ENV_ID`
2. `LOGIN_URL` is your app domain
3. `TELEGRAM_BOT_TOKEN` is your bot token

# How to setup auto login with telegram

1. Visit: https://app.dynamic.xyz/ and access `Log in and User Profile`
2. Scroll to `Social` and find `Telegram` options
3. Select `Your credentials` option and enter `Bot Name` and `Bot Token`
4. Get value of `Bot Domain` and setup that to Your Bot Domain in Telegram