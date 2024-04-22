const express = require('express')
const router = express.Router()
const verifyToken = require('../../middleware/auth')
const isAdmin = require('../../middleware/in_Admin')
const User = require('../../models/user')
const Article = require('../../models/acticle')
const Videos = require('../../models/video')
const AnimeApril = require('../../models/animeApril')
const AnimeJuly = require('../../models/animeJuly')
const AnimeBord = require('../../models/animebord')
const Animemay = require('../../models/animeMay')
const createAnime = require('../../controls/createAnimeRoute')
const create_2024 = require('../../routes/admin/2024/create')
const Admin_Router = require('./admin_router/admin')

const PAGE_SIZE = 5;

router.get('/admin/dash', verifyToken, async (req, res) => {
    try {
        const usersesstion = req.session.userlogin;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayCount = await User.countDocuments({
            createdAt: {
                $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
                $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
            }
        });

        const yesterdayCount = await User.countDocuments({
            createdAt: {
                $gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
                $lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
            }
        });

        const userCountup = {
            total: todayCount,
            up: todayCount - yesterdayCount
        };

        const userCount = await User.countDocuments();
        const VideosCount = await Videos.countDocuments();
        const articleCount = await Article.countDocuments();
        const users = await User.find();
        res.render('./admin/dash', {
            userCount,
            users,
            userCountup,
            usersesstion,
            articleCount,
            VideosCount,
            active: 'home-admin',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
    }
});

router.get('/admin/update_code', verifyToken, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/updateReward', {
        active: 'update-admin',
        usersesstion
    });
});

router.get('/admin/createAnime', verifyToken, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/createAnime', { usersesstion, active: 'createAnime-admin', });
});
router.get('/admin/createAnime/may', verifyToken, isAdmin, (req, res) => {
    const usersesstion = req.session.userlogin;
    res.render('./admin/animeMay', { usersesstion });
});
router.post('/createAnime', verifyToken, async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        // สร้างออบเจ็กต์ AnimeApril ใหม่จากข้อมูลที่รับมาจากฟอร์ม
        const newAnime = new AnimeApril({
            nameAnime: req.body.nameAnime,
            Produced: req.body.Produced,
            manuscript: req.body.manuscript,
            episodes: req.body.episodes,
            start: req.body.start,
            linkImage: req.body.linkImage,
        });

        const author = {
            id: usersesstion._id,
            username: usersesstion.username,
            profile: usersesstion.profile
        };

        // เพิ่มข้อมูลผู้เขียนลงในออบเจ็กต์ AnimeApril
        newAnime.author = author;

        // บันทึกออบเจ็กต์ AnimeApril ลงในฐานข้อมูล
        const savedAnime = await newAnime.save();

        // เพิ่ม ObjectId ของ AnimeApril ลงในฟิลด์ animeApril ในโมเดล AnimeBord
        await AnimeBord.findOneAndUpdate({}, { $push: { animeApril: savedAnime._id }, $set: { author: author } }, { new: true, upsert: true });

        // เมื่อบันทึกสำเร็จ ส่งคำตอบกลับไปยังผู้ใช้
        res.status(201).send('บันทึกข้อมูลอนิเมะสำเร็จ');
    } catch (error) {
        // หากเกิดข้อผิดพลาด ส่งคำตอบกลับไปพร้อมข้อความผิดพลาด
        res.status(400).send(error.message);
    }
})

router.post('/createAnime/may', createAnime.Addanimemay);

async function loadAnimeData(req, res, next) {
    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril');
        req.AnimeBordData = AnimeBordData;
        next();
    } catch (error) {
        next(error);
    }
}

router.get('/edit/anime/boards', loadAnimeData, async (req, res) => {
    const usersesstion = req.session.userlogin;

    try {
        const AnimeBordData = await AnimeBord.find().populate('animeApril animeMay animeJuly');
        if (!AnimeBordData) {
            return res.status(404).json({ error: "AnimeBordData not found" });
        }

        res.render('./admin/edits/adminboards', { usersesstion, AnimeBordData })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

router.post('/edit_animeboard', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeApril = await AnimeApril.findOne({ _id: edit_id }).exec();

        if (!animeApril) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/animebord', { active: 'dashboard', animeApril, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/edit_animeboard/may', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeMay = await Animemay.findOne({ _id: edit_id }).exec();

        if (!animeMay) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/animeMay', { active: 'dashboard', animeMay, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post('/edit_animeboard/July', async (req, res) => {
    const usersesstion = req.session.userlogin;
    const edit_id = req.body.edit_id;
    try {
        const animeJuly = await AnimeJuly.findOne({ _id: edit_id }).exec();

        if (!animeJuly) {
            return res.status(404).json({ error: "AnimeApril not found" });
        }

        res.render('./admin/edits/2024/animeJuly', { active: 'dashboard', animeJuly, usersesstion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/edit_animeboard/one', verifyToken, async (req, res) => {
    const update_id = req.body.update_id;
    try {
        const animeBord = await AnimeApril.findOne({ _id: update_id });
        if (!animeBord) {
            return res.status(404).json({ error: "AnimeBord not found" });
        }

        animeBord.nameAnime = req.body.nameAnime;
        animeBord.Produced = req.body.Produced;
        animeBord.manuscript = req.body.manuscript;
        animeBord.episodes = req.body.episodes;
        animeBord.start = req.body.start;
        animeBord.linkImage = req.body.linkImage;
        animeBord.info = req.body.info;
        animeBord.web = req.body.web;
        animeBord.bilibili = req.body.bilibili;
        animeBord.nameep = req.body.nameep;
        animeBord.Iqiyi = req.body.Iqiyi;
        animeBord.youtube = req.body.youtube;
        animeBord.yt_text = req.body.yt_text;
        animeBord.crunchyroll = req.body.crunchyroll;

        await animeBord.save();

        res.redirect('/admin/dash?alertMessageVideo=แก้ไขเรียบร้อยแล้ว');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit_animeboard/May/002', verifyToken, createAnime.EditanimeMay);
router.post('/edit_animeboard/EditanimeJuly', verifyToken, createAnime.EditanimeJuly);

router.get('/admin/update_link', verifyToken, (req, res) => {
    res.render('./admin/updatelink');
});

router.get('/success', (req, res) => {
    res.render('success')
})

router.use(create_2024);
router.use(Admin_Router);

module.exports = router