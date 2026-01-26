const Complain = require('../models/complainSchema.js');

const complainCreate = async (req, res) => {
    try {
        const complain = new Complain(req.body)
        const result = await complain.save()
        res.send(result)
    } catch (err) {
        res.status(500).json(err);
    }
};

const complainList = async (req, res) => {
    try {
        let complains = await Complain.find({ school: req.params.id }).populate("user", "name");
        if (complains.length > 0) {
            res.send(complains)
        } else {
            res.send({ message: "No complains found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteComplain = async (req, res) => {
    try {
        const result = await Complain.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Grievance has been formally resolved and archived." });
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { complainCreate, complainList, deleteComplain };
