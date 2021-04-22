const { MongoClient } = require('mongodb')

class DB {

  client
  collection

  async connect(){
    const uri = `mongodb+srv://dima:4321@cluster0.i7qsl.mongodb.net/WeatherDB`
    this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    this.collection = await this.client.db('WeatherDB').collection('Favorites')
  }

  async alreadyContains(coords) {
  
    const query = { lat: coords.lat, lon: coords.lon }
    let result = await this.collection.findOne(query)
    return result !== null
  }

  async insert(city, coords) {
    if (await this.alreadyContains(coords)) return

    const doc = { name: city, lat: coords.lat, lon: coords.lon }
    await this.collection.insertOne(doc)
    return city
  }

  async delete(cityName) {
    const doc = { name: cityName }
    const deleteInfo = await this.collection.deleteOne(doc)
    if (deleteInfo.deletedCount == 0){
      const res = await this.collection.findOne({name : {$regex : `.*${cityName}.*`}})
      await this.collection.deleteOne({name: res.name})
    }
  }

  async getAll() {
    
    const result = [];
    const cursor = this.collection.find();
    await cursor.forEach(doc => {
      result.push(doc.name);
    })

    return result
  }

  disconnect(){
    this.client.close()
  }
}

module.exports = DB
