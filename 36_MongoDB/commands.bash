// commands to copy paste to MongoDB Shell

mongosh

use league
show collections

db.champs.find()

db.champs.insertOne({ 'name': 'Zed' })
db.champs.deleteOne({ 'name': 'Zed' })

db.summoners.find({})

db.summoners.insertOne({ 'summoner': 'Doroke', 'rank': 'Diamond' })
db.summoners.insertMany([{ 'summoner': 'Nettopro', 'rank': 'Master' }, { 'summoner': 'Renacchi', 'rank': 'unranked' }])

db.champs.find({ 'name': 'Zed' })

db.champs.updateOne({ '_id': ObjectId('63f51ce60e99f677795b2303') }, { $set: { 'roles': ['mid', 'top', 'jungle', 'support'] }})
db.champs.updateOne({ 'name': 'Zed' }, { $set: { 'roles': ['mid', 'top', 'jungle', 'support'] }})

db.champs.find({'_id': ObjectId('63f51ce60e99f677795b2303')})

# querying all the mid champs
db.champs.find({ 'roles': { $in: ['mid'] }})

db.champs.updateOne({'_id': ObjectId('63f51ce60e99f677795b2303')}, { $currentDate: { lastModified: true } })

db.roles.insertOne({ 'role': 'mid' })
db.roles.deleteMany({ 'role': 'mid' })

db.summoners.insertOne({ 'name': 'Doroke', 'champs': { 'mid': ['Zed', 'LeBlanc', 'Zoe'], 'jungle': 'Lee Sin' }})
db.summoners.find({ 'champs.mid': { $in: ['Zed', 'Zoe'] }})
db.summoners.find({ 'champs.jungle': { $in: ['Lee Sin'] }})