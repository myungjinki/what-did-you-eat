var express = require("express");
var router = express.Router();
const loginService = require("../services/login");

/**
 * @swagger
 *  /login/google:
 *    posts:
 *      tags:
 *      - posts
 *      description: 내가 쓴 글을 다 가져옵니다.
 *
 *      responses:
 *       200:
 *        description: 잘 가져왔다!
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Posts'
 *
 */
router.post("/google", function (req, res, next) {
  if (req.body.googleId == undefined || req.body.email == undefined) {
    res.status(400).send({
      success: false,
      data: {
        isSigned: false,
      },
      message: "missing googleId or email in POST body",
    });
  } else {
    loginService.isSigned(req, res, next);
  }
});

module.exports = router;
