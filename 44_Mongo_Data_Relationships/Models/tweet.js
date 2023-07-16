const mongoose = require("mongoose");
const { Schema } = mongoose;

const db = "mongooseRelationshipsDemo";
const URI = `mongodb://localhost:27017/${db}`;

mongoose.set("strictQuery", true);

mongoose
  .connect(URI)
  .then(() => {
    console.log(`🚀 Connected to ${db} db`);
  })
  .catch((err) => {
    console.error(err);
  });

const userSchema = new Schema({
  name: String,
});

const tweetSchema = new Schema({
  tweetText: String,
  likes: Number,
  user: Schema.Types.ObjectId,
});

const User = new mongoose.model("User", userSchema);
const Tweet = new mongoose.model("Tweet", tweetSchema);

const makeTweet = async () => {
  const u = new User({ name: "Doroke" });
  const t = new Tweet({
    tweetText: "mid or feed",
    likes: 99,
    user: u,
  });
  console.log(t);
  await u.save();
  await t.save();
};

// makeTweet();

const addTweet = async () => {
  const u = await User.findOne({ name: "Doroke" });
  const t = new Tweet({
    tweetText: "In Bed with Zed",
    likes: 2,
  });
  t.user = u;
  await t.save();
};

// addTweet();

const findTweet = async () => {
    const tweets = await Tweet.findOne({}).populate('user').exec();
    console.log(tweets);
}

findTweet();