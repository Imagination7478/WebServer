const router = require('express').Router()
const coordsIsTrue = require('../api/coordsIsTrue')
router.route('/')


const ApiReq = require('../api/apiReq')
const apiReq = new ApiReq()

const DB = require('../api/DB')
const db = new DB();

router.get('/weather/city', async (req , res)  => {
   if(!req.query.q) {
       res.status(404).json()
       return
   }

   const apiResponse = await apiReq.getCity(req.query.q)
   res.json(apiResponse)
})

router.get('/weather/coordinates', async (req, res) => {
    if(!coordsIsTrue(req.query.lat, req.query.lon)) {
        res.status(404).json()
        return
    }
    
    const query = req.query.lat + ',' + req.query.lon
    const apiResponse = await apiReq.getCity(query)
    res.json(apiResponse)
})

router.get('/favorites',  async (req, res) => {
    const favorites = await db.getAll();
    const favoritesWeather = await apiReq.getAny(favorites);
      
    res.json({ favorites: favoritesWeather })
})

router.post('/favorites', async (req, res) => {
    if(!req.query.city){
        res.status(404).send()
        return
    }

    const data = await apiReq.getCity(req.query.city)
    const city = await db.insert(data.city, data.coords)
    res.status(201).json({name: city})
})

router.delete('/favorites', async(req, res) => {
    if(!req.query.city) {
        res.status(404).send()
        return
    }

    await db.delete(req.query.city)
    res.status(204).send()
})


module.exports = router
