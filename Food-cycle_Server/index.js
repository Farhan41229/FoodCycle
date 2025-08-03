// index.js
// ──────────────────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

// Stripe setup
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ─── Express setup ────────────────────────────────────────
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── MongoDB connection ───────────────────────────────────
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}` +
  '@cluster0.ud14df5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let DonationsCollection;
let TransactionsCollection;
let UsersCollection;
let CharityRequestsCollection;
let ReviewsCollection;

async function initMongo() {
  // await client.connect();
  const db = client.db('foodCycle');
  DonationsCollection = db.collection('donations');
  TransactionsCollection = db.collection('transactions');
  UsersCollection = db.collection('users');
  CharityRequestsCollection = db.collection('charityRequests'); // initialize
  ReviewsCollection = db.collection('reviews');
  console.log('✅ Connected to MongoDB Atlas');
}
initMongo().catch((err) => {
  console.error('❌ Mongo connection failed:', err);
  process.exit(1);
});

// ─── Health ───────────────────────────────────────────────
app.get('/', (_req, res) => res.send('Welcome to the Food Cycle API'));

/* =========================================================
   DONATIONS CRUD
   ========================================================= */
app.get('/donations', async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { createdby: email.toLowerCase() } : {};
    const donations = await DonationsCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(donations);
  } catch (err) {
    console.error('GET /donations error:', err);
    res.status(500).send({ error: 'Failed to fetch donations' });
  }
});

app.get('/donations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid donation id' });

    const donation = await DonationsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!donation) return res.status(404).send({ error: 'Donation not found' });
    res.send(donation);
  } catch (err) {
    console.error('GET /donations/:id error:', err);
    res.status(500).send({ error: 'Failed to fetch donation' });
  }
});

app.post('/donations', async (req, res) => {
  try {
    const newDonation = { ...req.body, createdAt: new Date() };
    const result = await DonationsCollection.insertOne(newDonation);
    res.status(201).send(result);
  } catch (err) {
    console.error('POST /donations error:', err);
    res.status(500).send({ error: 'Failed to add donation' });
  }
});

app.put('/donations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid donation id' });

    const result = await DonationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'Donation not found' });

    res.send({ message: 'Donation updated successfully' });
  } catch (err) {
    console.error('PUT /donations/:id error:', err);
    res.status(500).send({ error: 'Failed to update donation' });
  }
});

app.delete('/donations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid donation id' });

    const result = await DonationsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (!result.deletedCount)
      return res.status(404).send({ error: 'Donation not found' });

    res.send({ message: 'Donation deleted', id });
  } catch (err) {
    console.error('DELETE /donations/:id error:', err);
    res.status(500).send({ error: 'Failed to delete donation' });
  }
});

/* =========================================================
   PAYMENT (Stripe)
   ========================================================= */
app.post('/create-payment-intent', async (_req, res) => {
  const amountInCents = 50000;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'bdt',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment Intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* =========================================================
   TRANSACTIONS CRUD
   ========================================================= */

app.get('/transactions', async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { createdby: email.toLowerCase() } : {};
    const transactions = await TransactionsCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(transactions);
  } catch (err) {
    console.error('GET /transactions error:', err);
    res.status(500).send({ error: 'Failed to fetch transactions' });
  }
});

app.get('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid transaction id' });

    const tx = await TransactionsCollection.findOne({ _id: new ObjectId(id) });
    if (!tx) return res.status(404).send({ error: 'Transaction not found' });
    res.send(tx);
  } catch (err) {
    console.error('GET /transactions/:id error:', err);
    res.status(500).send({ error: 'Failed to fetch transaction' });
  }
});

app.post('/transactions', async (req, res) => {
  try {
    const newTransaction = { ...req.body, createdAt: new Date() };
    const result = await TransactionsCollection.insertOne(newTransaction);
    res.status(201).send(result);
  } catch (err) {
    console.error('POST /transactions error:', err);
    res.status(500).send({ error: 'Failed to add transaction' });
  }
});

app.put('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid transaction id' });

    const result = await TransactionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'Transaction not found' });

    res.send({ message: 'Transaction updated successfully' });
  } catch (err) {
    console.error('PUT /transactions/:id error:', err);
    res.status(500).send({ error: 'Failed to update transaction' });
  }
});

app.delete('/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid transaction id' });

    const result = await TransactionsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (!result.deletedCount)
      return res.status(404).send({ error: 'Transaction not found' });

    res.send({ message: 'Transaction deleted', id });
  } catch (err) {
    console.error('DELETE /transactions/:id error:', err);
    res.status(500).send({ error: 'Failed to delete transaction' });
  }
});

/* =========================================================
   USERS CRUD
   ========================================================= */
app.get('/users', async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email: email.toLowerCase() } : {};
    const users = await UsersCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(users);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).send({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid user id' });

    const user = await UsersCollection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.send(user);
  } catch (err) {
    console.error('GET /users/:id error:', err);
    res.status(500).send({ error: 'Failed to fetch user' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const newUser = { ...req.body, createdAt: new Date() };
    const result = await UsersCollection.insertOne(newUser);
    res.status(201).send(result);
  } catch (err) {
    console.error('POST /users error:', err);
    res.status(500).send({ error: 'Failed to add user' });
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid user id' });

    const result = await UsersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'User not found' });

    res.send({ message: 'User updated successfully' });
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    res.status(500).send({ error: 'Failed to update user' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid user id' });

    const result = await UsersCollection.deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount)
      return res.status(404).send({ error: 'User not found' });

    res.send({ message: 'User deleted', id });
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).send({ error: 'Failed to delete user' });
  }
});

/* =========================================================
   REVIEWS CRUD
   ========================================================= */
app.get('/reviews', async (req, res) => {
  try {
    const { email, RESemail } = req.query;
    let filter = {};
    if (email && RESemail)
      filter = { Useremail: email, Restaurant_Email: RESemail };
    else if (email) filter = { Useremail: email };
    else if (RESemail) filter = { Restaurant_Email: RESemail };

    const results = await ReviewsCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    console.log('Reviews fetched:', results);
    res.send(results);
  } catch (err) {
    console.error('Something Went Wrong: ', err);
    res.status(500).send({ error: 'Failed to fetch reviews' });
  }
});

app.get('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const results = await ReviewsCollection.findOne({
      _id: new ObjectId(id),
    });
    res.send(results);
  } catch (error) {
    console.log('Something Went Wrong: ', error);
  }
});
app.post('/reviews', async (req, res) => {
  try {
    const doc = { ...req.body };
    const now = new Date();
    doc.createdAt = now;
    doc.updatedAt = now;
    const result = await ReviewsCollection.insertOne(doc);
    res.status(200).send(result);
  } catch (error) {
    console.log('Something Went Wrong: ', error);
  }
});
app.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ReviewsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    res.send(result);
  } catch (error) {
    console.log('Something Went Wrong: ', error);
  }
});
app.put('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  const doc = { ...req.body };
  const now = new Date();
  doc.updatedAt = now;
  const result = await ReviewsCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    { $set: doc }
  );
  res.send(result);
});

/* =========================================================
   CHARITY REQUESTS CRUD (NEW)
   ========================================================= */

/**
 * POST /requests
 * Insert a new charity request document.
 * Adds createdAt & updatedAt timestamps.
 */
app.post('/requests', async (req, res) => {
  try {
    const doc = { ...req.body };
    const now = new Date();
    doc.createdAt = now;
    doc.updatedAt = now;

    // Attempt to coerce certain id-like fields if valid 24-hex
    if (doc.charity_ID && ObjectId.isValid(doc.charity_ID)) {
      doc.charity_ID = new ObjectId(doc.charity_ID);
    }
    if (doc.Donation_ID && ObjectId.isValid(doc.Donation_ID)) {
      doc.Donation_ID = new ObjectId(doc.Donation_ID);
    }

    const result = await CharityRequestsCollection.insertOne(doc);
    res.status(201).send(result);
  } catch (err) {
    console.error('POST /requests error:', err);
    res.status(500).send({ error: 'Failed to create request' });
  }
});

/**
 * GET /requests
 * Supports:
 *   - /requests                       -> all
 *   - /requests?email=...             -> by Charity_Email
 *   - /requests?RESemail=...          -> by Restaurant_Email
 *   - /requests?email=...&RESemail=...-> OR either matches
 */
app.get('/requests', async (req, res) => {
  try {
    const { email, RESemail } = req.query;
    let filter = {};

    if (email && RESemail) {
      // Ensure both fields are checked properly for the same document (AND condition)
      filter = {
        Charity_Email: email,
        Restaurant_Email: RESemail,
      };
    } else if (email) {
      filter = { Charity_Email: email };
    } else if (RESemail) {
      filter = { Restaurant_Email: RESemail };
    }

    const requests = await CharityRequestsCollection.find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.send(requests);
  } catch (err) {
    console.error('GET /requests error:', err);
    res.status(500).send({ error: 'Failed to fetch requests' });
  }
});

/**
 * GET /requests/:id
 * Fetch single request by _id.
 */
app.get('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid request id' });

    const request = await CharityRequestsCollection.findOne({
      _id: new ObjectId(id),
    });
    if (!request) return res.status(404).send({ error: 'Request not found' });

    res.send(request);
  } catch (err) {
    console.error('GET /requests/:id error:', err);
    res.status(500).send({ error: 'Failed to fetch request' });
  }
});

/**
 * PUT /requests/:id
 * Partial update: only sets provided fields + updates updatedAt.
 * createdAt is preserved (ignored if present in body).
 */
app.put('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid request id' });

    const payload = { ...req.body };

    // Never allow createdAt overwrite
    if ('createdAt' in payload) {
      delete payload.createdAt;
    }
    payload.updatedAt = new Date();

    // Coerce ID-like fields if provided
    if (payload.charity_ID && ObjectId.isValid(payload.charity_ID)) {
      payload.charity_ID = new ObjectId(payload.charity_ID);
    }
    if (payload.Donation_ID && ObjectId.isValid(payload.Donation_ID)) {
      payload.Donation_ID = new ObjectId(payload.Donation_ID);
    }

    const result = await CharityRequestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: payload }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'Request not found' });

    res.send({ message: 'Request updated successfully' });
  } catch (err) {
    console.error('PUT /requests/:id error:', err);
    res.status(500).send({ error: 'Failed to update request' });
  }
});

/**
 * DELETE /requests/:id
 * Remove a request by _id.
 */
app.delete('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid request id' });

    const result = await CharityRequestsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (!result.deletedCount)
      return res.status(404).send({ error: 'Request not found' });

    res.send({ message: 'Request deleted', id });
  } catch (err) {
    console.error('DELETE /requests/:id error:', err);
    res.status(500).send({ error: 'Failed to delete request' });
  }
});

/* =========================================================
   Graceful Shutdown
   ========================================================= */
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully…');
  try {
    // await client.close();
  } catch (e) {}
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
