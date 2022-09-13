const pool = require('../database/db_connect');

exports.getItems = async() => {
    const sql = "select * from items where enable_flg = '1' order by id ";
    const items = await pool.query(sql, []);
    return items.rows;
}

exports.updateVoted = async(item_id) => {
    const sql = "update items set is_voted = '1', voted_dt = now() where  id = $1 ";
    const items = await pool.query(sql, [item_id]);
    return items.rows;
}