const express = require('express')
const app = express()
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path')
const cors = require("cors");



app.use(cors());
app.use(express.json())

const dbPath = path.join(__dirname, 'demodb.db')
let db = null

const initializeDbAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(5006, () => {
            console.log('Server Running at http://localhost:5006')
        })
    } catch (error) {
        console.log(`DB Error : ${error.message}`)
        process.exit(1)
    }
}
initializeDbAndServer()


app.get('/notes',async (req, res) => {
try{
        const query = `SELECT * FROM Notes `
        const userDbDetails =  await db.all(query);
            console.log('DB value', userDbDetails);
            res.send(userDbDetails)
} catch(error){
    console.error("ERROR", error)
}

})

app.get('/notesFilter',async (req, res) => {
    try{
   console.log("CAT", req.query)
    const { search } = req.query;
    const getUserQuery = `select * from Notes`;
    let filterRecords = []
    const userDbDetails = await db.all(getUserQuery);
    filterRecords = userDbDetails.filter(ele => {
        console.log("CATERY", ele.category, search)
        //return ele.category.toLowerCase() == category.toLowerCase()
        return ele.category.toLowerCase().includes(search.toLowerCase()) || ele.title.toLowerCase().includes(search.toLowerCase())

    })
    console.log('Search value', filterRecords);
    res.send(filterRecords)
} catch(error) {
    console.error("ERROR", error)
}
})

app.post('/notes',async(req,res)=>{
    try{
    const { title,description,category } = req.body;
    const insertquery=`INSERT INTO Notes (title,description,category)
    VALUES ('${title}','${description}','${category}')`;
   const insertData=await db.run(insertquery)
   
   const query = `SELECT * FROM Notes `
   const userDbDetails =  await db.all(query);
       console.log('DB value', userDbDetails);
       res.send(userDbDetails)
    } catch(error) {
        console.error("ERROR", error)
    }
})

app.put('/notes/:id',async (req, res) => {
    try{
    let dateAndTime= new Date().toISOString()
    const notesId = parseInt(req.params.id); 
    const { title,description,category} = req.body;
    const updatequery=`UPDATE Notes SET title='${title}', description='${description}',category='${category}',updated_at='${dateAndTime}' WHERE id=${notesId}`;
   const updateData=await db.run(updatequery)
   
   const query = `SELECT * FROM Notes `
   const userDbDetails =  await db.all(query);
       console.log('DB value', userDbDetails);
       res.send(userDbDetails)
    } catch(error) {
        console.error("ERROR", error)
    }
    
})


app.delete('/notes/:id', async(req, res) => {
    try {
    const notesId = req.params.id;
    const deletequery = `DELETE FROM Notes WHERE id = ${notesId}`;
    await db.run(deletequery)
    const query = `SELECT * FROM Notes `
    const userDbDetails =  await db.all(query);
        console.log('DB value', userDbDetails);
        res.send(userDbDetails)
    } catch(error) {
        console.error("ERROR", error)
    }
 })
