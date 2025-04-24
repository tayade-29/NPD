const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/apqp-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Mongoose Schema
const APQPDataSchema = new mongoose.Schema({
  formData: Object,
  rows: [Object],
  createdAt: { type: Date, default: Date.now }
});
const APQPData = mongoose.model("APQPData", APQPDataSchema);

// POST Route to save data
app.post("/api/save-apqp", async (req, res) => {
  try {
    const { formData, rows } = req.body;
    const newEntry = new APQPData({ formData, rows });
    await newEntry.save();
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ message: "Error saving data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
