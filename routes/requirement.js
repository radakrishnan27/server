const express = require("express");
const input = express();
const jwt = require("jsonwebtoken");

input.use(express.json());
input.use(express.urlencoded({ extended: true }));

const curriculumData = require("../model/curriculum");

// ADMIN REQUIREMENT POST

input.post("/requirementAdminPost", async (req, res) => {
  try {
    const val = req.body;
    const newRequirement = new curriculumData(val);
    await newRequirement.save();
    res.status(200).json({ message: "Requirement added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to add requirement to database" });
  }
});

// ADMIN VIEW REQUIREMENT

input.get("/viewdata/:token", async (req, res) => {
  try {
    const searchQuery = {};

    if (req.query.trainingName) {
      searchQuery.trainingName = req.query.trainingName;
    }
    if (req.query.trainingArea) {
      searchQuery.trainingArea = req.query.trainingArea;
    }
    if (req.query.trainingCategory) {
      searchQuery.trainingCategory = req.query.trainingCategory;
    }
    if (req.query.trainingInstitution) {
      searchQuery.trainingInstitution = req.query.trainingInstitution;
    }

    const data = await curriculumData.find(searchQuery);
    try {
      jwt.verify(req.params.token, "ictak", (error, decoded) => {
        if (decoded && decoded.email) {
          res.status(200).json({
            message: "Data fetched successfully",
            data: data,
          });
        } else {
          res.status(500).json({ message: "Unauthorized user" });
        }
      });
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch data from database" });
  }
});

// ADMIN DELETE REQUIREMENT

input.delete("/deletepost/:_id", async (req, res) => {
  try {
    let id = req.params._id;
    await curriculumData.findByIdAndDelete(id);
    res.status(200).json({ message: "Curriculum deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error!!! Data not deleted");
  }
});

input.put("/updateRequirement/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = {
      $set: {
        trainingName: req.body.trainingName,
        trainingArea: req.body.trainingArea,
        trainingCategory: req.body.trainingCategory,
        trainingInstitution: req.body.trainingInstitution,
        trainingHours: req.body.trainingHours,
        curriculumDescription: req.body.curriculumDescription,
        curriculumFile: req.body.curriculumFile,
        curriculumApproved: req.body.curriculumApproved,
      },
    };
    await curriculumData.findByIdAndUpdate(id, updatedData);
    res.status(200).json({ message: "Requirement Updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Requirement unable to update" });
  }
});

// SEARCH BAR OPTIONS

input.get("/options", async (req, res) => {
  try {
    const options = {};

    // Fetch distinct values for trainingName
    options.trainingNames = await curriculumData
      .distinct("trainingName")
      .exec();

    // Fetch distinct values for trainingArea
    options.trainingAreas = await curriculumData
      .distinct("trainingArea")
      .exec();

    // Fetch distinct values for trainingCategory
    options.trainingCategories = await curriculumData
      .distinct("trainingCategory")
      .exec();

    // Fetch distinct values for trainingInstitution
    options.trainingInstitutions = await curriculumData
      .distinct("trainingInstitution")
      .exec();

    res.status(200).json(options);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch options" });
  }
});

// Error handling middleware
input.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = input;
