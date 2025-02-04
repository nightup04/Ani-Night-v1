const mongoose = require('mongoose');

const User = require('../models/user');

const ReplySchema = new mongoose.Schema({
    username: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
        profile: String
    },
    inputcomment: String,
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{ // Add this field to track users who liked the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    report: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [this] // For nested replies
});

const ArticleSchema = new mongoose.Schema({
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: {
        type: [String], // Changed to an array of strings for tags
        required: true
    },
    link_info: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    categories: {
        type: Array,
        required: true
    },
    photo: {
        type: String,
        default: ""
    },
    images: {
        type: [String], // Changed to an array of strings for image URLs
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    published: {
        type: Boolean,
        default: false
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        profile: {
            type: String
        },
    },
    date: { type: Date, default: Date.now },
    replies: [ReplySchema],
    url: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'likes'
    }],
    iduser: {
        type: String
    },
    profile: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    adsDisplayed: { type: Number, default: 0 }
},  { timestamps: true });

ArticleSchema.methods.updateEarnings = async function () {
    if (this.views >= 1000) {
        const earnings = Math.floor(this.views / 1000);
        await User.findByIdAndUpdate(this.author.id, { $inc: { earnings: earnings } });
        this.views = this.views % 1000;
        await this.save();
    }
};

const Acticle = mongoose.model('Acticle', ArticleSchema);

module.exports = Acticle; 