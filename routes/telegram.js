'use strict';
var express = require('express'),
    telegram = require('../helpers/telegram/telegram.js'),
    google = require('../helpers/google/search.js'),
    huiator = require('../helpers/text/huiator.js'),
    yasno = require('../helpers/text/yasno.js'),
    translation = require('../helpers/yandex/translation.js'),
    currency = require('../helpers/currency/currency.js'),
    statistic = require('../helpers/statistic/statistic'),
    youtube = require('../helpers/google/youtube'),
    _ = require('underscore'),
    router = express.Router();

router.post('/', function (req, res) {
    if (!req.body || !req.body.message || !req.body.message.chat || !req.body.message.message_id || !req.body.message.text) {
        res.statusCode = 200;
        res.end(null);
        return;
    }

    var telegramUpdate = req.body,
        telegramMessage = telegramUpdate.message.text,
        chat_id = telegramUpdate.message.chat.id,
        reply_to_message_id = telegramUpdate.message.message_id,
        user_info = telegramUpdate.message.from;

    statistic.takeMsg(telegramMessage);
    statistic.takeUserInfo(user_info);

    if (telegramMessage.lastIndexOf('/g', 0) === 0) {
        var query = telegramMessage.replace(telegramMessage.split(' ')[0], '');

        google.searchImage(query, function imageCallback(error, photo, tabUrl) {
            if (error) {
                telegram.sendMessage(chat_id, error, reply_to_message_id);
            }
            else {
                telegram.sendPhoto(chat_id, photo, reply_to_message_id, tabUrl);
            }
        });
    }

    if (telegramMessage.lastIndexOf('/h', 0) === 0) {
        var textHuyator = telegramMessage.replace(telegramMessage.split(' ')[0], '').trim(),
            huext = huiator.huify(textHuyator);
        if (textHuyator === huext) {
            telegram.sendMessage(chat_id, "https://www.youtube.com/watch?v=q5bc4nmDNio", reply_to_message_id)
        } else {
            telegram.sendMessage(chat_id, huext, reply_to_message_id);
        }
    }

    if (telegramMessage.lastIndexOf('/y', 0) === 0) {
        var textYasnoficator = telegramMessage.replace(telegramMessage.split(' ')[0], '').trim(),
            yaext = yasno.yasnyfy(textYasnoficator);
        if (textYasnoficator !== yaext) {
            telegram.sendMessage(chat_id, yaext, reply_to_message_id);
        }
    }

    if (telegramMessage.lastIndexOf('/c', 0) === 0) {
        currency.getCurrency(function (result) {
            var message = "Курсы валют:\n";
            _.mapObject(result, function (val, key) {
                message += key.toUpperCase() + ': ' + val + '\n';
            });
            telegram.sendMessage(chat_id, message, "");
        })
    }

    if (telegramMessage.lastIndexOf('/f', 0) === 0) {
        var fType = telegramMessage.replace(telegramMessage.split(' ')[0], '').trim(),
            type = 0;

        switch (fType) {
            case 'd' :
                type = 0;
                break;
            case '2d':
                type = 1;
                break;
            case 'w':
                type = 2;
                break;
            case 'm':
                type = 3;
                break;
            case 'y':
                type = 4;
                break;
            default:
                type = 0;
        }

        currency.getCurrencyGraph(function (error, image) {
            if (error) {
                telegram.sendMessage(chat_id, error, reply_to_message_id);
            } else {
                telegram.sendPhoto(chat_id, image, reply_to_message_id);
            }
        }, type)
    }

    if (telegramMessage.lastIndexOf('/t') === 0) {
        var textTranslation = telegramMessage.replace(telegramMessage.split(' ')[0], '');

        translation.translateEngRu(textTranslation, function (message, translatedText) {
            if (message) {
                telegram.sendMessage(chat_id, message, reply_to_message_id);
            } else {
                telegram.sendMessage(chat_id, translatedText, reply_to_message_id);
            }
        });
    }

    if (telegramMessage.lastIndexOf('/s') === 0) {
        telegram.sendMessage(chat_id, statistic.allTimeStats(), '');
    }

    if (telegramMessage.lastIndexOf('/u') === 0) {
        telegram.sendMessage(chat_id, statistic.getUsersDayStatistic(), '');
    }

    if (telegramMessage.lastIndexOf('/v', 0) === 0) {
        var youtubeQuery = telegramMessage.replace(telegramMessage.split(' ')[0], '').trim();

        youtube.search(youtubeQuery)
            .then(function (response) {
                telegram.sendMessage(chat_id, response, reply_to_message_id);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    res.statusCode = 200;
    res.end(null);
});

module.exports = router;