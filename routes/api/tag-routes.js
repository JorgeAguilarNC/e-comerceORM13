const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

  // find all tags
  // be sure to include its associated Product data
  router.get('/', (req, res) => {
    Tag.findAll({
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['product_name'],
          through: ProductTag,
          as: 'tagged_products'
        }
      ]
    })
    .then(tags => {
      if (!tags) {
        res.status(404).json({ message: 'No tags found.'})
      } else {
        res.json(tags);
      };
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

 // find a single tag by its `id`
  // be sure to include its associated Product data
  router.get('/:id', (req, res) => {
    Tag.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'tag_name'
      ],
      include: [
        {
          model: Product,
          attributes: ['product_name'],
          through: ProductTag,
          as: 'tagged_products'
        }
      ]
    })
    .then(tag => {
      if (!tag) {
        res.status(404).json({ message: 'No tag found with this ID.'});
      } else {
        res.json(tag);
      };
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

 // create a new tag
 router.post('/', (req, res) => {
  // expects {tag_name: 'STRING'}
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(newTag => res.json(newTag))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

  // update a tag's name by its `id` value
  router.put('/:id', (req, res) => {
    // expects { tag_name: 'NEWSTRING' }
    Tag.update( req.body, {
      where: {
        id: req.params.id
      }
    })
    .then((tagData) => {
      // get updated row
      return Tag.findOne({
        where: {
          id: req.params.id
        },
        attributes: [
          'id',
          'tag_name'
        ],
        include: [
          {
            model: Product,
            attributes: ['product_name'],
            through: ProductTag,
            as: 'tagged_products'
          }
        ]
      })
    })
    .then(updatedTag => res.json(updatedTag))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  });

  // delete on tag by its `id` value
  router.delete('/:id', (req, res) => {
    Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(tagData => {
      if (!tagData) {
        res.status(404).json({ message: 'No tag found with this ID.'});
      } else {
        res.json(tagData);
      };
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  module.exports = router;
