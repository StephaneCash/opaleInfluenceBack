const request = require('supertest');
const app = require('../app');

describe('Influenceur ', () => {

    it("Si tout se passe comme prévu, la fonction return 200 status", async () => {
        try {
            const response = await request(app).get("/api/influenceurs");
            expect(response.statusCode).toBe(200);
        } catch (error) {
            console.log("Erreur getData ::: " + error)
        }
    })

    it("Une fois enregistré le status sera de 201", async () => {
        const data = {
            nom: "Zeus",
            prenom: "Stéphane",
            postnom: "Cash",
            pseudo: "Dosa",
            detail: "Roi grec",
            textDetaillle: "Seigneur"
        }

        try {
            const response = await request(app).post("/api/influenceurs").send(data);
            if (response) {
                expect(response.statusCode).toBe(201);
            }
        } catch (error) {
            console.log(error)
        }
    })
})