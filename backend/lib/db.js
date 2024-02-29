const mongoose = require('mongoose');

module.exports.Connect = async ()=> mongoose.connect("mongodb://localhost:27017/development?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");