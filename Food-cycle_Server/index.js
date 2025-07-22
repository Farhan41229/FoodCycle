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
let CharityRequestsCollection; // NEW collection reference

async function initMongo() {
  await client.connect();
  const db = client.db('foodCycle');
  DonationsCollection = db.collection('donations');
  TransactionsCollection = db.collection('transactions');
  UsersCollection = db.collection('users');
  CharityRequestsCollection = db.collection('charityRequests'); // initialize
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
   REVIEWS (legacy separate endpoints)
   ========================================================= */
app.patch('/users/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid user id' });

    const review = { ...req.body };
    if (review._id && ObjectId.isValid(review._id)) {
      review._id = new ObjectId(review._id);
    } else if (!review._id) {
      review._id = new ObjectId();
    } else {
      return res.status(400).send({ error: 'Invalid review _id format' });
    }
    review.createdAt = review.createdAt
      ? new Date(review.createdAt)
      : new Date();

    const result = await UsersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'User not found' });

    res.send({ message: 'Review added to user', reviewId: review._id });
  } catch (err) {
    console.error('PATCH /users/:id/reviews error:', err);
    res.status(500).send({ error: 'Failed to add review to user' });
  }
});

app.patch('/donations/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).send({ error: 'Invalid donation id' });

    const review = { ...req.body };
    if (review._id && ObjectId.isValid(review._id)) {
      review._id = new ObjectId(review._id);
    } else if (!review._id) {
      review._id = new ObjectId();
    } else {
      return res.status(400).send({ error: 'Invalid review _id format' });
    }
    review.createdAt = review.createdAt
      ? new Date(review.createdAt)
      : new Date();

    const result = await DonationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: review } }
    );
    if (!result.matchedCount)
      return res.status(404).send({ error: 'Donation not found' });

    res.send({ message: 'Review added to donation', reviewId: review._id });
  } catch (err) {
    console.error('PATCH /donations/:id/reviews error:', err);
    res.status(500).send({ error: 'Failed to add review to donation' });
  }
});

/* =========================================================
   NEW UNIFIED REVIEW CREATION (single call = single _id)
   ========================================================= */
app.post('/reviews', async (req, res) => {
  try {
    const {
      userId,
      donationId,
      rating,
      description,
      donationTitle,
      restaurantName,
      reviewerId, // optional if same as userId
      reviewerName,
      reviewerEmail,
      reviewerImage,
      reviewTime, // optional external timestamp
    } = req.body;

    if (!userId || !donationId)
      return res.status(400).send({ error: 'userId and donationId required' });
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(donationId))
      return res.status(400).send({ error: 'Invalid userId or donationId' });

    const reviewId = new ObjectId();
    const now = new Date();
    const reviewDoc = {
      _id: reviewId,
      donationId: new ObjectId(donationId),
      donationTitle,
      restaurantName,
      reviewerId:
        reviewerId && ObjectId.isValid(reviewerId)
          ? new ObjectId(reviewerId)
          : new ObjectId(userId),
      reviewerName,
      reviewerEmail,
      reviewerImage,
      description,
      rating,
      reviewTime: reviewTime ? new Date(reviewTime) : now,
      createdAt: now,
    };

    // Insert into user
    const userUpdate = await UsersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { reviews: reviewDoc } }
    );
    if (!userUpdate.matchedCount)
      return res.status(404).send({ error: 'User not found' });

    // Insert into donation
    const donationUpdate = await DonationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $push: { reviews: { ...reviewDoc } } }
    );
    if (!donationUpdate.matchedCount)
      return res.status(404).send({ error: 'Donation not found' });

    res.status(201).send({ message: 'Review created', reviewId });
  } catch (err) {
    console.error('POST /reviews error:', err);
    res.status(500).send({ error: 'Failed to create review' });
  }
});

/* =========================================================
   REVIEW DELETION
   ========================================================= */
app.delete('/users/:userId/reviews/:reviewId', async (req, res) => {
  try {
    const { userId, reviewId } = req.params;
    if (!ObjectId.isValid(userId))
      return res.status(400).send({ error: 'Invalid user id' });

    const reviewIdFilter = ObjectId.isValid(reviewId)
      ? new ObjectId(reviewId)
      : reviewId;

    const result = await UsersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { reviews: { _id: reviewIdFilter } } }
    );

    if (!result.modifiedCount)
      return res.status(404).send({ error: 'Review not found in user' });

    res.send({ message: 'Review deleted from user', reviewId });
  } catch (err) {
    console.error('DELETE /users/:userId/reviews/:reviewId error:', err);
    res.status(500).send({ error: 'Failed to delete review from user' });
  }
});

app.delete('/donations/:donationId/reviews/:reviewId', async (req, res) => {
  try {
    const { donationId, reviewId } = req.params;
    if (!ObjectId.isValid(donationId))
      return res.status(400).send({ error: 'Invalid donation id' });

    const reviewIdFilter = ObjectId.isValid(reviewId)
      ? new ObjectId(reviewId)
      : reviewId;

    const result = await DonationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $pull: { reviews: { _id: reviewIdFilter } } }
    );

    if (!result.modifiedCount)
      return res.status(404).send({ error: 'Review not found in donation' });

    res.send({ message: 'Review deleted from donation', reviewId });
  } catch (err) {
    console.error(
      'DELETE /donations/:donationId/reviews/:reviewId error:',
      err
    );
    res.status(500).send({ error: 'Failed to delete review from donation' });
  }
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
    await client.close();
  } catch (e) {}
  process.exit(0);
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
