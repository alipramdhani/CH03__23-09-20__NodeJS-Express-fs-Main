// CORE PACKAGE/MODULE
const fs = require('fs');

// OUR OWN PACKAGE/MODUL

// THIRD PACKAGE/MODULE
const express = require('express');
const app = express()

// middleware dari express
// memodifikasi incoming request/request body ke api kita
app.use(express.json());

// bikin env.port untuk membaca env port atau port 3000
const port = process.env.port || 3000;

// baca data dari file json
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tours
        }
    })
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id)

    if(!tour) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    // generate id untuk data baru request api kita
    const newId = tours[tours.length - 1].id +1;
    const newData = Object.assign({id: newId}, req.body);

    tours.push(newData);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => { 
        res.status(201).json({
            status: 'success',
            data: {
                    tour: newData
                },
            });
         }
    );
    // res.send('udah');
});

app.patch('/api/v1/tours/:id',(req, res) => {
    const id = req.params.id * 1;
    // findIndex = -1 (kalau data nya gk ada)
    const tour = tours.findIndex(el => el.id === id)

    if(!tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: `data with ${id} this not found`
        })
    }
    tours[tourIndex] = {...tours[tourIndex], ...req.body}

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err => {
        res.status(200).json({
            status: 'success',
            message: `tour with this id ${id} edited`,
            data: {
                    tour: tours[tourIndex]
            },
        });
    })
})

app.delete('/api/v1/tours/:id',(req, res) => {
    // konversi string jadi number
    const id = req.params.id * 1;
    // cari index dari data yang sesuai id di req.params
    const tourIndex = tours.findIndex(el => el.id === id);

    // validasi kalau data yang sesuai req.param id nya ga ada
    if(tourIndex === -1) {
        return res.status(404).json({
            status: 'failed',
            message: 'data not found'
        })
    }
    // proses menghapus data sesuai index array nya dari req.param.id
    tours.splice(tourIndex, 1)

    // proses update di file json nya
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), (err) => {
        res.status(200).json({
            status: 'success',
            message: 'berhasil delete data',
            data: null
        });
    })
})

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});