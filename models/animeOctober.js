const mongoose = require('mongoose');

const animeOctoberSchema = new mongoose.Schema({
    nameAnime: {
        type: String
    },
    Produced: {
        type: String
    },
    manuscript: {
        type: String
    },
    episodes: {
        type: String
    },
    start: {
        type: String
    },
    linkImage: {
        type: String
    },
    info: {
        type: String
    },
    web: {
        type: String
    },
    bilibili: {
        type: String
    },
    netflix: {
        type: String
    },
    nameep: {
        type: String
    },
    Iqiyi: {
        type:String
    },
    youtube: {
        type:String
    },
    yt_text: {
        type:String
    },
    crunchyroll: {
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const animeOctober = mongoose.model('animeOctober', animeOctoberSchema);

module.exports = animeOctober; 