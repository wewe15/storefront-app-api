import client from '../database'

export class DashboardQueries {
  // Get all products that have been included in orders
  async productsInOrders(): Promise<{name: string, price: number, order_id: string}[]> {
    try {
        const conn = await client.connect()
        const sql = 'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.id'
        const result = await conn.query(sql)
        conn.release()

        return result.rows
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`)
    } 
  }

  // Get all users that have made orders
  async usersWithOrders(): Promise<{firstName: string, lastName: string}[]> {
    try {
        const conn = await client.connect()
        const sql = 'SELECT firstName, lastName FROM users INNER JOIN orders ON users.id = orders.user_id'
        const result = await conn.query(sql)
        conn.release()

        return result.rows
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`)
    }
  } 
}