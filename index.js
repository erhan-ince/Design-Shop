const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const mongoose = require('mongoose');
const item = require('./models/items');

// const GalleryItem = require('./models/galleryitem');
const dbUri =
     'mongodb+srv://erhan:test@cluster0.cowxl.mongodb.net/Design-Shop?retryWrites=true&w=majority';

mongoose
     .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
     .then((result) => {
          console.log('connected to db');
          app.listen(PORT, () => {
               console.log('listening at 3001');
          });
     })
     .catch((err) => console.log(err));

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
     item.find()
          .then((result) => {
               res.render('index', { item: result });
               // console.log(result);
          })
          .catch((err) => console.log(err));
});
app.get('/add', (req, res) => {
     item.aggregate([{ $sample: { size: 6 } }]).then((result) => {
          res.render('add', { item: result });
          // console.log(req);
     });
});
app.post('/add', (req, res) => {
     const newItem = new item({
          product_name: req.body.product_name,
          Company: req.body.Company,
          Price: req.body.Price,
          product_picture_URL: req.body.product_picture_URL,
          link_shop: req.body.link_shop,
     });
     newItem
          .save()
          .then((result) => {
               console.log('new item saved');
               res.redirect('/');
          })
          .catch((err) => console.log(err));
});
app.get('/cheap', (req, res) => {
     item.find({ $expr: { $lte: [{ $toDouble: '$Price' }, 30] } })
          .then((result) => {
               res.render('cheap', { item: result });
               // console.log(req);
          })
          .catch((err) => console.log(err));
});
app.get('/random', (req, res) => {
     item.aggregate([{ $sample: { size: 6 } }])
          .limit(6)
          .then((result) => {
               res.render('random', { item: result });
               // console.log(req);
          })
          .catch((err) => console.log(err));
});
app.get('/single/:id', (req, res) => {
     console.log(req.params.id);

     item.findById(req.params.id)
          .then((result) => {
               res.render('single', { item: result });
          })
          .catch((err) => console.log(err));
});
app.get('/single/:id/delete', (req, res) => {
     item.findByIdAndDelete(req.params.id)
          .then((result) => {
               res.redirect('/');
          })
          .catch((err) => console.log(err));
});
app.post('/single/:id/edit', (req, res) => {
     const updateditem = {
          product_name: req.body.product_name,
          Company: req.body.Company,
          Price: req.body.Price,
          product_picture_URL: req.body.product_picture_URL,
          link_shop: req.body.link_shop,
     };
     item.findByIdAndUpdate(req.params.id, updateditem)
          .then((result) => {
               res.redirect(`/single/${req.params.id}`);
          })
          .catch((err) => console.log(err));
});

// app.get('/single', (req, res) => {
//      GalleryItem.findById('5f69c685e06d6207a2576856').then((result) => {
//           res.redirect('/single', { element: result });
//      });
// });
