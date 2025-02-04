const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    nameAnime: String,
    Produced: String,
    manuscript: String,
    episodes: String,
    start: String,
    linkImage: String,
    Imagebackgroud: String,
    year: String,
    month: String,
    season: String,
    dub: String,
    sub: String,
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
        type: String
    },
    youtube: {
        type: String
    },
    yt_text: {
        type: String
    },
    crunchyroll: {
        type: String
    },
    Synopsis: {
        type: String
    },
    linkdemo: {
        type: String
    },
    platforms: Array,
    Dubbings: {
        dubthai: [
            {
                namevoice: String,
                voiceimage: String,
                character: String,
                role: String,
                characterimage: String
            }
        ],
        dubjpan: [
            {
                namevoice: String,
                voiceimage: String,
                character: String,
                role: String,
                characterimage: String
            }
        ]
    },
    publicationStartTime: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

const Anime = mongoose.model('Anime', animeSchema);
module.exports = Anime; 