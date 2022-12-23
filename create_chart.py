import numpy as np
import math
import os 
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
import json

matplotlib.use("Agg") # prevents thread issues with matplotlib and flask

UPLOAD_FOLDER = os.path.join("static", "uploads")

def get_points(radius, step_size):
    """
    Given a radius and a step size, returns evenly spaced points around a semicircle

    @param radius: radius of the circle
    @param step_size: number of points in each line
    @return x, y: (x, y) coordinates
    """

    theta = np.linspace(np.pi/2, 3*np.pi/2, step_size, endpoint=True)
    # theta = np.linspace(-np.pi/2, -3*np.pi/2, step_size, endpoint=True)

    x = [radius * np.sin(t) for t in theta]
    y = [radius * np.cos(t) for t in theta]

    return x, y, theta

def create_chart(radii, n_seats, rows, chart_title, show_podium=True):
    """
    Displays a seating chart. The length of radii and n_seats should be the same.

    @param radii: list specifying the radius of each semicircle
    @param n_seats: number of seats per row
    @param rows: a dictionary with the keys [0, 1, 2, ..., etc] and values containing the names of the people in each row (goes from right to left)
    @param chart_title: name of the chart that will be displayed at the top
    """

    assert len(radii) == len(n_seats)

    fig = plt.figure()
    ax = fig.add_subplot(111)

    # Plot the points
    for i, (r, n) in enumerate(zip(radii, n_seats)):
        x_vals, y_vals, theta_vals = get_points(r, n)

        x1, y1, _ = get_points(r, 1000)
        ax.plot(x1, y1, "-k")

        # Add names to the points
        names = list(rows.values())[i]

        for j, (x, y, theta) in enumerate(zip(x_vals, y_vals, theta_vals)):
            N = 1
            angle = math.degrees(theta)

            seat = Rectangle((x-N/2, y-N/2), N, N, angle=-angle, rotation_point="center", edgecolor="black", facecolor="white", zorder=2)
            ax.add_patch(seat)

            name =  plt.text(x, y, names[j], bbox=dict(edgecolor="none", facecolor="white", pad=.5), ha="center", va="center")

    # Plot the podium
    if show_podium:
        width = 2.5
        height = 1

        podium = Rectangle((-width/2, -height/2), width, height, edgecolor="black", facecolor="white")
        ax.add_patch(podium)

        text =  plt.text(0, 0, "Podium", ha="center", va="center")

    # Formatting
    plt.title(chart_title, fontweight="bold")

    plt.axis("equal")
    plt.axis("off")
    plt.tight_layout()

    # Save the image
    file_name = "seating_chart.png"
    plt.savefig(os.path.join(UPLOAD_FOLDER, file_name))    

    # Save data to JSON
    data = {
        "radii": radii,
        "n_seats": n_seats,
        "rows": rows,
        "chart_title": chart_title,
        "show_podium": show_podium
    }

    save_chart(UPLOAD_FOLDER, chart_title, data)

def save_chart(path, file_name, data):

    file_name = "_".join(file_name.split())
    file_path = os.path.join(path, file_name)

    with open(f"{file_path}.json", "w") as json_file:
        json.dump(data, json_file, indent=2)

def load_chart(data_path):
    with open(data_path, "r") as json_file:
        d = json.load(json_file)
        create_chart(d["radii"], d["n_seats"], d["rows"], d["chart_title"], d["show_podium"])