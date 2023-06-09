const router = require("express").Router();
const {
  Prebuilts,
  Characters,
  Weapon,
  Spells,
  User,
  CharOther,
  CharWeapon,
  Charspell,
  Other,
} = require("../models");
const checkAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const prebuiltData = await Prebuilts.findAll();

    const prebuilts = prebuiltData.map((prebuilt) =>
      prebuilt.get({ plain: true })
    );

    res.render("landing", {
      prebuilts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/UserPortal",{
      logged_in: req.session.logged_in,
    });
    return;
  }

  res.render("login");
});
router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/UserPortal", {
      logged_in: req.session.logged_in,
    });
    return;
  }

  res.render("signup");
});
router.get("/newCharacter", checkAuth, (req, res) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
    return;
  }

  res.render("newcharacter",{
    user:req.session.user_id,
    logged_in: req.session.logged_in,
  });
});

router.get("/UserPortal", checkAuth, async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const characterData = await Characters.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    // gets all the User info
    const user = await User.findAll({
      where: {
        id: req.session.user_id,
      },
    });

    // Serialize data so the template can read it
    const character = characterData.map((char) => char.get({ plain: true }));
    const userData= user.map((char) => char.get({ plain: true }));

    //assigns User's username
    const userName = userData[0].name
  
    // Pass serialized data and session flag into template
    res.render("UserPortal", {
      userName,
      character,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/prebuilt/:id", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const characterData = await Prebuilts.findByPk(req.params.id);
   
    // Serialize data so the template can read it
    const character = characterData.dataValues;

    // Pass serialized data and session flag into template
    res.render("prebuiltCharSheet", {
      character,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/character/:id", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const characterData = await Characters.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Spells,
          through: Charspell,
        },
        {
          model: Other,
          through: CharOther,
        },
        {
          model: Weapon,
          through: CharWeapon,
        },
      ],
    });

    // Serialize data so the template can read it
    const character = characterData.dataValues;
    console.log(character);

    // Pass serialized data and session flag into template
    res.render("characterSheet", {
      character,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
