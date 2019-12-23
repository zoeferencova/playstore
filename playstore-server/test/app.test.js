const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app.js');

describe('Playstore app', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
            })
    })

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'MISTAKE' })
            .expect(400, 'Must sort by rating or app')
    })

    it('should be 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'MISTAKE' })
            .expect(400, 'Invalid genre')
    })

    it('should only include results with the Action genre if provided', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'Action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                for(i=0; i < res.body.length; i++) {
                    expect(res.body[i]['Genres']).to.include('Action')
                }
            })
    })

    it('should sort by Rating if sort query is Rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i=0;
                while (i < res.body.length - 1) {
                    if (res.body[i].rating < res.body[i + 1].rating) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })

    it('should sort by App if sort query is App', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i=0;
                while (i < res.body.length - 1) {
                    if (res.body[i].app < res.body[i + 1].app) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
})