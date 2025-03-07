import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = "model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

class_names = ["Healthy", "Powdery Mildew", "Rust"]

UPLOAD_FOLDER = "static/uploaded_images/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def predict_image(image_path):
    """Preprocess and predict the class of the image."""
    img = load_img(image_path, target_size=(225, 225))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions)
    return class_names[class_idx], float(predictions[0][class_idx])


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    filename = secure_filename(file.filename)
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(image_path)

    label, confidence = predict_image(image_path)

    return jsonify({"classification": label, "confidence": f"{confidence:.2%}"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
