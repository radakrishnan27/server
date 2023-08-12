const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({

  trainingName: {
    type: String,
    required: true,
  },
  trainingArea: {
    type: String,
    required: true,
  },
  trainingCategory: {
    type: String,
    required: true,
  },
  trainingInstitution: {
    type: String,
    required: true,
  },
  trainingHours: {
    type: String,
    required: true,
  },
  curriculumDescription: {
    type: String,
    required: true,
  },
  curriculumFile: {
    type: [String],
    default: [],
  },
  curriculumApproved: {
    type: String,
    default: "Not Approved",
  },
  registeredAt: {
    type: Date,
    default: new Date(),
  },
});

dataSchema.post("validate", function (error, doc, next) {
  if (error) {
    const errors = {};
    for (let field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    next(errors);
  } else {
    next();
  }
});

const dataModel = mongoose.model("datas", dataSchema);
module.exports = dataModel;
