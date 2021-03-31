const express = require("express");
const router = express.Router();
let ProjectModel = require("../models/Project.model");

router.post("/create", (req, res) => {
  const {
    name,
    date,
    about,
    description,
    technologies,
    url,
    teammates,
    githubRepo,
    backgroundColor
  } = req.body;

  ProjectModel.create({
    name,
    date,
    about,
    description,
    technologies,
    url,
    teammates,
    githubRepo,
    backgroundColor
  })
    .then((response) => res.status(200).json(response))
    .catch((err) =>
      res.status(500).json({
        error: "Project creation failed",
        message: err,
      })
    );
});

router.get("/projects", (req, res) => {
  ProjectModel.find()
    .then((projects) => res.status(200).json(projects))
    .catch((err) =>
      res.status(500).json({
        error: "Getting projects failed",
        message: err,
      })
    );
});

router.get("/project/:id", (req, res) => {
  ProjectModel.findById(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) =>
      res.status(500).json({
        error: "Getting project failed",
        message: err,
      })
    );
});

module.exports = router;