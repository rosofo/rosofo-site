import * as tf from "@tensorflow/tfjs";

const input = tf.layers.dense({
  inputShape: [1],
  units: 1,
  activation: "sigmoid",
});
export const model = tf.sequential({ layers: [input] });
model.compile({
  optimizer: "adam",
  loss: tf.losses.absoluteDifference,
  metrics: "accuracy",
});

const random = tf.randomUniform([1000, 1]);
const randomBits = random.round();
model.fit(random, randomBits);

const r = tf.randomUniform([1000, 1]);
const bits = r.round();
postMessage(model.evaluate(r, bits));
model
  .predict(tf.tensor1d([0.6]))
  .array()
  .then(postMessage);
