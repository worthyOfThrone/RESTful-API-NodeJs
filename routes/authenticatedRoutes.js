const router = require('express').Router();
const auth = require('./verifyRoutes');
const User = require('../model/User');
const mongoose = require('mongoose');
const Employee = require('../model/Employee');

// @route GET api/posts/userList
// @description Get User List based on request body data
// @access Private
router.get('/userList', auth, async (req, res) => {

    const pageNo = parseInt(req.query.pageNo) || 1;
    const size = parseInt(req.query.size);
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.send(response)
    }
    const query = {};

    // generate query string based on request body data to search user(s)
    if (req.body.first_name) query.first_name = { $eq: req.body.first_name };
    if (req.body.last_name) query.last_name = { $eq: req.body.last_name };

    try {
        await mongoose.connection.collection('users').aggregate([
            { $match: query },
            {
                $project: {
                    'last_name': 1,
                    'first_name': 1,
                    'email': 1,
                    'employee_details.organisation_name': 1,
                    'employee_details._id': 1
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'employee_details'
                }
            },
            { $sort: req.body.sortBy },
            {
                '$facet': {
                    metadata: [{ $count: "total" }, { $addFields: { page: pageNo } }],
                    data: [
                        { $skip: size * (pageNo - 1) },
                        { $limit: size || 9999 }
                    ] // add projection here wish you re-shape the docs
                }
            }
        ]).toArray((err, result) => {
            if (err) return res.status(500).send('Internal server error');

            return res.send(result);
        });
    } catch (err) {
        res.status(404).send('User not found');
    }
});


// @route GET api/posts/getEmployee/:employeeId
// @description Search Employee detail by sending employeeId through query param i.e. req.params.employeeId
// @access Private
router.get('/getEmployee/:employeeId', auth, async (req, res) => {
    try {
        const userList = await Employee.findById({ _id: req.params.employeeId });
        await mongoose.connection.collection('users').aggregate([
            { $match: { _id: userList.user } },
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'employee_details'
                }
            }]).toArray((err, result) => {
                if (err) return res.status(500).send('Internal server error');
                return res.send(result);
            });
    } catch (err) {
        res.status(404).send('User Not Found');
    }
});

module.exports = router;