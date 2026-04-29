const router = require("express").Router();
const Menu = require("../models/Menu");

// GET ALL MENU ITEMS
router.get("/", async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});

// ADD ITEM (ADMIN)
router.post("/", async (req, res) => {
  const item = await Menu.create(req.body);
  res.json(item);
});

// UPDATE ITEM
router.put("/:id", async (req, res) => {
  const item = await Menu.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(item);
});

// DELETE ITEM
router.delete("/:id", async (req, res) => {
  await Menu.findByIdAndDelete(req.params.id);
  res.json({ message: "Menu item deleted" });
});

module.exports = router;