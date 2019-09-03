const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

const validator = (item, items) => {
    if(!item.startDate){
        return 'Start Date is required';
    }
    if(!item.endDate){
        return 'End Date is required';
    }

    items.map(i => {
        if(i.startDate === item.startDate && i.endDate === item.endDate){
            return 'Vacation must be unique';
        }
    })
}

const db = require('./db')('./vacations.json', validator);
app.listen(3000, () => console.log('listening on port 3000'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.get('/api/vacations', async(req, res, next) => {
    try{
        res.send(await db.findAll());
    }
    catch(ex){
        next(ex);
    }
})

app.post('/api/vacations', async(req, res, next) => {
    console.log(req.body)
    try{
        res.send(await db.create(req.body));
    }
    catch(ex){
        next(ex);
    }
})

app.delete('/api/vacations/:id', async (req, res, next) => {
    // console.log(req.body.id)
    try{
        console.log(req.body.id)
        res.send(await db.destroy(req.body.id));
        res.sendStatus(204);
    }
    catch(ex){
        next(ex);
    }
  })

  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({message: err.message});
  })
