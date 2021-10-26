import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

const client = new mongodb.MongoClient(process.env.MONGO_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cryptPassword = (password) => new Promise((resolve, reject) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return reject(err); }

    return bcrypt.hash(password, salt,
      (hashErr, hash) => (hashErr ? reject(hashErr) : resolve(hash)));
  });
});

const run = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = await client.db('base_api');
    const users = db.collection('users');

    const username = 'db-adm';
    const passwordHash = await cryptPassword('myadminpwd');

    const result = await users.insertOne({
      username,
      passwordHash,
    });

    console.log(`New user added with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
};

run().catch(console.dir);
