const express = require('express');
const router = express.Router();

const itemCtrl = require('../controller/item_ctrl');

router.route("/get_items").post( async (req, res) => {
    try {
        const items = await itemCtrl.getItems();
        return res.status(200).json({
            status: true,
            items: items
        });
    } catch (err) {
        return res.status(200).json({
            status: false,
            error:err
        });
    }
});

router.route("/update_voted").post( async (req, res) => {
    try {
        const item_id = req.body.item_id;
        const items = await itemCtrl.updateVoted(item_id);
        return res.status(200).json({
            status: true,
            item_id: item_id
        });
    } catch (err) {
        return res.status(200).json({
            status: false,
            error:err
        });
    }
});

module.exports = router;