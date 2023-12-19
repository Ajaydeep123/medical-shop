const neo4j = require('neo4j-driver');
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const dotenv = require('dotenv');
const randomstring = require('randomstring');

dotenv.config();

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j','bitnami1'),
  );

const WooCommerce = new WooCommerceRestApi({
    url: 'http://localhost:80', // Your store URL
    consumerKey: 'ck_4303cfb7ed6196b04ed1ecb6b367c8840e82407e', // Your consumer key
    consumerSecret: 'cs_c8b7a59350048f213c1cac1f3ba7a66a363bb1ac', // Your consumer secret
    version: 'wc/v3'
});

const mapCategoryId = (categoryId) => {
    const categoryMapping = {
      7162: 16,
      38628: 17,
      353765: 18,
      37475: 19,
      1537374: 20,
      25972406: 21,
      1001221: 22,
      1412952: 23,
      37472: 24
    };
  
    return categoryMapping[categoryId] || 15;
  };

  function generateRandomString(length) {
    return randomstring.generate({
      length,
      charset: 'alphanumeric',
    }).toUpperCase();
  }


const cypherQuery = `
  MATCH (p:Product)
  WITH p.id AS productId, p
  ORDER BY rand()
  MATCH (p)-[:HAS_SCHEMA]->(s:Schema)
  MATCH (p)-[:HAS_FEATURE]->(pf:ProductFeature)
  MATCH (p)-[:MANUFACTURED_BY]->(m:Manufacturer)
  MATCH (p)-[:HAS_SPECIFICATION]->(spec:Specification)
  MATCH (p)-[:BELONGS_TO_GROUP]->(g:ProductGroup)
  RETURN productId, s.image AS image, s.description AS description, m.name AS manufacturer, g.id as categoryId,
         p.page_title AS pageTitle, COLLECT(pf.name) AS productFeatures,
         {
           manufacturerNumber: spec['Manufacturer #'],
           mckessonNumber: spec['McKesson #'],
           unspscCode: spec['UNSPSC Code'],
           dimensions: spec.Dimensions,
           countryoforgin: spec['Country of Origin'],
           application: spec.Application,
           capacity: spec.Capacity,
           filtertype: spec['Filter Type'],
           speed: spec.Speed
         } AS specifications
`;

const session = driver.session();
session.run(cypherQuery)
  .then(result => {
    result.records.forEach(record => {
      // Processing Results and Creating WooCommerce Products
      const product_id = record.get('productId');
      const description = record.get('description')||'';
      const manufacturer = record.get('manufacturer');
      const page_title = record.get('pageTitle');
      const product_features = record.get('productFeatures');
      const specifications = record.get('specifications');
      const category_id = record.get('categoryId');
      const new_category_id = mapCategoryId(category_id);

      // Generate a random regular price between 10 and 100
      const regular_price = (Math.random() * (2500 - 1000) + 1000).toFixed(2);

      // Get the image links
      const title = record.get('pageTitle') || '';
      const title_description = title + ' ' + description;

      const image_links = record.get('image');

      // Generate unique string
      const random_string = generateRandomString(10);

      // Prepare product data for WooCommerce
      const data = {
        sku: random_string,
        name: page_title,
        type: 'simple',
        regular_price: regular_price.toString(),
        description: product_features.join(' '),
        short_description: description,
        categories: [
          {
            id: new_category_id,
          },
        ],
        images: [
          {
            src: image_links,
          },
        ],
        attributes: [
          {
            name: 'Manufacturer Number',
            position: 0,
            visible: true,
            variation: false,
            options: [
              specifications.manufacturerNumber,
            ],
          },
          {
            name: 'UNSPSC Code',
            position: 0,
            visible: true,
            variation: false,
            options: [
              specifications.unspscCode,
            ],
          },
          {
            name: 'Application',
            position: 0,
            visible: true,
            variation: false,
            options: [
              specifications.application,
            ],
          },
          {
            name: 'McKesson Number',
            position: 1,
            visible: true,
            variation: false,
            options: [
              specifications.mckessonNumber,
            ],
          },
        ],
      };

      // Create the product in WooCommerce
      WooCommerce.post('products',data)
      .then((response) => {
        // Successful request
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", response.data);
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
        console.log("Response Status:", error.response.status);
        console.log("Response Headers:", error.response.headers);
        console.log("Response Data:", error.response.data);
      })
    });
  })
  .catch(error => console.error('Error executing Cypher query:', error))
  .finally(() => {
    session.close();
    driver.close();
  });