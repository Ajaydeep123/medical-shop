import dotenv from 'dotenv';



import neo4j from 'neo4j-driver';
// Load environment variables
dotenv.config();

const driver = neo4j.driver(
    'bolt://smarter-codes-neo4j-1:7687',
    neo4j.auth.basic('neo4j','bitnami1'),
  );

const cypherQuery= `
WITH 'https://raw.githubusercontent.com/Ajaydeep123/neo4j-practice/main/datasets/products_sample_01.json' AS url 
CALL apoc.load.json(url) YIELD value AS products

UNWIND products AS product

MERGE (p:Product {id: product._id})
SET p.page_title = product.page_title

FOREACH (feature IN product['product-features'] |
  MERGE (pf:ProductFeature {name: feature})
  MERGE (p)-[:HAS_FEATURE]->(pf)
)

MERGE (spec:Specification {product_id: product._id})
SET spec += product.specifications
MERGE (p)-[:HAS_SPECIFICATION]->(spec)

MERGE (s:Schema {product_id: product._id})
SET s += {image: product.schema.image, description: product.schema.description}
MERGE (p)-[:HAS_SCHEMA]->(s)

MERGE (m:Manufacturer {name: product.specifications.Manufacturer})
MERGE (p)-[:MANUFACTURED_BY]->(m)

MERGE (cg:ProductGroup {id: product.categoryId})
MERGE (p)-[:BELONGS_TO_GROUP]->(cg)

FOREACH (brandName IN CASE WHEN product.specifications.Brand IS NULL THEN ['Unknown'] ELSE [product.specifications.Brand] END |
  MERGE (b:Brand {name: brandName})
  MERGE (p)-[:BELONGS_TO_BRAND]->(b))
  `
  const runQuery = async () => {
    const session = driver.session();
    try {
      await session.run(cypherQuery);
      console.log('Cypher query executed successfully!');
    } catch (error) {
      console.error('Error executing Cypher query:', error.message);
    } finally {
      await session.close();
      await driver.close();
    }
  };
  
  // Call the async function to run the query
  runQuery();