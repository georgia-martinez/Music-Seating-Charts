import numpy as np
import math
import os 
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

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

    x = [radius * np.sin(t) for t in theta]
    y = [radius * np.cos(t) for t in theta]

    return x, y, theta

def show_chart(radii, n_seats, seating, piece_name, show_podium=True):
    """
    Displays a seating chart. The length of radii and n_seats should be the same.

    @param radii: list specifying the radius of each semicircle
    @param n_seats: number of seats per row
    @param seating: a dictionary with the keys [1, 2, 3] and values containing the names of the people in each row (goes from right to left)
    @param piece_name: name of the piece that will be displayed at the top
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
        names = list(seating.values())[i]

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

    # Show the plot
    plt.title(piece_name, fontweight="bold")

    plt.axis("equal")
    plt.axis('off')
    plt.tight_layout()

    file_name = "seating_chart.png"
    plt.savefig(os.path.join(UPLOAD_FOLDER, file_name))

def test():    
    # Seating charts for each piece (goes from right to left in the semicircle)
    dukas = {
        0: ["Liv", "Maria", "Emory", "Ian", "Henry", "Nell"],
        1: ["Aaron", "Alex", "Nick", "Rachel", "Gus", "Emma", "Ariana", "Jacob", "Dan"],
        2: ["Andrew", "Nate", "Michael", "Roland", "Noah", "Matt", "Arielle", "Henry", "Jordan"]
    }

    whitacre = {
        0: ["Emory", "Henry", "Ian", "Liv", "Maria", "Nell"],
        1: ["Georgia", "Aaron", "Alex", "Nick", "Emma", "Rachel", "Gus", "Ariana", "Jacob"],
        2: ["Andrew", "Nate", "Michael", "Roland", "Noah", "Matt", "Arielle", "Henry", "Jordan"]
    }

    holst = {
        0: ["Henry", "Emory", "Maria", "Liv", "Ian", "Nell"],
        1: ["Aaron", "Alex", "Nick", "Emma", "Dan", "Rachel", "Ariana", "Gus", "Jacob"],
        2: ["Andrew", "Nate", "Michael", "Roland", "Noah", "Henry", "Jordan", "Matt", "Arielle"]
    }

    radii = [3, 6, 9]
    n_seats = [6, 9, 9] 

    show_chart(radii, n_seats, dukas, "Fanfare from La Peri")
    # show_chart(radii, n_seats, holst, "First Suite in Eb")