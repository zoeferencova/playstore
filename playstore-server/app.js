const express = require('express')
const morgan = require('morgan')
const apps = require('./playstore-data')

const app = express();

app.use(morgan('dev'))

app.get('/apps', (req, res) => {
    const { sort, genres = '' } = req.query;

    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
            return res.status(400).send('Must sort by rating or app')
        }
    }
    
    if (genres) {
        if(!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
            return res.status(400).send('Invalid genre')
        }
    }

    let results = apps.filter(app => app.Genres.toLowerCase().includes(genres.toLowerCase()))

    if (sort) {
        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0;
        })
    }
    
    

    res.json(results)
})

app.listen(8000, () => {
    console.log('Server started on PORT 8000')
})