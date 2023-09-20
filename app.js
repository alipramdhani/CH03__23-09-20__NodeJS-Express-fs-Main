// CORE PACKAGE/MODULE
const fs = require("fs")

// OUR OWN PACKAGE/MODUL

// THIRD PACKAGE/MODULE
const express = require("express")
const morgan = require("morgan")
const app = express()

// middleware dari express
// memodifikasi incoming request/request body ke api kita
app.use(express.json())
app.use(morgan("dev"))

// OUR OWN MIDDLEWARE
// middleware function
app.use((req, res, next) => {
    console.log(
        "hallo FSW2 di middleware kita sendiri"
    )
    next()
})

// logging
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log(req.requestTime)
    next()
})

// // middleware untuk check nih bileh ga di akses user tersebut === authorization
// app.use((req, res, next) => {
//     if (req.body.role !== "admin") {
//         return res.status(401).json({
//             message: "kamu tidak boleh akses",
//         })
//     }
//     next()
// })

// bikin env.port untuk membaca env port atau port 3000
const port = process.env.port || 3000

// =================== TOURS ===================
// baca data dari file json
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/tours-simple.json`
    )
)

// -------- Menampilkan semua list tour --------
// membuat sebuah function untuk merapihkan struktur code.
const getAlltours = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            tours,
        },
    })
}

// -------- Menampilkan satu data tour menggunakan ID --------
const getTourById = (req, res) => {
    const id = req.params.id * 1
    const tour = tours.find((el) => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    })
}

// -------- Menambahkan data tour menggunakan endpoint POST --------
const createTour = (req, res) => {
    // generate id untuk data baru request api kita
    // console.log(req.body.role)
    const newId = tours[tours.length - 1].id + 1
    const newData = Object.assign(
        { id: newId },
        req.body
    )

    tours.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newData,
                },
            })
        }
    )
    // res.send('udah');
}

// -------- Mengupdate data tour menggunakan endpoint PATCH --------
const editTour = (req, res) => {
    const id = req.params.id * 1
    // findIndex = -1 (kalau data nya gk ada)
    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    if (!tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }
    tours[tourIndex] = {
        ...tours[tourIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `tour with this id ${id} edited`,
                data: {
                    tour: tours[tourIndex],
                },
            })
        }
    )
}

//-------- Menghapus data tour menggunakan endpoint DELETE --------
const removeTour = (req, res) => {
    // konversi string jadi number
    const id = req.params.id * 1

    // cari index dari data yang sesuai id di req.params
    const tourIndex = tours.findIndex(
        (el) => el.id === id
    )

    // validasi kalau data yang sesuai req.param id nya ga ada
    if (tourIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: "data not found",
        })
    }

    // proses menghapus data sesuai index array nya dari req.param.id
    tours.splice(tourIndex, 1)

    // proses update di file json nya
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
                data: null,
            })
        }
    )
}

// ================== USERS ====================

// baca data dari file json
const users = JSON.parse(
    fs.readFileSync(
        `${__dirname}/dev-data/data/users.json`
    )
)

// -------- Menampilkan semua list user --------
// membuat sebuah function untuk merapihkan struktur code.
const getAllusers = (req, res) => {
    res.status(200).json({
        status: "success",
        requestTime: req.requestTime,
        data: {
            users,
        },
    })
}

// Menampilkan satu data user menggunakan ID
const getUserById = (req, res) => {
    const id = req.params.id
    const user = users.find((el) => el._id === id)

    if (!user) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    })
}

// Menambahkan data user menggunakan endpoint POST
const createUser = (req, res) => {
    // generate id untuk data baru request api kita
    // console.log(req.body.role)
    const newId = users[users.length - 1]._id
    const newData = Object.assign(
        { _id: newId },
        req.body
    )

    users.push(newData)
    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    user: newData,
                },
            })
        }
    )
    // res.send('udah');
}

// Mengupdate data user menggunakan endpoint PATCH
const editUser = (req, res) => {
    const id = req.params.id
    // findIndex = -1 (kalau data nya gk ada)
    const userIndex = users.findIndex(
        (el) => el._id === id
    )

    if (!userIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: `data with ${id} this not found`,
        })
    }
    users[userIndex] = {
        ...users[userIndex],
        ...req.body,
    }

    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: `user with this id ${id} edited`,
                data: {
                    user: users[userIndex],
                },
            })
        }
    )
}

// Menghapus data user menggunakan endpoint DELETE
const removeUser = (req, res) => {
    // konversi string jadi number
    const id = req.params.id

    // cari index dari data yang sesuai id di req.params
    const userIndex = users.findIndex(
        (el) => el._id === id
    )

    // validasi kalau data yang sesuai req.param id nya ga ada
    if (userIndex === -1) {
        return res.status(404).json({
            status: "failed",
            message: "data not found",
        })
    }

    // proses menghapus data sesuai index array nya dari req.param.id
    users.splice(userIndex, 1)

    // proses update di file json nya
    fs.writeFile(
        `${__dirname}/dev-data/data/users.json`,
        JSON.stringify(users),
        (err) => {
            res.status(200).json({
                status: "success",
                message: "berhasil delete data",
                data: null,
            })
        }
    )
}

// =============== ROUTING ================
// app.get("/api/v1/tours", getAlltours)
// app.get("/api/v1/tours/:id", getTourById)
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", editTour)
// app.delete("/api/v1/tours/:id", removeTour)

const tourRouter = express.Router()
const userRouter = express.Router()

// ROUTE UNTUK TOURS
tourRouter
    .route("/")
    .get(getAlltours)
    .post(createTour)

tourRouter
    .route("/:id")
    .get(getTourById)
    .patch(editTour)
    .delete(removeTour)

// ROUTE UNTUK TOURS

userRouter
    .route("/")
    .get(getAllusers)
    .post(createUser)

userRouter
    .route("/:id")
    .get(getUserById)
    .patch(editUser)
    .delete(removeUser)

app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})
