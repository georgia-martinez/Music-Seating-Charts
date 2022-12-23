from flask import Flask, render_template, request
from create_chart import UPLOAD_FOLDER, test

import matplotlib.pyplot as plt

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/", methods=["POST","GET"])
def index():
    if request.method == "POST":
        todo = request.form.get("todo")
        test()

    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)