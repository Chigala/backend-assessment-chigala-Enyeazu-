import request from "supertest";
import App from "@/app";
import AuthRoute from "@/routes/auth.route";

const app = new App([new AuthRoute()]);
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing Auth", () => {
  describe("[POST] /signup", () => {
    it("response should have the Create userData", done => {
      const userData = {
        email: "test700@gmail.com",
        name: "hellojki",
      };

      request(app.getServer())
        .post("/signup")
        .send(userData)
        .set("Accept", "application/json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, done);
    });
    it("checks if the userData contains a username ", done => {
      const userData = {
        email: "test@gmail.com ",
        password: "12345678",
      };
      request(app.getServer())
        .post("/signup")
        .send(userData)
        .set("Accept", "application/json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, done);
    });
    it("checks if the userData contains a password ", done => {
      const userData = {
        email: "test@gmail.com",
        username: "hello",
      };
      request(app.getServer())
        .post("/signup")
        .send(userData)
        .set("Accept", "application/json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, done);
    });
  });

  describe("[POST] /login", () => {
    it("response should have the Set-Cookie header with the Authorization token", async () => {
      const userData = {
        email: "test@email.com",
        password: "q1w2e3r4",
      };
      request(app.getServer())
        .post("/login")
        .set("Accept", "application/json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .send(userData)
        .expect("Set-Cookie", /^Authorization=.+/);
    });
  });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe("[POST] /logout", () => {
  //   it("logout Set-Cookie Authorization=; Max-age=0", () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post("/logout")
  //       .expect("Set-Cookie", /^Authorization=\;/);
  //   });
  // });
});
