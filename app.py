from flask import Flask, render_template, request, send_from_directory, url_for, redirect
from werkzeug.utils import secure_filename
from create_chart import UPLOAD_FOLDER, load_chart
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_key"
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
            file_url = url_for("get_file", filename=FILENAME)
            return redirect(url_for("index", file_url=file_url))    

        elif "upload_file" in request.form:
            # https://thinkinfi.com/flask-upload-display-file/    

            uploaded_df = request.files['uploaded-file']    
            data_filename = secure_filename(uploaded_df.filename)    
            uploaded_df.save(os.path.join(app.config['UPLOAD_FOLDER'], data_filename))

            data_path = os.path.join(app.config['UPLOAD_FOLDER'], data_filename)
            load_chart(data_path)

            file_url = url_for("get_file", filename=FILENAME)
            return redirect(url_for("index", file_url=file_url))  

    return render_template("index.html", file_url=file_url)

if __name__ == "__main__":
    path = os.path.join(app.config["UPLOAD_FOLDER"], FILENAME)

    if os.path.exists(path):
        os.remove(path)

    app.run(debug=True)