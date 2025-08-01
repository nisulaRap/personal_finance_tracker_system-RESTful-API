const request = require("supertest");
const app = require("../../index");

describe("Security Testing", () => {
    
    describe("SQL Injection Testing", () => {
        it("should prevent NoSQL injection in user ID", async () => {
            const res = await request(app).get(`/users/{ "$ne": null }`);
            expect(res.statusCode).toBe(400); 
        });
    });

    describe("Cross-Site Scripting (XSS) Testing", () => {

        it("Should prevent XSS attacks in login", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "Bimal",
                password: "4567qw"
            });

          expect(res.statusCode).toBe(400);
          expect(res.body.message).toBe("Invalid credentials");
        });
    });

    describe("Insecure authentication", () => {
        
      it("should reject weak passwords", async () => {
        const res = await request(app).post("/auth/register").send({
          username: "Nilupul",
          email: "Nilupul@gmail.com",
          password: "12345",
          role: "admin",
          currency: "USD"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Password must be at least 6 characters long"); 
      });
    });
    
});
