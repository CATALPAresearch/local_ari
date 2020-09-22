/**
 *
 * @author Niels Seidel <niels.seidel@fernuni-hagen.de>
 * @version 1.0-20200409
 * @description Reinforcement Learning (rl) for adapting rule actions
 *
 * TODO
 * - https://www.newworldai.com/cs234-reinforcement-learning-lectures-stanford-engineering/
 * - get tensor flow running
 * - build test case for basic rewards
 */

 // @ts-ignore
import * as tf from 'http://localhost/moodle/local/ari/lib/build/tf.min';

//import * as tf from '@tensorflow/tfjs';
//import * as tf from '//cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js';

export async function runTF() {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

    // Train the model using the data.
    await model.fit(xs, ys, { epochs: 250 });

    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    //document.getElementById('micro-out-div').innerText =
     console.log('Tensor:: ',(model.predict(tf.tensor2d([20], [1, 1])) as tf.Tensor).dataSync());
}