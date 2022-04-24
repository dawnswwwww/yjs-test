import knex from 'knex';
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: resolve(__dirname, './data.db'),
  },
})

const init = async () => {
  try {
    // Create a table
    await db.schema
      .createTableIfNotExists('users', table => {
        table.increments('id');
        table.string('user_name');
      })
      // ...and another
      .createTableIfNotExists('accounts', table => {
        table.increments('id');
        table.string('account_name');
        table
          .integer('user_id')
          .unsigned()
          .references('users.id');
      })
  
    // Then query the table...
    const insertedRows = await db('users').insert({ user_name: 'Tim' })
  
    // ...and using the insert id, insert into the other table.
    await db('accounts').insert({ account_name: 'knex', user_id: insertedRows[0] })
  
    // Query both of the rows.
    const selectedRows = await db('users')
      .join('accounts', 'users.id', 'accounts.user_id')
      .select('users.user_name as user', 'accounts.account_name as account')
  
    // map over the results
    const enrichedRows = selectedRows.map(row => ({ ...row, active: true }))
  
    // Finally, add a catch statement
  } catch(e) {
    console.error(e);
  };
}

// db.migrate.latest();



export default {
  init,
}