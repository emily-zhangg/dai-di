import bcrypt from "bcryptjs";
import { resolve } from "path";
export default function initUserController(db) {
  const login = (req, res) => {
    res.sendFile(resolve("dist", "login.html"));
  };
  const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return console.error("error", err);
      }
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return console.error("error", err);
        }
        const userCreated = await db.User.create({
          name: username,
          email,
          password: hash,
        });
        res.redirect("/");
      });
    });
  };
  const loggedIn = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email);
    const userDetails = await db.User.findAll({
      where: {
        email,
      },
    });
    console.log(userDetails);
    if (userDetails) {
      bcrypt.compare(
        password,
        userDetails[0].dataValues.password,
        (err, result) => {
          if (err) {
            console.error("error", err);
            res.send("fail");
            return;
          }
          res.cookie("userId", userDetails[0].dataValues.id);
          res.redirect("/");
        }
      );
    }
  };
  return { login, loggedIn, signUp };
}
