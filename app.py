from flask import Flask, render_template, request, send_from_directory, url_for, redirect
from create_chart import UPLOAD_FOLDER, test
import os

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
FILENAME = "seating_chart.png"

@app.route("/uploads/<filename>")
def get_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/", methods=["POST", "GET"])
def index():
    file_url = request.args.get("file_url")

    if request.method == "POST":
        if "create_chart" in request.form:
            test()
            file_url = url_for("get_file", filename=FILENAME)
            return redirect(url_for("index", file_url=file_url))

    return render_template("index.html", file_url=file_url)

if __name__ == "__main__":
    path = os.path.join(app.config["UPLOAD_FOLDER"], FILENAME)

    if os.path.exists(path):
        os.remove(path)

    app.run(debug=True)