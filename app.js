const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '751180175:AAE5hVikpAlYm0lLLmH7ZlVCujjJR3pprZI';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/curse/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, 'Какая валюта Вас интересует?', {
    reply_markup:{
        inline_keyboard:[
            [
                {
                    text:'USD',
                    callback_data:'USD'
                },
                {
                    text:'EUR',
                    callback_data:'EUR'
                },
                {
                    text:'RUR',
                    callback_data:'RUR'
                },
                {
                    text:'BTC',
                    callback_data:'BTC'
                },
            ]
        ]
    }
  });
});

bot.on('callback_query', query => {
    const id = query.message.chat.id;

    axios
        .get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
        .then(response => {
            const data = response.data,
                  result = data.filter(item => item.ccy === query.data)[0],
                  flag = {
                      'UAH': '🇺🇦',
                      'EUR': '🇪🇺',
                      'USD': '🇺🇸',
                      'RUR': '🇷🇺',
                      'BTC': '₿'
                  };

            let md = `
                *${flag[result.ccy]} ${result.ccy} => ${result.base_ccy} ${flag[result.base_ccy]}*
                Buy: _${result.buy}_
                Sale: _${result.sale}_
            `;
            bot.sendMessage(id, md, {parse_mode:'Markdown'});
        })
        .catch(err => console.log(err));
})