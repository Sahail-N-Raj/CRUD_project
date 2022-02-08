const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    note_name: {
      type: String,
      required: true,
    },
    note_description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//structure of the schema
module.exports = mongoose.model("note_schema", NoteSchema);
