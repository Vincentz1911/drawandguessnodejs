const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageModel = new Schema({
    name: { type: String },
    category: {type: String },
    image: { type: String },
    english: { type: String },
    german: { type: String },
    french: { type: String },
    italian: { type: String },
    spanish: { type: String },
    danish: { type: String }
});

module.exports = mongoose.model("DaGImage", imageModel)