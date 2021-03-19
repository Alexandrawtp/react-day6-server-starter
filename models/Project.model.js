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
    images: String,
    completed: Boolean
})

let ProjectModel = mongoose.model('project', ProjectSchema)

module.exports = ProjectModel;