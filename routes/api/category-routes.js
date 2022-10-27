const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  Category.findAll({
    attributes: [
      'id',
      'category_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name', 'id', 'price', 'stock'],
      }
    ]
  })
  .then(tags => {
    if (!tags) {
      res.status(404).json({ message: 'No categories found.'})
    } else {
      res.json(tags);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// find a category by its ID
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'category_name'
    ],
    include: [
      {
        model: Product,
        attributes: ['product_name', 'id', 'price', 'stock'],
      }
    ]
  })
  .then(category => {
    if (!category) {
      res.status(404).json({ message: 'No category found with this ID.'});
    } else {
      res.json(category);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// create a new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(newCategory => res.json(newCategory))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

// update a category's name by its ID
router.put('/:id', (req, res) => {
  // expects { category_name: 'NEWSTRING' }
  Category.update( req.body, {
    where: {
      id: req.params.id
    }
  })
  .then((categoryData) => {
    // get updated row
    return Category.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'category_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['product_name', 'id', 'price', 'stock'],
        }
      ]
    })
  })
  .then(updatedCategory => res.json(updatedCategory))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

// delete a category by its ID
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(categoryData => {
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this ID.'});
    } else {
      res.json(categoryData);
    };
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
