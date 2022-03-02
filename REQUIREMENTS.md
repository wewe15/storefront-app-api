## API Endpoints

#### Authenticate

- POST "/users/authenticate" Send username and password to get an authentication token.

#### Products

- Get "/products" (Required Authorization Header) git list of all products.
- Get "/products/:id" (Required Authorization Header) git specific product by id.
- POST "/products" (Required Authorization Header) Create a new product by sending its name and price.
- DELETE "/products/:id" (Required Authorization Header) Remove a specific product by id.

#### Users

- GET "/users" (Required Authorization Header) git list of all the users.
- Get "/users/:id" (Required Authorization Header) git specific product by id.
- POST "/users" (Required Authorization Header) Create a new user by sending its username & fristname & lastname and password.
- DELETE "/users/:id" (Required Authorization Header) Remove a specific user by id.

#### Orders

- Get "/orders" (Required Authorization Header) git list of all orders.
- Get "/orders/:id" (Required Authorization Header) git specific order by id.
- POST "/orders" (Required Authorization Header) Create a new order by sending its status and user_id for the order.
- DELETE "/orders/:id" (Required Authorization Header) Remove a specific order by id.
- POST "/orders/:id/products" (Required Authorization Header) add product to order by sending its product_id and quantity.

## Database Schema

CREATE TABLE users (
id VARCHAR PRIMARY KEY,
username VARCHAR,
firstname VARCHAR,
lastname VARCHAR,
password VARCHAR,
);

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name VARCHAR,
price INT
);

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
status VARCHAR(15),
user_id bigint REFERENCES users(id)
);

CREATE TABLE order_products (
id SERIAL PRIMARY KEY,
quantity integer,
order_id bigint REFERENCES orders(id),
product_id bigint REFERENCES products(id)
);

## Data Shapes

#### Product

- id
- name
- price

#### User

- id
- username
- firstName
- lastName
- password

#### Orders

- id
- status
- user_id

### Order_products

- id
- product_id
- order_id
- quantity
