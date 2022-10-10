import request from "supertest";
import App from "@/app";
import { CreateUserDto } from "@dtos/users.dto";
import AuthRoute from "@/routes/auth.route";

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe("Testing Auth", () => {
  describe("[POST] /signup", () => {
    it("response should have the Create userData", () => {
      const userData: CreateUserDto = {
        email: "test@email.com",
        password: "q1w2e3r4",
        name: "chigala",
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer()).post("/signup").send(userData).expect(201);
    });

    it("check if the user already exists ", () => {
      const userData = {
        email: "test@gmail.com",
        password: "chigala",
        name: "chigala",
      };
      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer()).post("/signup").send(userData).expect(409);
    });
  });

  describe("[POST] /login", () => {
    it("response should have the Set-Cookie header with the Authorization token", async () => {
      const userData = {
        email: "test@email.com",
        password: "q1w2e3r4",
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);
      return request(app.getServer())
        .post("/login")
        .send(userData)
        .expect("Set-Cookie", /^Authorization=.+/);
    });
  });

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
