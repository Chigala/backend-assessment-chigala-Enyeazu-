import request from "supertest";
import App from "@/app";
import AuthRoute from "@/routes/auth.route";

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing Auth", () => {
  describe("[POST] /signup", () => {
    it("response should have the Create userData", done => {
      const userData = {
        email: "chigalatheboss@gmail.com",
        password: "chigala2000",
        name: "chigalaman",
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      request(app.getServer())
        .post("/signup")
        .send(userData)
        .set("Accept", "application/json")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(response => {
          console.log(response);
        })
        .expect(201, done);
    });

    // it("check if the user already exists ", () => {
    //   const userData = {
    //     email: "test@gmail.com",
    //     password: "chigala",
    //     name: "chigala",
    //   };
    //   const authRoute = new AuthRoute();
    //   const app = new App([authRoute]);
    //   return request(app.getServer()).post("/signup").expect("Content-Type", /json/).send(userData).expect(409);
    // });
  });

  // describe("[POST] /login", () => {
  //   it("response should have the Set-Cookie header with the Authorization token", async () => {
  //     const userData = {
  //       email: "test@email.com",
  //       password: "q1w2e3r4",
  //     };

  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);
  //     return request(app.getServer())
  //       .post("/login")
  //       .send(userData)
  //       .expect("Set-Cookie", /^Authorization=.+/);
  //   });
  // });

  // error: StatusCode : 404, Message : Authentication token missing
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', () => {
  //     const authRoute = new AuthRoute();
  //     const app = new App([authRoute]);

  //     return request(app.getServer())
  //       .post('/logout')
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
