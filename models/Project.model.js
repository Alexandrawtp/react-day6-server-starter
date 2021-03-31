const mongoose = require('mongoose');

let ProjectSchema = new mongoose.Schema({
    name: String,
    date: String,
    about: String,
    description: String,
    technologies: String,
    url: String,
    teammates: String,
    githubRepo: String,
    backgroundColor: Number
})

let ProjectModel = mongoose.model('project', ProjectSchema)

module.exports = ProjectModel;